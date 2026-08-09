const { supabase } = require('../config/db');
const asyncHandler = require('../utils/asyncHandler');
const { successResponse, createdResponse, errorResponse, paginatedResponse } = require('../utils/apiResponse');

exports.createInterview = asyncHandler(async (req, res) => {
  const { title, type, difficulty, domain, durationMinutes, notes, questionIds } = req.body;
  const { data, error } = await supabase.from('interviews').insert({
    candidate_id: req.user.id, title, type,
    difficulty: difficulty || 'medium', domain,
    duration_minutes: durationMinutes || 30, notes,
    total_questions: questionIds ? questionIds.length : 0,
  }).select().single();
  if (error) return errorResponse(res, error.message, 500);

  if (questionIds?.length) {
    await supabase.from('interview_questions').insert(
      questionIds.map((qId, i) => ({ interview_id: data.id, question_id: qId, order: i }))
    );
    await supabase.rpc('increment_question_usage', { q_ids: questionIds });
  }
  return createdResponse(res, 'Interview created.', data);
});

exports.getMyInterviews = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, status, type, difficulty } = req.query;
  const from = (page - 1) * limit;
  const to = from + Number(limit) - 1;

  let query = supabase.from('interviews').select('*', { count: 'exact' })
    .eq('candidate_id', req.user.id).order('created_at', { ascending: false }).range(from, to);
  if (status) query = query.eq('status', status);
  if (type) query = query.eq('type', type);
  if (difficulty) query = query.eq('difficulty', difficulty);

  const { data, error, count } = await query;
  if (error) return errorResponse(res, error.message, 500);
  return paginatedResponse(res, 'Interviews retrieved.', data, {
    total: count, page: Number(page), limit: Number(limit), totalPages: Math.ceil(count / limit),
  });
});

exports.getInterviewById = asyncHandler(async (req, res) => {
  const { data, error } = await supabase.from('interviews').select('*, interview_questions(*, questions(*))')
    .eq('id', req.params.id).maybeSingle();
  if (error || !data) return errorResponse(res, 'Interview not found.', 404);
  if (data.candidate_id !== req.user.id && req.user.role !== 'admin') return errorResponse(res, 'Not authorized.', 403);
  return successResponse(res, 'Interview retrieved.', data);
});

exports.updateInterview = asyncHandler(async (req, res) => {
  const { data: existing } = await supabase.from('interviews').select('candidate_id, status').eq('id', req.params.id).maybeSingle();
  if (!existing) return errorResponse(res, 'Interview not found.', 404);
  if (existing.candidate_id !== req.user.id && req.user.role !== 'admin') return errorResponse(res, 'Not authorized.', 403);
  if (existing.status === 'completed') return errorResponse(res, 'Cannot modify a completed interview.', 400);

  const { title, type, difficulty, domain, durationMinutes, notes } = req.body;
  const updates = {};
  if (title) updates.title = title;
  if (type) updates.type = type;
  if (difficulty) updates.difficulty = difficulty;
  if (domain) updates.domain = domain;
  if (durationMinutes) updates.duration_minutes = durationMinutes;
  if (notes) updates.notes = notes;

  const { data, error } = await supabase.from('interviews').update(updates).eq('id', req.params.id).select().single();
  if (error) return errorResponse(res, error.message, 500);
  return successResponse(res, 'Interview updated.', data);
});

exports.deleteInterview = asyncHandler(async (req, res) => {
  const { data: existing } = await supabase.from('interviews').select('candidate_id').eq('id', req.params.id).maybeSingle();
  if (!existing) return errorResponse(res, 'Interview not found.', 404);
  if (existing.candidate_id !== req.user.id && req.user.role !== 'admin') return errorResponse(res, 'Not authorized.', 403);
  await supabase.from('interviews').delete().eq('id', req.params.id);
  return successResponse(res, 'Interview deleted.');
});

exports.startInterview = asyncHandler(async (req, res) => {
  const { data: existing } = await supabase.from('interviews').select('candidate_id, status').eq('id', req.params.id).maybeSingle();
  if (!existing) return errorResponse(res, 'Interview not found.', 404);
  if (existing.candidate_id !== req.user.id) return errorResponse(res, 'Not authorized.', 403);
  if (existing.status !== 'scheduled') return errorResponse(res, `Cannot start interview with status '${existing.status}'.`, 400);
  const { data, error } = await supabase.from('interviews').update({ status: 'in_progress', started_at: new Date().toISOString() }).eq('id', req.params.id).select().single();
  if (error) return errorResponse(res, error.message, 500);
  return successResponse(res, 'Interview started.', data);
});

exports.endInterview = asyncHandler(async (req, res) => {
  const { data: existing } = await supabase.from('interviews').select('candidate_id, status').eq('id', req.params.id).maybeSingle();
  if (!existing) return errorResponse(res, 'Interview not found.', 404);
  if (existing.candidate_id !== req.user.id) return errorResponse(res, 'Not authorized.', 403);
  if (existing.status !== 'in_progress') return errorResponse(res, `Cannot end interview with status '${existing.status}'.`, 400);
  const { data, error } = await supabase.from('interviews').update({ status: 'completed', ended_at: new Date().toISOString() }).eq('id', req.params.id).select().single();
  if (error) return errorResponse(res, error.message, 500);
  return successResponse(res, 'Interview completed.', data);
});
