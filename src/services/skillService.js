const { supabase } = require('../config/db');

const analyzeSkillGaps = async (userId) => {
  const { data: results } = await supabase.from('results')
    .select('total_score, interviews(type, domain, difficulty), evaluations(technical_score, communication_score, problem_solving_score)')
    .eq('candidate_id', userId).order('created_at', { ascending: false }).limit(10);

  const { data: profile } = await supabase.from('profiles').select('skills, experience_years').eq('user_id', userId).maybeSingle();

  const weakCategories = {};
  const strongCategories = {};
  for (const result of results || []) {
    const domain = result.interviews?.domain || 'General';
    const score = result.evaluations?.technical_score || 0;
    if (score < 6) weakCategories[domain] = (weakCategories[domain] || 0) + 1;
    else strongCategories[domain] = (strongCategories[domain] || 0) + 1;
  }

  const gaps = Object.keys(weakCategories).map(domain => ({
    skill: domain,
    weakCount: weakCategories[domain],
    strongCount: strongCategories[domain] || 0,
    severity: weakCategories[domain] > 3 ? 'high' : weakCategories[domain] > 1 ? 'medium' : 'low',
    recommendation: `Practice more ${domain} problems at intermediate-advanced difficulty.`,
  }));

  const res = results || [];
  const avgTechnical = res.length ? parseFloat((res.reduce((s, r) => s + (r.evaluations?.technical_score || 0), 0) / res.length).toFixed(1)) : 0;
  const avgComm = res.length ? parseFloat((res.reduce((s, r) => s + (r.evaluations?.communication_score || 0), 0) / res.length).toFixed(1)) : 0;

  return {
    totalAnalyzed: res.length,
    averageScores: { technical: avgTechnical, communication: avgComm },
    skillGaps: gaps,
    selfReportedSkills: profile?.skills || [],
    summary: gaps.length === 0
      ? 'No significant gaps detected. Keep practicing!'
      : `Found ${gaps.length} gap(s): ${gaps.slice(0, 3).map(g => g.skill).join(', ')}.`,
  };
};

const generateAndStoreRecommendations = async (userId, interviewId, gaps) => {
  await supabase.from('skill_recommendations').update({ is_stale: true }).eq('candidate_id', userId);
  const { data } = await supabase.from('skill_recommendations').insert({
    candidate_id: userId,
    based_on_interview_id: interviewId,
    generated_by: 'rule_based',
    recommendations: gaps.map(gap => ({
      skill: gap.skill, priority: gap.severity === 'high' ? 'critical' : 'high',
      reason: gap.recommendation,
      resources: [
        { title: `${gap.skill} — LeetCode`, url: `https://leetcode.com/tag/${gap.skill.toLowerCase().replace(/\s+/g, '-')}/`, type: 'practice' },
      ],
    })),
  }).select().single();
  return data;
};

module.exports = { analyzeSkillGaps, generateAndStoreRecommendations };
