import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Play } from 'lucide-react';
import { useAuthStore } from '@store/authStore';
import { scoresAPI } from '@services/api';
import { DEBUG_CHALLENGES } from './data';
import Timer from '../CodeType/components/Timer';
import Results from '../OutputPredictor/components/Results';

export default function DebugRace() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  
  const [gameState, setGameState] = useState('idle');
  const [currentChallenge, setCurrentChallenge] = useState(null);
  const [score, setScore] = useState(0);
  const [totalAttempts, setTotalAttempts] = useState(0);
  const [correctAttempts, setCorrectAttempts] = useState(0);
  const [streak, setStreak] = useState(0);

  const startGame = () => {
    setScore(0);
    setTotalAttempts(0);
    setCorrectAttempts(0);
    setStreak(0);
    setGameState('playing');
    loadNewChallenge();
  };

  const loadNewChallenge = () => {
    const challenge = DEBUG_CHALLENGES[Math.floor(Math.random() * DEBUG_CHALLENGES.length)];
    setCurrentChallenge(challenge);
  };

  const handleAnswer = (selected) => {
    setTotalAttempts(prev => prev + 1);
    
    const isCorrect = selected === currentChallenge.fix;
    
    if (isCorrect) {
      const streakBonus = Math.floor(streak / 3) * 5;
      setScore(prev => prev + 15 + streakBonus);
      setCorrectAttempts(prev => prev + 1);
      setStreak(prev => prev + 1);
    } else {
      setStreak(0);
    }
    
    setTimeout(loadNewChallenge, 500);
  };

  const endGame = () => {
    const accuracy = totalAttempts > 0 
      ? Math.round((correctAttempts / totalAttempts) * 100) 
      : 0;

    setGameState('finished');

    if (user) {
      scoresAPI.submit({
        gameId: 'debugrace',
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
        <h1 className="text-4xl font-bold mb-2">🏁 Debug Race</h1>
        <p className="text-gray-400">Find and fix bugs as fast as you can</p>
      </motion.div>

      <div className="card space-y-6">
        {gameState === 'idle' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center space-y-6 py-12"
          >
            <div className="text-6xl mb-4">🏁</div>
            <h2 className="text-2xl font-semibold">Ready to debug?</h2>
            <p className="text-gray-400 max-w-md mx-auto">
              Race against time! Find and fix bugs quickly.
            </p>
            <button onClick={startGame} className="btn-primary flex items-center gap-2 mx-auto">
              <Play size={20} />
              Start Challenge
            </button>
          </motion.div>
        )}

        {gameState === 'playing' && currentChallenge && (
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

            <div className="card bg-danger bg-opacity-10 border-danger">
              <h3 className="text-lg font-semibold mb-2 text-danger">Buggy Code:</h3>
              <pre className="text-cyan-300 font-mono text-sm">
                {currentChallenge.code}
              </pre>
            </div>

            <div className="card bg-primary bg-opacity-10 border-primary">
              <h3 className="text-lg font-semibold mb-2">Problem:</h3>
              <p className="text-gray-300">{currentChallenge.problem}</p>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {currentChallenge.options.map((option, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleAnswer(option)}
                  className="bg-dark-bg hover:bg-gray-800 border-2 border-gray-700 hover:border-primary rounded-lg p-4 text-left transition-all group"
                >
                  <span className="text-lg group-hover:text-primary transition-colors">
                    {option}
                  </span>
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





