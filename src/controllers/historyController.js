const { supabase } = require('../config/db');
const asyncHandler = require('../utils/asyncHandler');
const { successResponse, paginatedResponse } = require('../utils/apiResponse');

exports.getHistory = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, status, type } = req.query;
  const from = (page - 1) * limit;
  const to = from + Number(limit) - 1;

  let query = supabase.from('interviews').select('*', { count: 'exact' })
    .eq('candidate_id', req.user.id).order('created_at', { ascending: false }).range(from, to);
  if (status) query = query.eq('status', status);
  if (type) query = query.eq('type', type);

  const { data, error, count } = await query;
  return paginatedResponse(res, 'History retrieved.', data || [], { total: count || 0, page: Number(page), limit: Number(limit), totalPages: Math.ceil((count || 0) / limit) });
});

exports.getStats = asyncHandler(async (req, res) => {
  const uid = req.user.id;
  const [
    { count: total },
    { count: completed },
    { count: inProgress },
    { data: results },
  ] = await Promise.all([
    supabase.from('interviews').select('*', { count: 'exact', head: true }).eq('candidate_id', uid),
    supabase.from('interviews').select('*', { count: 'exact', head: true }).eq('candidate_id', uid).eq('status', 'completed'),
    supabase.from('interviews').select('*', { count: 'exact', head: true }).eq('candidate_id', uid).eq('status', 'in_progress'),
    supabase.from('results').select('total_score, grade, passed').eq('candidate_id', uid),
  ]);

  const passed = (results || []).filter(r => r.passed).length;
  const avgScore = results?.length ? Math.round(results.reduce((s, r) => s + (r.total_score || 0), 0) / results.length) : 0;
  const gradeDistribution = (results || []).reduce((acc, r) => { if (r.grade) acc[r.grade] = (acc[r.grade] || 0) + 1; return acc; }, {});

  return successResponse(res, 'Stats retrieved.', {
    totalInterviews: total, completedInterviews: completed, inProgressInterviews: inProgress,
    totalResults: results?.length || 0, passedCount: passed, failedCount: (results?.length || 0) - passed,
    passRate: results?.length ? Math.round(passed / results.length * 100) : 0,
    averageScore: avgScore, gradeDistribution,
  });
});
