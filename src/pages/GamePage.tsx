import { useQuiz } from '../hooks/useQuiz';
import { useProgress } from '../hooks/useProgress';
import { QuizCard } from '../components/QuizCard';
import { Timer } from '../components/Timer';
import { GameOverlay } from '../components/GameOverlay';
import { MyStable } from '../components/MyStable';
import { useState } from 'react';
export default function GamePage() {
  const [view, setView] = useState<'game' | 'stable'>('game');
  const { progress, saveGameResult } = useProgress();
  const {
    gameState,
    currentQuestion,
    score,
    timeLeft,
    handleAnswer,
    startGame,
    restartGame,
    currentQuestionIndex,
    totalQuestions
  } = useQuiz();
  const handleGameEnd = () => {
    saveGameResult(score);
    restartGame();
  };
  if (view === 'stable') {
    return <MyStable progress={progress} onBack={() => setView('game')} />;
  }
  return (
    <div className="min-h-screen w-full bg-background flex flex-col items-center py-8 px-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-purple-100 to-transparent -z-10" />
      {/* Header */}
      <header className="w-full max-w-md flex justify-between items-center mb-8">
        <div className="flex flex-col">
           <h1 className="text-xl font-black text-accent tracking-tight">Horse Care Challenge</h1>
           <span className="text-xs font-bold text-text-light/60 uppercase tracking-widest">Question {currentQuestionIndex + 1} / {totalQuestions}</span>
        </div>
        <div className="flex items-center gap-2 bg-white px-3 py-1 rounded-full shadow-sm">
          <span className="text-xl">⭐</span>
          <span className="font-bold text-primary">{score}</span>
        </div>
      </header>
      {/* Game Area */}
      {gameState === 'playing' ? (
        <div className="w-full max-w-md flex flex-col items-center">
          <Timer timeLeft={timeLeft} totalTime={15} />
          {currentQuestion && (
            <QuizCard 
              question={currentQuestion} 
              onAnswer={handleAnswer} 
              isLoading={false}
            />
          )}
        </div>
      ) : (
        <GameOverlay 
          type={gameState === 'start' ? 'start' : 'results'} 
          score={score}
          onAction={gameState === 'start' ? startGame : handleGameEnd}
        >
          {gameState === 'start' && (
            <button 
              onClick={() => setView('stable')}
              className="mt-4 text-accent font-bold underline decoration-2 hover:text-indigo-800"
            >
              Visit My Stable 🏠
            </button>
          )}
        </GameOverlay>
      )}
      {/* Footer */}
      <footer className="mt-auto pt-8 text-center text-text-light/40 text-sm">
        <p>Made for horse lovers 🐴</p>
      </footer>
    </div>
  );
}
