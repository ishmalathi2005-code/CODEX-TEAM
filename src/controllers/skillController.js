const { supabase } = require('../config/db');
const asyncHandler = require('../utils/asyncHandler');
const { successResponse, errorResponse } = require('../utils/apiResponse');
const skillService = require('../services/skillService');

exports.getRecommendations = asyncHandler(async (req, res) => {
  const { data, error } = await supabase.from('skill_recommendations')
    .select('*, interviews(id, title, type, difficulty)')
    .eq('candidate_id', req.user.id).eq('is_stale', false)
    .order('created_at', { ascending: false }).limit(1).maybeSingle();
  if (error || !data) return errorResponse(res, 'No recommendations found. Complete an interview first.', 404);
  return successResponse(res, 'Recommendations retrieved.', data);
});

exports.getSkillGaps = asyncHandler(async (req, res) => {
  const gaps = await skillService.analyzeSkillGaps(req.user.id);
  return successResponse(res, 'Skill gaps retrieved.', gaps);
});
