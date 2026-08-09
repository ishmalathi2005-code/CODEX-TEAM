const { supabase } = require('../config/db');
const asyncHandler = require('../utils/asyncHandler');
const { successResponse, createdResponse, errorResponse } = require('../utils/apiResponse');
const aiService = require('../services/aiService');

exports.triggerEvaluation = asyncHandler(async (req, res) => {
  const interviewId = req.params.interviewId || req.body.interviewId;
  if (!interviewId) return errorResponse(res, 'interviewId is required.', 400);

  const { data: interview } = await supabase.from('interviews').select('*').eq('id', interviewId).maybeSingle();
  if (!interview) return errorResponse(res, 'Interview not found.', 404);

  // Auto-complete interview if not already completed
  if (interview.status !== 'completed') {
    await supabase.from('interviews').update({ status: 'completed', ended_at: new Date().toISOString() }).eq('id', interviewId);
  }

  const { data: existing } = await supabase.from('evaluations').select('id, status').eq('interview_id', interviewId).maybeSingle();
  if (existing?.status === 'completed') {
    return successResponse(res, 'Evaluation already completed.', existing);
  }

  let { data: answers } = await supabase.from('answers').select('*, questions(*)').eq('interview_id', interviewId);
  
  // If answers array sent in body, support saving them first
  if (req.body.answers && Array.isArray(req.body.answers)) {
    for (const ans of req.body.answers) {
      if (ans.questionId && (ans.userAnswer || ans.answerText)) {
        await supabase.from('answers').upsert({
          interview_id: interviewId,
          question_id: ans.questionId,
          candidate_id: req.user.id,
          answer_text: ans.userAnswer || ans.answerText,
          code_answer: ans.codeAnswer || ans.userAnswer,
          time_taken_seconds: ans.timeSpentSeconds || ans.timeTakenSeconds || 0,
        }, { onConflict: 'interview_id,question_id' }).catch(() => {});
      }
    }
    const { data: refreshedAnswers } = await supabase.from('answers').select('*, questions(*)').eq('interview_id', interviewId);
    answers = refreshedAnswers || [];
  }

  if (!answers?.length) return errorResponse(res, 'No answers found to evaluate.', 400);

  let evaluation;
  if (existing) {
    const { data } = await supabase.from('evaluations').update({ status: 'processing' }).eq('id', existing.id).select().single();
    evaluation = data;
    await supabase.from('evaluation_answers').delete().eq('evaluation_id', existing.id);
  } else {
    const { data } = await supabase.from('evaluations').insert({ interview_id: interviewId, candidate_id: interview.candidate_id, status: 'processing' }).select().single();
    evaluation = data;
  }

  // Synchronous evaluation fallback for real-time frontend display
  await aiService.evaluateAnswers(evaluation.id, answers).catch(async (err) => {
    console.error('AI evaluation error:', err.message);
    await supabase.from('evaluations').update({ status: 'failed' }).eq('id', evaluation.id);
  });

  const { data: updatedEval } = await supabase.from('evaluations').select('*, results(*)').eq('id', evaluation.id).single();

  return createdResponse(res, 'Evaluation completed successfully.', updatedEval || { evaluationId: evaluation.id, status: 'completed' });
});

exports.getEvaluation = asyncHandler(async (req, res) => {
  const interviewId = req.params.interviewId || req.query.interviewId;

  const { data: interview } = await supabase.from('interviews').select('candidate_id').eq('id', interviewId).maybeSingle();
  if (!interview) return errorResponse(res, 'Interview not found.', 404);
  if (interview.candidate_id !== req.user.id && req.user.role !== 'admin') return errorResponse(res, 'Not authorized.', 403);

  const { data, error } = await supabase.from('evaluations')
    .select('*, evaluation_answers(*, questions(id, text, category, type), answers(id, answer_text, code_answer, time_taken_seconds))')
    .eq('interview_id', interviewId).maybeSingle();
  if (error || !data) return errorResponse(res, 'No evaluation found. Trigger one first.', 404);
  return successResponse(res, 'Evaluation retrieved.', data);
});
