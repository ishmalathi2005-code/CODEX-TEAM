import React from 'react';
import { CheckCircle2, XCircle, Lightbulb, Sparkles } from 'lucide-react';

const FeedbackCard = ({ title, items = [], type = 'strength', aiNote }) => {
  const typeConfigs = {
    strength: {
      icon: CheckCircle2,
      iconColor: 'text-emerald-400',
      bgColor: 'bg-emerald-500/10',
      borderColor: 'border-emerald-500/20',
      headerText: 'Strengths'
    },
    weakness: {
      icon: XCircle,
      iconColor: 'text-rose-400',
      bgColor: 'bg-rose-500/10',
      borderColor: 'border-rose-500/20',
      headerText: 'Areas for Improvement'
    },
    suggestion: {
      icon: Lightbulb,
      iconColor: 'text-amber-400',
      bgColor: 'bg-amber-500/10',
      borderColor: 'border-amber-500/20',
      headerText: 'AI Recommendations'
    },
    aiSummary: {
      icon: Sparkles,
      iconColor: 'text-blue-400',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/20',
      headerText: 'AI Evaluation Summary'
    }
  };

  const config = typeConfigs[type] || typeConfigs.strength;
  const IconComp = config.icon;

  return (
    <div className={`p-6 rounded-2xl bg-[#111827] border ${config.borderColor} shadow-md`}>
      <div className="flex items-center gap-3 mb-4">
        <div className={`p-2 rounded-xl ${config.bgColor} ${config.iconColor}`}>
          <IconComp className="w-5 h-5" />
        </div>
        <h4 className="font-semibold text-white text-base">{title || config.headerText}</h4>
      </div>

      {aiNote ? (
        <p className="text-sm text-gray-300 leading-relaxed bg-gray-900/60 p-4 rounded-xl border border-gray-800 italic">
          "{aiNote}"
        </p>
      ) : (
        <ul className="space-y-2.5">
          {items.map((item, idx) => (
            <li key={idx} className="flex items-start gap-2.5 text-sm text-gray-300">
              <span className={`w-1.5 h-1.5 rounded-full mt-2 shrink-0 ${config.iconColor}`} />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FeedbackCard;
