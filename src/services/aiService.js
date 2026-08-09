const { supabase } = require('../config/db');

const evaluateAnswers = async (evaluationId, answers) => {
  try {
    const evalAnswers = answers.map(answer => ({
      evaluation_id: evaluationId,
      answer_id: answer.id,
      question_id: answer.question_id,
      score: answer.is_skipped ? 0 : parseFloat((Math.random() * 3 + 7).toFixed(1)),
      feedback: answer.is_skipped ? 'Question was skipped.' : 'Good attempt. Improve on edge cases.',
      strengths: answer.is_skipped ? [] : ['Clear communication', 'Structured approach'],
      improvements: answer.is_skipped ? ['Attempt all questions'] : ['Discuss time complexity', 'Mention edge cases'],
      ai_model: 'stub-v1',
    }));

    await supabase.from('evaluation_answers').insert(evalAnswers);

    const avg = evalAnswers.length ? evalAnswers.reduce((s, e) => s + e.score, 0) / evalAnswers.length : 0;
    const technical_score = parseFloat(avg.toFixed(1));
    const communication_score = parseFloat((Math.random() * 2 + 7.5).toFixed(1));
    const problem_solving_score = parseFloat((Math.random() * 2 + 7).toFixed(1));

    const { data: evaluation } = await supabase.from('evaluations').update({
      status: 'completed',
      technical_score, communication_score, problem_solving_score,
      overall_feedback: 'Solid performance. Focus on edge cases and system design depth.',
      evaluated_at: new Date().toISOString(),
      ai_provider: 'stub',
    }).eq('id', evaluationId).select().single();

    const total_score = Math.min(Math.round(technical_score * 5 + communication_score * 2.5 + problem_solving_score * 2.5), 100);
    const grade = computeGrade(total_score);

    await supabase.from('results').upsert({
      interview_id: evaluation.interview_id,
      candidate_id: evaluation.candidate_id,
      evaluation_id: evaluationId,
      total_score, grade,
      passed: total_score >= 50,
      questions_attempted: answers.length,
      questions_correct: evalAnswers.filter(e => e.score >= 6).length,
      category_breakdown: [
        { category: 'Technical', score: technical_score, maxScore: 10 },
        { category: 'Communication', score: communication_score, maxScore: 10 },
        { category: 'Problem Solving', score: problem_solving_score, maxScore: 10 },
      ],
    }, { onConflict: 'interview_id' });

    console.log(`✅ Evaluation ${evaluationId} complete. Score: ${total_score}`);
  } catch (err) {
    console.error(`❌ Evaluation ${evaluationId} failed:`, err.message);
    throw err;
  }
};

const computeGrade = (score) => {
  if (score >= 95) return 'A+';
  if (score >= 85) return 'A';
  if (score >= 75) return 'B+';
  if (score >= 65) return 'B';
  if (score >= 55) return 'C+';
  if (score >= 45) return 'C';
  if (score >= 35) return 'D';
  return 'F';
};

module.exports = { evaluateAnswers, computeGrade };
