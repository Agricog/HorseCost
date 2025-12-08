import React from 'react';
interface GameOverlayProps {
    type: 'start' | 'results';
    score?: number;
    onAction: () => void;
    children?: React.ReactNode;
}
export const GameOverlay: React.FC<GameOverlayProps> = ({ type, score = 0, onAction, children }) => {
    return (
        <div className="fixed inset-0 bg-background/90 z-50 flex flex-col items-center justify-center p-4 animate-pop backdrop-blur-sm">
            <div className="bg-surface p-8 max-w-md w-full rounded-2xl shadow-xl text-center border-4 border-primary/20">
                {type === 'start' ? (
                    <>
                        <h1 className="text-4xl md:text-5xl font-black text-primary mb-2 tracking-tight">
                            Horse Care Challenge
                        </h1>
                        <p className="text-lg text-text-light mb-8">
                            Test your equestrian knowledge! 10 questions, speed counts. Can you earn the Champion Rosette?
                        </p>
                        <div className="space-y-4">
                            <div className="flex justify-center gap-2 mb-6">
                                {/* Decorative Rosette Placeholders */}
                                <div className="w-12 h-12 rounded-full bg-amber-700 shadow-md border-2 border-white"></div>
                                <div className="w-12 h-12 rounded-full bg-gray-400 shadow-md border-2 border-white scale-110"></div>
                                <div className="w-12 h-12 rounded-full bg-yellow-400 shadow-md border-2 border-white"></div>
                            </div>
                        </div>
                        <button
                            onClick={onAction}
                            className="w-full bg-secondary hover:bg-green-600 text-white text-xl py-4 rounded-xl shadow-lg transform transition-all hover:scale-105 font-bold"
                        >
                            Start Quiz! 🐴
                        </button>
                        {children}
                    </>
                ) : (
                    <>
                        <h2 className="text-3xl font-bold text-text mb-2">Ride Complete!</h2>
                        <div className="text-6xl font-black text-primary mb-4">{score}</div>
                        <p className="text-text-light font-medium mb-8">Total Points</p>
                        {/* Simple Rank Logic Display */}
                        <div className="mb-8 p-4 bg-background rounded-xl">
                            <p className="text-sm uppercase font-bold text-gray-500 mb-2"> Your Award </p>
                            <div className="text-2xl font-bold text-accent">
                                {score > 1500 ? "🏆 Champion!" : score > 1000 ? "🥇 Gold!" : score > 500 ? "🥈 Silver" : "🥉 Bronze"}
                            </div>
                        </div>
                        <button
                            onClick={onAction}
                            className="w-full bg-primary hover:bg-primary-dark text-white text-xl py-3 rounded-xl shadow-md font-bold"
                        >
                            Play Again 🔄
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};
