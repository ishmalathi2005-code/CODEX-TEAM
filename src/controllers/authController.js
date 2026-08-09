const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const { supabase } = require('../config/db');
const asyncHandler = require('../utils/asyncHandler');
const { successResponse, createdResponse, errorResponse } = require('../utils/apiResponse');
const { generateAccessToken, generateRefreshToken, verifyRefreshToken } = require('../utils/generateToken');
const emailService = require('../services/emailService');

// ─── Register ─────────────────────────────────────────────────────────────────
exports.register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  // Check existing
  const { data: existing } = await supabase.from('users').select('id').eq('email', email).maybeSingle();
  if (existing) return errorResponse(res, 'An account with this email already exists.', 409);

  const salt = await bcrypt.genSalt(12);
  const hashedPassword = await bcrypt.hash(password, salt);

  const { data: user, error } = await supabase
    .from('users')
    .insert({ name, email, password: hashedPassword })
    .select('id, name, email, role, is_active, is_email_verified, created_at')
    .single();

  if (error) return errorResponse(res, error.message, 500);

  // Auto-create empty profile
  await supabase.from('profiles').insert({ user_id: user.id });

  const accessToken = generateAccessToken(user.id, user.role);
  const refreshToken = generateRefreshToken(user.id);

  await supabase.from('users').update({ refresh_token: refreshToken }).eq('id', user.id);

  return createdResponse(res, 'Account created successfully.', { user, accessToken, refreshToken });
});

// ─── Login ────────────────────────────────────────────────────────────────────
exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const { data: user } = await supabase.from('users').select('*').eq('email', email).maybeSingle();
  if (!user) return errorResponse(res, 'Invalid email or password.', 401);

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return errorResponse(res, 'Invalid email or password.', 401);

  if (!user.is_active) return errorResponse(res, 'Account is deactivated. Contact support.', 403);

  const accessToken = generateAccessToken(user.id, user.role);
  const refreshToken = generateRefreshToken(user.id);

  await supabase.from('users').update({ refresh_token: refreshToken, last_login: new Date().toISOString() }).eq('id', user.id);

  const { password: _, refresh_token: __, ...safeUser } = user;
  return successResponse(res, 'Login successful.', { user: safeUser, accessToken, refreshToken });
});

// ─── Logout ───────────────────────────────────────────────────────────────────
exports.logout = asyncHandler(async (req, res) => {
  await supabase.from('users').update({ refresh_token: null }).eq('id', req.user.id);
  return successResponse(res, 'Logged out successfully.');
});

// ─── Refresh Token ────────────────────────────────────────────────────────────
exports.refreshToken = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return errorResponse(res, 'Refresh token is required.', 400);

  let decoded;
  try { decoded = verifyRefreshToken(refreshToken); }
  catch { return errorResponse(res, 'Invalid or expired refresh token.', 401); }

  const { data: user } = await supabase.from('users').select('id, role, refresh_token').eq('id', decoded.id).maybeSingle();
  if (!user || user.refresh_token !== refreshToken) return errorResponse(res, 'Refresh token revoked.', 401);

  const newAccessToken = generateAccessToken(user.id, user.role);
  const newRefreshToken = generateRefreshToken(user.id);
  await supabase.from('users').update({ refresh_token: newRefreshToken }).eq('id', user.id);

  return successResponse(res, 'Token refreshed.', { accessToken: newAccessToken, refreshToken: newRefreshToken });
});

// ─── Forgot Password ──────────────────────────────────────────────────────────
exports.forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const { data: user } = await supabase.from('users').select('id, name, email').eq('email', email).maybeSingle();
  if (!user) return successResponse(res, 'If an account with that email exists, a reset link has been sent.');

  const resetToken = crypto.randomBytes(32).toString('hex');
  const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  const expires = new Date(Date.now() + 30 * 60 * 1000).toISOString();

  await supabase.from('users').update({ password_reset_token: hashedToken, password_reset_expires: expires }).eq('id', user.id);

  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
  try { await emailService.sendPasswordReset(user.email, user.name, resetUrl); }
  catch {
    await supabase.from('users').update({ password_reset_token: null, password_reset_expires: null }).eq('id', user.id);
    return errorResponse(res, 'Failed to send reset email.', 500);
  }
  return successResponse(res, 'If an account with that email exists, a reset link has been sent.');
});

// ─── Reset Password ───────────────────────────────────────────────────────────
exports.resetPassword = asyncHandler(async (req, res) => {
  const { token, password } = req.body;
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

  const { data: user } = await supabase
    .from('users')
    .select('id')
    .eq('password_reset_token', hashedToken)
    .gt('password_reset_expires', new Date().toISOString())
    .maybeSingle();

  if (!user) return errorResponse(res, 'Reset token is invalid or has expired.', 400);

  const salt = await bcrypt.genSalt(12);
  const hashedPassword = await bcrypt.hash(password, salt);

  await supabase.from('users').update({
    password: hashedPassword,
    password_reset_token: null,
    password_reset_expires: null,
    refresh_token: null,
  }).eq('id', user.id);

  return successResponse(res, 'Password reset successfully. Please log in again.');
});
