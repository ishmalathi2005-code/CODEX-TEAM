import React, { useState, useEffect } from 'react';
import { analyticsAPI } from '../services/api';
import SkillCard from '../components/SkillCard';
import LoadingSpinner from '../components/LoadingSpinner';
import Button from '../components/Button';
import { TrendingUp, BookOpen, Clock, Target, Award, Sparkles, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const SkillImprovement = () => {
  const [recommendations, setRecommendations] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecs = async () => {
      try {
        const data = await analyticsAPI.getRecommendations();
        setRecommendations(data);
      } catch (err) {
        console.error('Failed to fetch recommendations', err);
      } finally {
        setLoading(false);
      }
    };
    fetchRecs();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <LoadingSpinner text="Analyzing AI skill gaps & generating learning paths..." size="large" />
      </div>
    );
  }

  const { weakSkills, recommendedTopics, resources, overallMastery } = recommendations || {};

  return (
    <div className="space-y-8 pb-12">
      {/* Top Banner */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-purple-950/50 via-indigo-950/40 to-[#111827] border border-purple-500/30 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-purple-500/10 border border-purple-500/30 text-purple-400 text-xs font-semibold rounded-full mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Adaptive Growth Plan</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white">Skill Improvement & Recommendations</h1>
          <p className="text-sm text-gray-400 mt-1">
            Personalized learning modules generated from your AI mock interview evaluations.
          </p>
        </div>

        <div className="flex items-center gap-4 p-4 bg-gray-900/80 rounded-2xl border border-gray-800">
          <Award className="w-8 h-8 text-amber-400 shrink-0" />
          <div>
            <span className="text-xs text-gray-400 block">Overall Mastery Index</span>
            <span className="text-2xl font-bold text-white">{overallMastery || 78}%</span>
          </div>
        </div>
      </div>

      {/* Weak Skills Section */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <Target className="w-5 h-5 text-rose-400" />
          Identified Skill Gaps
        </h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {weakSkills?.map((skill, idx) => (
            <SkillCard key={idx} skill={skill} />
          ))}
        </div>
      </div>

      {/* Recommended Topics & Study Plan */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <Clock className="w-5 h-5 text-indigo-400" />
          Recommended Quick Study Modules
        </h3>
        <div className="grid md:grid-cols-3 gap-6">
          {recommendedTopics?.map((topic, idx) => (
            <div key={idx} className="p-5 rounded-2xl bg-[#111827] border border-gray-800 flex flex-col justify-between space-y-4">
              <div>
                <span className="px-2.5 py-1 bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 text-xs font-semibold rounded-lg mb-2 inline-block">
                  {topic.category}
                </span>
                <h4 className="font-semibold text-white text-base leading-snug">{topic.title}</h4>
              </div>
              <div className="flex items-center justify-between text-xs text-gray-400 pt-3 border-t border-gray-800">
                <span>Estimated Time: {topic.time}</span>
                <Link to="/setup" className="text-blue-400 hover:text-blue-300 font-medium flex items-center gap-1">
                  Practice Topic <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Curated External Resources */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-blue-400" />
          Curated Documentation & Practice References
        </h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {resources?.map((res) => (
            <SkillCard key={res.id} resource={res} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SkillImprovement;
