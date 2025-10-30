import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Play, Globe } from 'lucide-react';
import { useAuthStore } from '@store/authStore';
import { scoresAPI } from '@services/api';
import { HTTP_STATUSES } from './data';
import Timer from '../CodeType/components/Timer';
import Results from '../OutputPredictor/components/Results';

export default function HttpStatus() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  
  const [gameState, setGameState] = useState('idle');
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [score, setScore] = useState(0);
  const [totalAttempts, setTotalAttempts] = useState(0);
  const [correctAttempts, setCorrectAttempts] = useState(0);
  const [usedQuestions, setUsedQuestions] = useState([]);
  const [streak, setStreak] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);

  const startGame = () => {
    setScore(0);
    setTotalAttempts(0);
    setCorrectAttempts(0);
    setUsedQuestions([]);
    setStreak(0);
    setGameState('playing');
    loadNewQuestion();
  };

  const loadNewQuestion = () => {
    const available = HTTP_STATUSES.filter(q => !usedQuestions.find(used => used.code === q.code));
    const pool = available.length > 0 ? available : HTTP_STATUSES;
    const question = pool[Math.floor(Math.random() * pool.length)];
    
    setCurrentQuestion(question);
    setSelectedOption(null);
    if (available.length > 0) {
      setUsedQuestions(prev => [...prev, question]);
    }
  };

  const handleAnswer = (selectedAnswer) => {
    if (!currentQuestion || selectedOption !== null) return;
    setTotalAttempts(prev => prev + 1);
    setSelectedOption(selectedAnswer);
    
    const isCorrect = selectedAnswer === currentQuestion.answer;
    
    if (isCorrect) {
      const streakBonus = Math.floor(streak / 3) * 2;
      const points = 10 + streakBonus;
      setScore(prev => prev + points);
      setCorrectAttempts(prev => prev + 1);
      setStreak(prev => prev + 1);
    } else {
      setStreak(0);
    }
    
    setTimeout(loadNewQuestion, 700);
  };

  const endGame = () => {
    const accuracy = totalAttempts > 0 
      ? Math.round((correctAttempts / totalAttempts) * 100) 
      : 0;

    setGameState('finished');

    if (user) {
      scoresAPI.submit({
        gameId: 'httpstatus',
        score,
        accuracy,
        correctAnswers: correctAttempts,
        totalAttempts,
      }).catch(err => console.error('Failed to submit score:', err));
    }
  };

  const getStatusColor = (code) => {
    const num = parseInt(code);
    if (num >= 200 && num < 300) return 'text-green-400';
    if (num >= 300 && num < 400) return 'text-blue-400';
    if (num >= 400 && num < 500) return 'text-warning';
    if (num >= 500) return 'text-danger';
    return 'text-gray-400';
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft size={20} />
          Back to Home
        </button>
        {gameState === 'playing' && <Timer duration={60} onComplete={endGame} />}
      </div>

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-4xl font-bold mb-2">🌐 HTTP Status Quiz</h1>
        <p className="text-gray-400">Match HTTP status codes to their meanings</p>
      </motion.div>

      <div className="card space-y-6">
        {gameState === 'idle' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center space-y-6 py-12"
          >
            <Globe className="w-24 h-24 text-primary mx-auto" />
            <h2 className="text-2xl font-semibold">Ready to master HTTP status codes?</h2>
            <p className="text-gray-400 max-w-md mx-auto">
              Test your knowledge of HTTP status codes! Match codes to their meanings.
            </p>
            <button onClick={startGame} className="btn-primary flex items-center gap-2 mx-auto">
              <Play size={20} />
              Start Challenge
            </button>
          </motion.div>
        )}

        {gameState === 'playing' && currentQuestion && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            <div className="flex justify-between items-center">
              <div className="text-xl font-bold text-primary">Score: {score}</div>
              {streak > 0 && (
                <div className="text-warning font-semibold">
                  🔥 Streak: {streak}
                </div>
              )}
            </div>

            <div className="card bg-primary bg-opacity-10 border-primary">
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-3">HTTP Status Code:</h3>
                <div className={`text-6xl font-bold ${getStatusColor(currentQuestion.code)}`}>
                  {currentQuestion.code}
                </div>
              </div>
            </div>

            <div className="text-center text-sm text-gray-400 mb-2">
              What does this status code mean?
            </div>

            <div className="grid grid-cols-1 gap-3">
              {currentQuestion.options.map((option, index) => {
                const showResult = selectedOption !== null;
                const isSelected = selectedOption === option;
                const isCorrect = option === currentQuestion.answer;
                let btnClass = 'bg-dark-bg border-2 border-gray-700 rounded-lg p-4 text-left transition-all';
                if (showResult) {
                  if (isSelected && isCorrect) btnClass = 'bg-success border-success text-white rounded-lg p-4 text-left transition-all';
                  else if (isSelected && !isCorrect) btnClass = 'bg-danger border-danger text-white rounded-lg p-4 text-left transition-all';
                  else if (isCorrect) btnClass = 'bg-success bg-opacity-20 border-success text-success rounded-lg p-4 text-left transition-all';
                }
                return (
                  <motion.button
                    key={index}
                    whileHover={{ scale: selectedOption ? 1 : 1.02 }}
                    whileTap={{ scale: selectedOption ? 1 : 0.98 }}
                    onClick={() => handleAnswer(option)}
                    disabled={selectedOption !== null}
                    className={btnClass}
                  >
                    <span className="text-lg">
                      {option}
                    </span>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        )}

        {gameState === 'finished' && (
          <Results 
            score={score}
            correct={correctAttempts}
            total={totalAttempts}
            accuracy={totalAttempts > 0 ? Math.round((correctAttempts / totalAttempts) * 100) : 0}
            onPlayAgain={startGame}
            onGoHome={() => navigate('/')}
          />
        )}
      </div>
    </div>
  );
}




