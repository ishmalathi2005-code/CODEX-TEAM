import React from 'react';

const ProgressBar = ({ current = 1, total = 5, label, showPercentage = true }) => {
  const percentage = Math.min(Math.max(Math.round((current / total) * 100), 0), 100);

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-1.5 text-xs text-gray-400 font-medium">
        <span>{label || `Question ${current} of ${total}`}</span>
        {showPercentage && <span className="text-blue-400">{percentage}%</span>}
      </div>
      <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden border border-gray-700/50">
        <div
          className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 h-full rounded-full transition-all duration-300 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
