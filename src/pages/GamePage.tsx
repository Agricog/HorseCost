import { Helmet } from 'react-helmet-async'
import { useQuiz } from '../hooks/useQuiz'
import { useProgress } from '../hooks/useProgress'
import { QuizCard } from '../components/QuizCard'
import { Timer } from '../components/Timer'
import { GameOverlay } from '../components/GameOverlay'
import { MyStable } from '../components/MyStable'
import { useState } from 'react'
import { 
  ArrowLeft, 
  Trophy, 
  Star, 
  Share2, 
  Gamepad2,
  Calculator,
  Sparkles
} from 'lucide-react'

export default function GamePage() {
  const [view, setView] = useState<'game' | 'stable'>('game')
  const { progress, saveGameResult } = useProgress()
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
  } = useQuiz()

  const handleGameEnd = () => {
    saveGameResult(score)
    restartGame()
  }

  const shareScore = () => {
    const text = `🐴 I scored ${score} points in Horse Care Challenge! Can you beat me? Play free at horsecost.co.uk/horse-care-challenge`
    if (navigator.share) {
      navigator.share({ text, url: 'https://horsecost.co.uk/horse-care-challenge' })
    } else {
      navigator.clipboard.writeText(text)
      alert('Score copied to clipboard!')
    }
  }

  if (view === 'stable') {
    return <MyStable progress={progress} onBack={() => setView('game')} />
  }

  return (
    <>
      <Helmet>
        <title>Horse Care Challenge | Free Quiz Game for Kids | HorseCost</title>
        <meta 
          name="description" 
          content="Test your horse knowledge with our free quiz game! Perfect for kids and adults learning about horse care. Earn badges, compete with friends, and learn while having fun." 
        />
        <meta name="keywords" content="horse quiz game, horse care quiz, equestrian quiz, horse trivia, kids horse game, learn horse care" />
        <meta name="author" content="HorseCost" />
        <meta name="robots" content="index, follow" />
        <meta name="theme-color" content="#7c3aed" />
        
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Horse Care Challenge | Free Quiz Game" />
        <meta property="og:description" content="Test your horse knowledge! Free quiz game for kids and adults." />
        <meta property="og:url" content="https://horsecost.co.uk/horse-care-challenge" />
        <meta property="og:image" content="https://horsecost.co.uk/images/horse-care-challenge-og.jpg" />
        
        <link rel="canonical" href="https://horsecost.co.uk/horse-care-challenge" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-purple-100 via-indigo-50 to-violet-100">
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-md border-b border-purple-200 sticky top-0 z-50">
          <nav className="max-w-4xl mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <a href="/" className="flex items-center gap-2 text-purple-600 hover:text-purple-800 font-medium">
                <ArrowLeft className="w-5 h-5" />
                <span className="hidden sm:inline">Back to HorseCost</span>
              </a>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 bg-purple-100 px-3 py-1.5 rounded-full">
                  <Trophy className="w-4 h-4 text-purple-600" />
                  <span className="font-bold text-purple-700">{progress?.highScore || 0}</span>
                  <span className="text-purple-500 text-sm">Best</span>
                </div>
                <button 
                  onClick={() => setView('stable')}
                  className="bg-purple-600 text-white px-4 py-1.5 rounded-full text-sm font-semibold hover:bg-purple-700 transition"
                >
                  My Stable 🏠
                </button>
              </div>
            </div>
          </nav>
        </header>

        <main className="max-w-2xl mx-auto px-4 py-8">
          {/* Game Title */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-purple-200 text-purple-800 px-4 py-2 rounded-full text-sm font-semibold mb-4">
              <Gamepad2 className="w-4 h-4" />
              Free Horse Quiz Game
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-purple-900 mb-2">
              Horse Care Challenge
            </h1>
            <p className="text-purple-600">
              {gameState === 'playing' 
                ? `Question ${currentQuestionIndex + 1} of ${totalQuestions}`
                : 'Test your horse knowledge!'
              }
            </p>
          </div>

          {/* Score Display */}
          {gameState === 'playing' && (
            <div className="flex justify-center mb-6">
              <div className="bg-white rounded-2xl shadow-lg px-8 py-4 flex items-center gap-4">
                <div className="text-center">
                  <p className="text-purple-500 text-sm font-medium">Score</p>
                  <p className="text-3xl font-bold text-purple-700">{score}</p>
                </div>
                <div className="w-px h-12 bg-purple-200"></div>
                <Timer timeLeft={timeLeft} totalTime={15} />
              </div>
            </div>
          )}

          {/* Game Area */}
          <div className="relative">
            {/* Decorative sparkles */}
            <Sparkles className="absolute -top-4 -left-4 w-8 h-8 text-yellow-400 animate-pulse hidden sm:block" />
            <Sparkles className="absolute -top-2 -right-8 w-6 h-6 text-pink-400 animate-pulse hidden sm:block" />
            
            {gameState === 'playing' ? (
              <div className="bg-white rounded-3xl shadow-xl p-6 sm:p-8">
                {currentQuestion && (
                  <QuizCard 
                    question={currentQuestion} 
                    onAnswer={handleAnswer} 
                    isLoading={false}
                  />
                )}
              </div>
            ) : gameState === 'start' ? (
              <div className="bg-white rounded-3xl shadow-xl p-8 sm:p-12 text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <Gamepad2 className="w-12 h-12 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Ready to Play?</h2>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                  Answer 10 questions about horse care. The faster you answer correctly, 
                  the more points you earn!
                </p>
                <div className="grid grid-cols-3 gap-4 mb-8">
                  <div className="bg-purple-50 rounded-xl p-4">
                    <p className="text-2xl font-bold text-purple-600">10</p>
                    <p className="text-purple-500 text-sm">Questions</p>
                  </div>
                  <div className="bg-purple-50 rounded-xl p-4">
                    <p className="text-2xl font-bold text-purple-600">15s</p>
                    <p className="text-purple-500 text-sm">Per Question</p>
                  </div>
                  <div className="bg-purple-50 rounded-xl p-4">
                    <p className="text-2xl font-bold text-purple-600">⭐</p>
                    <p className="text-purple-500 text-sm">Earn Points</p>
                  </div>
                </div>
                <button
                  onClick={startGame}
                  className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-4 rounded-xl font-bold text-lg hover:from-purple-700 hover:to-indigo-700 transition shadow-lg"
                >
                  Start Game 🎮
                </button>
                <button 
                  onClick={() => setView('stable')}
                  className="mt-4 text-purple-600 font-semibold hover:text-purple-800"
                >
                  Visit My Stable 🏠
                </button>
              </div>
            ) : (
              <div className="bg-white rounded-3xl shadow-xl p-8 sm:p-12 text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <Trophy className="w-12 h-12 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Game Over!</h2>
                <p className="text-gray-500 mb-6">Great job, horse expert!</p>
                
                <div className="bg-gradient-to-r from-purple-100 to-indigo-100 rounded-2xl p-6 mb-8">
                  <p className="text-purple-600 font-medium mb-1">Your Score</p>
                  <p className="text-5xl font-bold text-purple-700 mb-2">{score}</p>
                  <div className="flex justify-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`w-6 h-6 ${
                          score >= (i + 1) * 300 
                            ? 'text-amber-400 fill-amber-400' 
                            : 'text-gray-300'
                        }`} 
                      />
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={handleGameEnd}
                    className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-4 rounded-xl font-bold text-lg hover:from-purple-700 hover:to-indigo-700 transition shadow-lg"
                  >
                    Play Again 🎮
                  </button>
                  <button
                    onClick={shareScore}
                    className="w-full bg-white border-2 border-purple-200 text-purple-600 py-4 rounded-xl font-bold text-lg hover:bg-purple-50 transition flex items-center justify-center gap-2"
                  >
                    <Share2 className="w-5 h-5" />
                    Share Score
                  </button>
                  
                    href="/annual-horse-cost-calculator"
                    className="block w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white py-4 rounded-xl font-bold text-lg hover:from-amber-600 hover:to-orange-600 transition shadow-lg"
                  >
                    Try Our Cost Calculator
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* How to Play */}
          {gameState === 'start' && (
            <div className="mt-12">
              <h3 className="text-xl font-bold text-purple-900 mb-4 text-center">How to Play</h3>
              <div className="grid sm:grid-cols-3 gap-4">
                <div className="bg-white/80 rounded-xl p-4 text-center">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <span className="text-purple-600 font-bold">1</span>
                  </div>
                  <p className="text-gray-700 text-sm">Read each question carefully</p>
                </div>
                <div className="bg-white/80 rounded-xl p-4 text-center">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <span className="text-purple-600 font-bold">2</span>
                  </div>
                  <p className="text-gray-700 text-sm">Answer before time runs out</p>
                </div>
                <div className="bg-white/80 rounded-xl p-4 text-center">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <span className="text-purple-600 font-bold">3</span>
                  </div>
                  <p className="text-gray-700 text-sm">Faster answers = more points!</p>
                </div>
              </div>
            </div>
          )}
        </main>

        {/* Footer */}
        <footer className="mt-auto py-8 text-center">
          <p className="text-purple-400 text-sm mb-2">Made for horse lovers 🐴</p>
          <a href="/" className="text-purple-600 font-medium hover:text-purple-800">
            Back to HorseCost Calculators
          </a>
        </footer>
      </div>
    </>
  )
}
