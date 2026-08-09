import React from 'react';

const ScoreCard = ({ title, score, subtitle, icon: Icon, color = 'blue', trend }) => {
  const colorMap = {
    blue: {
      border: 'border-blue-500/20',
      bg: 'bg-blue-500/10',
      text: 'text-blue-400',
      gradient: 'from-blue-500/20 to-indigo-500/10'
    },
    purple: {
      border: 'border-purple-500/20',
      bg: 'bg-purple-500/10',
      text: 'text-purple-400',
      gradient: 'from-purple-500/20 to-pink-500/10'
    },
    emerald: {
      border: 'border-emerald-500/20',
      bg: 'bg-emerald-500/10',
      text: 'text-emerald-400',
      gradient: 'from-emerald-500/20 to-teal-500/10'
    },
    amber: {
      border: 'border-amber-500/20',
      bg: 'bg-amber-500/10',
      text: 'text-amber-400',
      gradient: 'from-amber-500/20 to-orange-500/10'
    }
  };

  const scheme = colorMap[color] || colorMap.blue;

  return (
    <div className={`relative p-5 rounded-2xl bg-[#111827] border ${scheme.border} overflow-hidden shadow-lg hover:border-gray-700 transition-all`}>
      <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl ${scheme.gradient} rounded-bl-full pointer-events-none opacity-50`} />
      
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">{title}</span>
        {Icon && (
          <div className={`p-2.5 rounded-xl ${scheme.bg} ${scheme.text}`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      <div className="flex items-baseline gap-2">
        <span className="text-3xl font-bold text-white tracking-tight">{score}</span>
        <span className="text-xs text-gray-400">/ 100</span>
      </div>

      {subtitle && <p className="mt-2 text-xs text-gray-400">{subtitle}</p>}
      {trend && (
        <div className="mt-3 pt-2 border-t border-gray-800/60 flex items-center gap-1 text-xs font-medium text-emerald-400">
          <span>{trend}</span>
        </div>
      )}
    </div>
  );
};

export default ScoreCard;
