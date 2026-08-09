import React, { useState, useEffect } from 'react';
import { Clock, AlertTriangle } from 'lucide-react';

const Timer = ({ initialSeconds = 120, onTimeUp, autoStart = true, isWarningAt = 30 }) => {
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds);
  const [isActive, setIsActive] = useState(autoStart);

  useEffect(() => {
    setSecondsLeft(initialSeconds);
  }, [initialSeconds]);

  useEffect(() => {
    let interval = null;
    if (isActive && secondsLeft > 0) {
      interval = setInterval(() => {
        setSecondsLeft((prev) => prev - 1);
      }, 1000);
    } else if (secondsLeft === 0) {
      setIsActive(false);
      if (onTimeUp) onTimeUp();
    }
    return () => clearInterval(interval);
  }, [isActive, secondsLeft, onTimeUp]);

  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const remainderSecs = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainderSecs.toString().padStart(2, '0')}`;
  };

  const isWarning = secondsLeft <= isWarningAt;

  return (
    <div
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-mono font-semibold transition-all ${
        isWarning
          ? 'bg-red-500/10 border-red-500/40 text-red-400 animate-pulse'
          : 'bg-blue-500/10 border-blue-500/30 text-blue-400'
      }`}
    >
      {isWarning ? <AlertTriangle className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
      <span>{formatTime(secondsLeft)}</span>
    </div>
  );
};

export default Timer;
