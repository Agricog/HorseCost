import React from 'react';
import { Question } from '../data/questions';
interface QuizCardProps {
  question: Question;
  onAnswer: (option: string) => void;
  isLoading: boolean;
}
export const QuizCard: React.FC<QuizCardProps> = ({ question, onAnswer, isLoading }) => {
  return (
    <div className="bg-surface p-6 rounded-2xl shadow-lg w-full max-w-md mx-auto animate-pop">
      <div className="flex justify-between items-center mb-4">
        <span className="bg-background text-text-light px-3 py-1 rounded-full text-sm font-semibold uppercase tracking-wider">
          {question.topic}
        </span>
        <span className={`px-3 py-1 rounded-full text-sm font-bold text-white
          ${question.difficulty === 'Novice' ? 'bg-secondary' : 
            question.difficulty === 'Bronze' ? 'bg-amber-600' :
            question.difficulty === 'Silver' ? 'bg-gray-400' :
            question.difficulty === 'Gold' ? 'bg-yellow-400' : 'bg-primary'}`}>
          {question.difficulty}
        </span>
      </div>
      
      <h2 className="text-xl md:text-2xl font-bold text-text mb-6 leading-tight">
        {question.question}
      </h2>
      <div className="grid gap-3">
        {question.options.map((option, index) => (
          <button
            key={index}
            onClick={() => !isLoading && onAnswer(option)}
            disabled={isLoading}
            className="w-full text-left p-4 rounded-xl bg-background hover:bg-primary hover:text-white transition-all transform active:scale-95 font-medium border-2 border-transparent hover:border-primary-dark focus:outline-none focus:border-accent"
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
};
