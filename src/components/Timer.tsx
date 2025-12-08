import React from 'react';
interface TimerProps {
  timeLeft: number;
  totalTime: number;
}
export const Timer: React.FC<TimerProps> = ({ timeLeft, totalTime }) => {
  const percentage = (timeLeft / totalTime) * 100;
  const isLow = timeLeft <= 5;
  return (
    <div className="w-full max-w-md mx-auto mb-6">
      <div className="flex justify-between items-end mb-2">
        <span className="text-text-light font-bold text-sm uppercase">Time Left</span>
        <span className={`text-2xl font-black ${isLow ? 'text-red-500 animate-pulse' : 'text-primary'}`}>
          {timeLeft}s
        </span>
      </div>
      <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
        <div 
          className={`h-full transition-all duration-1000 ease-linear ${isLow ? 'bg-red-500' : 'bg-secondary'}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
