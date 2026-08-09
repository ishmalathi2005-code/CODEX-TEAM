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

// ─── Generate/Fetch Questions for Active Interview Session ──────────────────
exports.generateQuestions = asyncHandler(async (req, res) => {
  const { technology = 'React.js', type = 'Technical', difficulty = 'Medium', count = 5, interviewId } = req.body;

  const isHR = type === 'HR' || type === 'behavioral';
  const qType = isHR ? 'behavioral' : 'technical';
  const diff = (difficulty || 'medium').toLowerCase();
  const reqCount = Number(count) || 5;

  // Query existing questions in Supabase
  const { data: dbQuestions } = await supabase
    .from('questions')
    .select('id, text, type, category, difficulty')
    .eq('is_active', true)
    .limit(reqCount);

  let resultQuestions = dbQuestions || [];

  // Seed question bank in Supabase if empty or low count
  if (resultQuestions.length < reqCount) {
    const defaultTemplates = isHR ? [
      { text: 'Tell me about a challenging project you worked on and how you resolved team conflict during tight deadlines.', type: 'behavioral', category: 'Behavioral & Culture Fit', difficulty: diff },
      { text: 'Where do you see yourself professionally in the next three years, and how does this role align with your goals?', type: 'behavioral', category: 'Behavioral & Culture Fit', difficulty: diff },
      { text: 'Describe a situation where you had to quickly adapt to a sudden change in requirements or project scope.', type: 'behavioral', category: 'Behavioral & Culture Fit', difficulty: diff },
      { text: 'How do you handle constructive criticism and code reviews from senior team members?', type: 'behavioral', category: 'Behavioral & Culture Fit', difficulty: diff },
      { text: 'Why are you interested in joining CODEX, and what unique perspective or skills do you bring?', type: 'behavioral', category: 'Behavioral & Culture Fit', difficulty: diff }
    ] : [
      { text: `Explain the Virtual DOM in ${technology} and how the reconciliation process optimizes re-renders.`, type: 'technical', category: technology, difficulty: diff },
      { text: `What are the key differences between state management strategies in modern ${technology} applications?`, type: 'technical', category: technology, difficulty: diff },
      { text: `How would you handle asynchronous data fetching, error boundaries, and race conditions in ${technology}?`, type: 'technical', category: technology, difficulty: diff },
      { text: `Explain how memory leaks can occur in client-side code and how you profile/prevent them in ${technology}.`, type: 'technical', category: technology, difficulty: diff },
      { text: `Design a scalable architecture for a real-time collaborative dashboard using ${technology}.`, type: 'technical', category: technology, difficulty: diff }
    ];

    try {
      const { data: inserted } = await supabase.from('questions').insert(defaultTemplates).select('id, text, type, category, difficulty');
      if (inserted && inserted.length > 0) {
        resultQuestions = inserted;
      }
    } catch (err) {
      console.warn('Could not insert default questions into Supabase, returning generated list', err.message);
      resultQuestions = defaultTemplates.map((q, idx) => ({ id: `q_${Date.now()}_${idx}`, ...q }));
    }
  }

  // Link questions to interview if interviewId provided
  if (interviewId && resultQuestions.length > 0) {
    const junctionRows = resultQuestions.slice(0, reqCount).map((q, idx) => ({
      interview_id: interviewId,
      question_id: q.id,
      order: idx,
    }));
    await supabase.from('interview_questions').upsert(junctionRows, { onConflict: 'interview_id,question_id' }).catch(() => {});
  }

  return successResponse(res, 'Questions generated successfully.', resultQuestions.slice(0, reqCount));
});
