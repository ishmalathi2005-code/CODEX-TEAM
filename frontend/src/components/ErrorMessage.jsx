import React from 'react';
import { AlertCircle, X } from 'lucide-react';

const ErrorMessage = ({ message, onClose }) => {
  if (!message) return null;

  return (
    <div className="flex items-center justify-between p-4 mb-4 text-sm text-red-300 bg-red-950/40 border border-red-800/60 rounded-xl backdrop-blur-sm animate-fadeIn">
      <div className="flex items-center space-x-3">
        <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
        <span>{message}</span>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="p-1 text-red-400 hover:text-red-200 hover:bg-red-900/30 rounded-lg transition-colors"
          aria-label="Dismiss error"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;
