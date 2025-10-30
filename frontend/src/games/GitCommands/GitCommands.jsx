import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Play, GitBranch } from 'lucide-react';
import { useAuthStore } from '@store/authStore';
import { scoresAPI } from '@services/api';
import { GIT_COMMANDS } from './data';
import Timer from '../CodeType/components/Timer';
import Results from '../OutputPredictor/components/Results';

export default function GitCommands() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  
  const [gameState, setGameState] = useState('idle');
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [score, setScore] = useState(0);
  const [totalAttempts, setTotalAttempts] = useState(0);
  const [correctAttempts, setCorrectAttempts] = useState(0);
  const [usedQuestions, setUsedQuestions] = useState([]);
  const [streak, setStreak] = useState(0);

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
    const available = GIT_COMMANDS.filter(q => !usedQuestions.find(used => used.question === q.question));
    const pool = available.length > 0 ? available : GIT_COMMANDS;
    const question = pool[Math.floor(Math.random() * pool.length)];
    
    setCurrentQuestion(question);
    if (available.length > 0) {
      setUsedQuestions(prev => [...prev, question]);
    }
  };

  const handleAnswer = (selectedAnswer) => {
    setTotalAttempts(prev => prev + 1);
    
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
    
    setTimeout(loadNewQuestion, 500);
  };

  const endGame = () => {
    const accuracy = totalAttempts > 0 
      ? Math.round((correctAttempts / totalAttempts) * 100) 
      : 0;

    setGameState('finished');

    if (user) {
      scoresAPI.submit({
        gameId: 'gitcommands',
        score,
        accuracy,
        correctAnswers: correctAttempts,
        totalAttempts,
      }).catch(err => console.error('Failed to submit score:', err));
    }
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
        <h1 className="text-4xl font-bold mb-2">🔱 Git Command Rush</h1>
        <p className="text-gray-400">Master your Git workflow commands</p>
      </motion.div>

      <div className="card space-y-6">
        {gameState === 'idle' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center space-y-6 py-12"
          >
            <GitBranch className="w-24 h-24 text-primary mx-auto" />
            <h2 className="text-2xl font-semibold">Ready to master Git?</h2>
            <p className="text-gray-400 max-w-md mx-auto">
              Test your Git command knowledge! Choose the right command for each task.
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
              <div className="flex items-start gap-3">
                <GitBranch className="text-primary mt-1" size={24} />
                <div>
                  <h3 className="text-lg font-semibold mb-2">Task:</h3>
                  <p className="text-gray-300 text-lg">{currentQuestion.question}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {currentQuestion.options.map((option, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleAnswer(option)}
                  className="bg-dark-bg hover:bg-gray-800 border-2 border-gray-700 hover:border-primary rounded-lg p-4 text-left transition-all group"
                >
                  <code className="text-cyan-300 font-mono text-lg group-hover:text-primary transition-colors">
                    {option}
                  </code>
                </motion.button>
              ))}
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





