import React from 'react';
import { PlayerProgress } from '../hooks/useProgress';
interface MyStableProps {
  progress: PlayerProgress;
  onBack: () => void;
}
export const MyStable: React.FC<MyStableProps> = ({ progress, onBack }) => {
  const allBadges = ['Bronze', 'Silver', 'Gold', 'Champion'];
  return (
    <div className="fixed inset-0 bg-background z-50 overflow-y-auto animate-pop">
      <div className="max-w-md mx-auto min-h-screen p-6 flex flex-col">
        <header className="flex justify-between items-center mb-8">
          <button onClick={onBack} className="text-2xl hover:scale-110 transition-transform">
            🏠
          </button>
          <h1 className="text-3xl font-heading font-black text-accent text-center">My Stable</h1>
          <div className="w-8"></div> {/* Spacer */}
        </header>
        {/* Stats Card */}
        <div className="bg-surface rounded-2xl p-6 shadow-md mb-8 border-l-4 border-secondary">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <p className="text-sm text-text-light uppercase font-bold">High Score</p>
              <p className="text-2xl font-black text-primary">{progress.highScore}</p>
            </div>
            <div>
              <p className="text-sm text-text-light uppercase font-bold">Games Played</p>
              <p className="text-2xl font-black text-secondary">{progress.gamesPlayed}</p>
            </div>
          </div>
        </div>
        {/* Trophy Case */}
        <h2 className="text-xl font-bold text-text mb-4">Trophy Case</h2>
        <div className="grid grid-cols-2 gap-4">
          {allBadges.map((badge) => {
            const unlocked = progress.badges.includes(badge);
            return (
              <div 
                key={badge} 
                className={`aspect-square rounded-2xl flex flex-col items-center justify-center p-4 transition-all
                  ${unlocked ? 'bg-white shadow-lg border-2 border-yellow-200' : 'bg-gray-200 opacity-50 grayscale'}`}
              >
                <div className={`w-16 h-16 rounded-full mb-2 border-4 border-white shadow-sm flex items-center justify-center text-2xl
                  ${badge === 'Champion' ? 'bg-primary' : 
                    badge === 'Gold' ? 'bg-yellow-400' : 
                    badge === 'Silver' ? 'bg-gray-300' : 'bg-amber-700'}`}>
                  {badge === 'Champion' ? '🏆' : '🏵️'}
                </div>
                <span className={`font-bold ${unlocked ? 'text-text' : 'text-gray-500'}`}>
                  {badge}
                </span>
                {!unlocked && <span className="text-xs text-gray-500 mt-1">Locked</span>}
              </div>
            );
          })}
        </div>
        <div className="mt-auto pt-8">
           <button 
             onClick={onBack}
             className="w-full bg-accent hover:bg-indigo-700 text-white font-bold py-3 rounded-xl shadow-lg"
           >
             Back to Quiz
           </button>
        </div>
      </div>
    </div>
  );
};
