const { supabase } = require('../config/db');
const asyncHandler = require('../utils/asyncHandler');
const { successResponse, errorResponse } = require('../utils/apiResponse');

exports.getMyProfile = asyncHandler(async (req, res) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*, users(id, name, email, role, last_login)')
    .eq('user_id', req.user.id)
    .maybeSingle();
  if (error || !data) return errorResponse(res, 'Profile not found.', 404);
  return successResponse(res, 'Profile retrieved.', data);
});

exports.updateMyProfile = asyncHandler(async (req, res) => {
  const fields = ['bio','avatar','phone','location','linked_in','github','skills',
    'experience_years','target_role','target_companies','preferred_interview_type'];
  const updates = {};
  fields.forEach(f => { if (req.body[f] !== undefined) updates[f] = req.body[f]; });

  const { data, error } = await supabase
    .from('profiles').update(updates).eq('user_id', req.user.id).select().single();
  if (error) return errorResponse(res, error.message, 500);
  return successResponse(res, 'Profile updated.', data);
});

exports.getProfileById = asyncHandler(async (req, res) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*, users(id, name, email, role, last_login, created_at)')
    .eq('user_id', req.params.id)
    .maybeSingle();
  if (error || !data) return errorResponse(res, 'Profile not found.', 404);
  return successResponse(res, 'Profile retrieved.', data);
});
