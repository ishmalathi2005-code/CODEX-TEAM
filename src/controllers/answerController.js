const { supabase } = require('../config/db');
const asyncHandler = require('../utils/asyncHandler');
const { successResponse, createdResponse, errorResponse } = require('../utils/apiResponse');

exports.submitAnswer = asyncHandler(async (req, res) => {
  const { interviewId, questionId, answerText, codeAnswer, selectedOption, timeTakenSeconds, isSkipped } = req.body;

  const { data: interview } = await supabase.from('interviews').select('candidate_id, status').eq('id', interviewId).maybeSingle();
  if (!interview) return errorResponse(res, 'Interview not found.', 404);
  if (interview.candidate_id !== req.user.id) return errorResponse(res, 'Not authorized.', 403);
  if (interview.status !== 'in_progress') return errorResponse(res, 'Interview is not in progress.', 400);

  const { data, error } = await supabase.from('answers').upsert({
    interview_id: interviewId, question_id: questionId, candidate_id: req.user.id,
    answer_text: answerText, code_answer: codeAnswer, selected_option: selectedOption,
    time_taken_seconds: timeTakenSeconds || 0, is_skipped: isSkipped || false,
  }, { onConflict: 'interview_id,question_id' }).select().single();
  if (error) return errorResponse(res, error.message, 500);
  return createdResponse(res, 'Answer submitted.', data);
});

exports.getAnswersByInterview = asyncHandler(async (req, res) => {
  const { interviewId } = req.params;
  const { data: interview } = await supabase.from('interviews').select('candidate_id').eq('id', interviewId).maybeSingle();
  if (!interview) return errorResponse(res, 'Interview not found.', 404);
  if (interview.candidate_id !== req.user.id && req.user.role !== 'admin') return errorResponse(res, 'Not authorized.', 403);

  const { data, error } = await supabase.from('answers').select('*, questions(id, text, type, category, difficulty)').eq('interview_id', interviewId);
  if (error) return errorResponse(res, error.message, 500);
  return successResponse(res, 'Answers retrieved.', data);
});

exports.getAnswerById = asyncHandler(async (req, res) => {
  const { data, error } = await supabase.from('answers').select('*, questions(id, text, type, category), interviews(id, title, status)').eq('id', req.params.id).maybeSingle();
  if (error || !data) return errorResponse(res, 'Answer not found.', 404);
  if (data.candidate_id !== req.user.id && req.user.role !== 'admin') return errorResponse(res, 'Not authorized.', 403);
  return successResponse(res, 'Answer retrieved.', data);
});
