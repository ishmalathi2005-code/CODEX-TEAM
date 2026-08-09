const jwt = require('jsonwebtoken');
const { supabase } = require('../config/db');
const asyncHandler = require('../utils/asyncHandler');
const { errorResponse } = require('../utils/apiResponse');
const config = require('../config/config');

const protect = asyncHandler(async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) return errorResponse(res, 'Access denied. No token provided.', 401);

  try {
    const decoded = jwt.verify(token, config.jwt.secret);
    const { data: user } = await supabase
      .from('users')
      .select('id, name, email, role, is_active, is_email_verified, last_login, created_at')
      .eq('id', decoded.id)
      .maybeSingle();

    if (!user) return errorResponse(res, 'User not found.', 401);
    if (!user.is_active) return errorResponse(res, 'Account is deactivated.', 403);

    req.user = user;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') return errorResponse(res, 'Token expired.', 401);
    return errorResponse(res, 'Invalid token.', 401);
  }
});

module.exports = { protect };
