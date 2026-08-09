import React from 'react';

const LoadingSpinner = ({ text = 'Loading...', size = 'medium' }) => {
  const sizeClasses = {
    small: 'w-5 h-5 border-2',
    medium: 'w-8 h-8 border-3',
    large: 'w-12 h-12 border-4',
  };

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div
        className={`${sizeClasses[size] || sizeClasses.medium} border-blue-500/20 border-t-blue-500 rounded-full animate-spin`}
      ></div>
      {text && <p className="mt-3 text-sm text-gray-400 font-medium animate-pulse">{text}</p>}
    </div>
  );
};

export default LoadingSpinner;
