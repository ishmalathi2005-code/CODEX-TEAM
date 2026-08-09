import React from 'react';
import { Cpu, Tag } from 'lucide-react';

const QuestionCard = ({
  questionNumber,
  totalQuestions,
  questionText,
  technology,
  difficulty = 'Medium',
  type = 'Technical'
}) => {
  const diffBadgeColors = {
    Easy: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    Medium: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    Hard: 'bg-rose-500/10 text-rose-400 border-rose-500/30'
  };

  return (
    <div className="p-6 rounded-2xl bg-[#111827] border border-gray-800 shadow-xl mb-6">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-blue-500/10 border border-blue-500/30 text-blue-400 font-semibold text-xs rounded-full">
            Question {questionNumber} of {totalQuestions}
          </span>
          {type && (
            <span className="px-3 py-1 bg-purple-500/10 border border-purple-500/30 text-purple-400 font-medium text-xs rounded-full">
              {type}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {technology && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-gray-800 text-gray-300 text-xs font-medium rounded-lg border border-gray-700">
              <Cpu className="w-3 h-3 text-blue-400" />
              {technology}
            </span>
          )}
          <span className={`px-2.5 py-1 text-xs font-medium rounded-lg border ${diffBadgeColors[difficulty] || diffBadgeColors.Medium}`}>
            {difficulty}
          </span>
        </div>
      </div>

      <h2 className="text-lg sm:text-xl font-semibold text-white leading-relaxed">
        {questionText || 'Loading AI question...'}
      </h2>
    </div>
  );
};

export default QuestionCard;
