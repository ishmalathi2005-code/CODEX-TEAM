import React from 'react';
import { BookOpen, ExternalLink, Target } from 'lucide-react';

const SkillCard = ({ skill, resource }) => {
  if (resource) {
    return (
      <div className="p-4 rounded-xl bg-[#111827] border border-gray-800 hover:border-gray-700 transition-all flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-blue-500/10 text-blue-400">
            <BookOpen className="w-4 h-4" />
          </div>
          <div>
            <h5 className="font-medium text-white text-sm">{resource.title}</h5>
            <span className="text-xs text-gray-400">{resource.type || 'Resource'}</span>
          </div>
        </div>
        <a
          href={resource.url || '#'}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 text-gray-400 hover:text-blue-400 hover:bg-gray-800 rounded-lg transition-colors"
        >
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>
    );
  }

  const priorityColors = {
    High: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
    Medium: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    Low: 'bg-blue-500/10 text-blue-400 border-blue-500/30'
  };

  return (
    <div className="p-5 rounded-2xl bg-[#111827] border border-gray-800 hover:border-gray-700 transition-all">
      <div className="flex items-center justify-between mb-3">
        <span className={`px-2.5 py-0.5 text-xs font-medium rounded-full border ${priorityColors[skill.priority] || priorityColors.Medium}`}>
          {skill.priority || 'Medium'} Priority
        </span>
        <span className="text-xs font-semibold text-gray-400">{skill.level || 'Intermediate'}</span>
      </div>

      <h4 className="font-semibold text-white text-base mb-3 flex items-center gap-2">
        <Target className="w-4 h-4 text-indigo-400" />
        {skill.name}
      </h4>

      <div className="w-full bg-gray-800 rounded-full h-1.5 overflow-hidden">
        <div
          className="bg-indigo-500 h-full rounded-full"
          style={{ width: `${skill.score || 60}%` }}
        />
      </div>
      <div className="flex justify-between text-xs text-gray-400 mt-2">
        <span>Current Score</span>
        <span className="font-medium text-white">{skill.score || 60}%</span>
      </div>
    </div>
  );
};

export default SkillCard;
