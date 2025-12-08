import { useState, useEffect, useCallback } from 'react';
import { questions as questionsData, Question } from '../data/questions';

const QUESTIONS_PER_ROUND = 10;
const TIME_PER_QUESTION = 15; // seconds

export type GameState = 'start' | 'playing' | 'results';

export interface AnswerRecord {
  questionId: number;
  isCorrect: boolean;
  selectedOption: string | null;
}

export function useQuiz() {
  const [gameState, setGameState] = useState<GameState>('start');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(TIME_PER_QUESTION);
  const [shuffledQuestions, setShuffledQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<AnswerRecord[]>([]);

  // Initialize game
  const startGame = useCallback(() => {
    // Shuffle questions and pick 10
    const shuffled = [...questionsData].sort(() => 0.5 - Math.random());
    setShuffledQuestions(shuffled.slice(0, QUESTIONS_PER_ROUND));
    setCurrentQuestionIndex(0);
    setScore(0);
    setAnswers([]);
    setGameState('playing');
    setTimeLeft(TIME_PER_QUESTION);
  }, []);

  // Handle answer
  const handleAnswer = (selectedOption: string | null) => {
    const currentQuestion = shuffledQuestions[currentQuestionIndex];
    if (!currentQuestion) return;
    const isCorrect = selectedOption === currentQuestion.correctAnswer;
    
    // Calculate points: Base 100 + (Time Left * 10)
    const points = isCorrect ? 100 + (timeLeft * 10) : 0;
    
    setScore((prev) => prev + points);
    setAnswers((prev) => [...prev, { questionId: currentQuestion.id, isCorrect, selectedOption }]);

    // Move to next question or end game
    if (currentQuestionIndex < shuffledQuestions.length - 1) {
      setTimeout(() => {
        setCurrentQuestionIndex((prev) => prev + 1);
        setTimeLeft(TIME_PER_QUESTION);
      }, 500); // Slight delay for feedback
    } else {
      setGameState('results');
    }
  };

  // Timer logic
  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    
    if (gameState === 'playing' && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && gameState === 'playing') {
      handleAnswer(null); // Timeout counts as incorrect/null answer
    }

    return () => clearInterval(timer);
  }, [gameState, timeLeft]); 

  const restartGame = () => {
    setGameState('start');
  };

  return {
    gameState,
    currentQuestion: shuffledQuestions[currentQuestionIndex],
    currentQuestionIndex,
    totalQuestions: QUESTIONS_PER_ROUND,
    score,
    timeLeft,
    handleAnswer,
    startGame,
    restartGame,
    questions: shuffledQuestions,
    lastAnswerCorrect: answers[answers.length - 1]?.isCorrect
  };
}
