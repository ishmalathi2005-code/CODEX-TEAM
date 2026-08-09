const { supabase } = require('../config/db');
const asyncHandler = require('../utils/asyncHandler');
const { successResponse, createdResponse, errorResponse, paginatedResponse } = require('../utils/apiResponse');

exports.createQuestion = asyncHandler(async (req, res) => {
  const { data, error } = await supabase.from('questions').insert({ ...req.body, created_by_id: req.user.id }).select().single();
  if (error) return errorResponse(res, error.message, 500);
  return createdResponse(res, 'Question created.', data);
});

exports.getQuestions = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, type, category, difficulty, search } = req.query;
  const from = (page - 1) * limit;
  const to = from + Number(limit) - 1;

  const cols = req.user.role === 'admin'
    ? '*'
    : 'id, text, type, category, difficulty, tags, mcq_options, code_language, starter_code, hints, usage_count, created_at';

  let query = supabase.from('questions').select(cols, { count: 'exact' })
    .eq('is_active', true).order('created_at', { ascending: false }).range(from, to);
  if (type) query = query.eq('type', type);
  if (category) query = query.ilike('category', `%${category}%`);
  if (difficulty) query = query.eq('difficulty', difficulty);
  if (search) query = query.ilike('text', `%${search}%`);

  const { data, error, count } = await query;
  if (error) return errorResponse(res, error.message, 500);
  return paginatedResponse(res, 'Questions retrieved.', data, {
    total: count, page: Number(page), limit: Number(limit), totalPages: Math.ceil(count / limit),
  });
});

exports.getQuestionById = asyncHandler(async (req, res) => {
  const cols = req.user.role === 'admin' ? '*' : 'id, text, type, category, difficulty, tags, mcq_options, code_language, starter_code, hints';
  const { data, error } = await supabase.from('questions').select(cols).eq('id', req.params.id).eq('is_active', true).maybeSingle();
  if (error || !data) return errorResponse(res, 'Question not found.', 404);
  return successResponse(res, 'Question retrieved.', data);
});

exports.updateQuestion = asyncHandler(async (req, res) => {
  const { data, error } = await supabase.from('questions').update(req.body).eq('id', req.params.id).select().single();
  if (error) return errorResponse(res, error.message, 500);
  return successResponse(res, 'Question updated.', data);
});

exports.deleteQuestion = asyncHandler(async (req, res) => {
  await supabase.from('questions').update({ is_active: false }).eq('id', req.params.id);
  return successResponse(res, 'Question deactivated.');
});

const { generateGeminiQuestions } = require('../services/aiService');

// ─── Generate/Fetch Questions for Active Interview Session ──────────────────
exports.generateQuestions = asyncHandler(async (req, res) => {
  const { technology = 'React.js', type = 'Technical', difficulty = 'Medium', count = 5, interviewId } = req.body;

  const isHR = type === 'HR' || type === 'behavioral';
  const reqCount = Number(count) || 5;

  // Generate questions using Gemini AI / Fallback Engine
  const resultQuestions = await generateGeminiQuestions(technology, type, difficulty, reqCount);

  // Link questions to interview if interviewId provided
  if (interviewId && resultQuestions.length > 0) {
    const junctionRows = resultQuestions.map((q, idx) => ({
      interview_id: interviewId,
      question_id: q.id,
      order: idx,
    }));
    await supabase.from('interview_questions').upsert(junctionRows, { onConflict: 'interview_id,question_id' }).catch(() => {});
  }

  return successResponse(res, 'Questions generated successfully.', resultQuestions.slice(0, reqCount));
});
