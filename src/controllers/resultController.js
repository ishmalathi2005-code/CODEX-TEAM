const { supabase } = require('../config/db');
const asyncHandler = require('../utils/asyncHandler');
const { successResponse, errorResponse, paginatedResponse } = require('../utils/apiResponse');

exports.getMyResults = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const from = (page - 1) * limit;
  const to = from + Number(limit) - 1;

  const { data, error, count } = await supabase.from('results')
    .select('*, interviews(id, title, type, difficulty, domain, created_at), evaluations(id, overall_feedback, technical_score, communication_score)', { count: 'exact' })
    .eq('candidate_id', req.user.id).order('created_at', { ascending: false }).range(from, to);
  if (error) return errorResponse(res, error.message, 500);
  return paginatedResponse(res, 'Results retrieved.', data, { total: count, page: Number(page), limit: Number(limit), totalPages: Math.ceil(count / limit) });
});

exports.getResultByInterview = asyncHandler(async (req, res) => {
  const { interviewId } = req.params;
  const { data: interview } = await supabase.from('interviews').select('candidate_id').eq('id', interviewId).maybeSingle();
  if (!interview) return errorResponse(res, 'Interview not found.', 404);
  if (interview.candidate_id !== req.user.id && req.user.role !== 'admin') return errorResponse(res, 'Not authorized.', 403);

  const { data, error } = await supabase.from('results')
    .select('*, interviews(id, title, type, difficulty, domain, started_at, ended_at), evaluations(*, evaluation_answers(*, questions(id, text, category), answers(id, answer_text, code_answer)))')
    .eq('interview_id', interviewId).maybeSingle();
  if (error || !data) return errorResponse(res, 'Result not found. Evaluate the interview first.', 404);
  return successResponse(res, 'Result retrieved.', data);
});
