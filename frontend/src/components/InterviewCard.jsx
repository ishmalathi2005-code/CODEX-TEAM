import React from 'react';
import { Calendar, Cpu, Award, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const InterviewCard = ({ interview }) => {
  const navigate = useNavigate();

  const diffColors = {
    Easy: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    Medium: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    Hard: 'bg-rose-500/10 text-rose-400 border-rose-500/30'
  };

  const scoreColor = (score) => {
    if (score >= 85) return 'text-emerald-400';
    if (score >= 70) return 'text-blue-400';
    return 'text-amber-400';
  };

  const typeLabel = (interview.type || 'Technical').toUpperCase() === 'HR' || String(interview.type).toLowerCase() === 'behavioral' ? 'HR' : 'Technical';
  const diffLabel = interview.difficulty ? (String(interview.difficulty).charAt(0).toUpperCase() + String(interview.difficulty).slice(1).toLowerCase()) : 'Medium';
  const techLabel = interview.technology || interview.domain || 'React.js';
  const scoreVal = interview.score !== undefined ? interview.score : 85;

  return (
    <div className="p-5 rounded-2xl bg-[#111827] border border-gray-800 hover:border-gray-700 transition-all shadow-md group flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-3">
          <span className="px-2.5 py-1 bg-blue-500/10 text-blue-400 border border-blue-500/30 text-xs font-semibold rounded-lg">
            {typeLabel}
          </span>
          <span className={`px-2.5 py-0.5 text-xs font-medium rounded-full border ${diffColors[diffLabel] || diffColors.Medium}`}>
            {diffLabel}
          </span>
        </div>

        <h3 className="text-base font-semibold text-white group-hover:text-blue-400 transition-colors flex items-center gap-2 mb-2">
          <Cpu className="w-4 h-4 text-gray-400" />
          {techLabel}
        </h3>

        <div className="flex items-center gap-4 text-xs text-gray-400 mb-4">
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            {interview.date || 'Recent'}
          </span>
          <span>•</span>
          <span className="flex items-center gap-1 font-medium">
            <Award className="w-3.5 h-3.5 text-amber-400" />
            Score: <span className={scoreColor(scoreVal)}>{scoreVal}%</span>
          </span>
        </div>
      </div>

      <button
        onClick={() => navigate(`/results/${interview.id}`)}
        className="w-full mt-2 py-2 px-3 bg-gray-800 hover:bg-gray-700 text-gray-200 text-xs font-medium rounded-xl flex items-center justify-center gap-1.5 transition-colors"
      >
        View Full Result Report
        <ArrowRight className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};

export default InterviewCard;
