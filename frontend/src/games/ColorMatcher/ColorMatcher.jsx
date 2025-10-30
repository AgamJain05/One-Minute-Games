import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Play, Palette } from 'lucide-react';
import { useAuthStore } from '@store/authStore';
import { scoresAPI } from '@services/api';
import { COLOR_CODES } from './data';
import Timer from '../CodeType/components/Timer';
import Results from '../OutputPredictor/components/Results';

export default function ColorMatcher() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  
  const [gameState, setGameState] = useState('idle');
  const [currentColor, setCurrentColor] = useState(null);
  const [score, setScore] = useState(0);
  const [totalAttempts, setTotalAttempts] = useState(0);
  const [correctAttempts, setCorrectAttempts] = useState(0);
  const [combo, setCombo] = useState(0);

  const startGame = () => {
    setScore(0);
    setTotalAttempts(0);
    setCorrectAttempts(0);
    setCombo(0);
    setGameState('playing');
    loadNewColor();
  };

  const loadNewColor = () => {
    const color = COLOR_CODES[Math.floor(Math.random() * COLOR_CODES.length)];
    setCurrentColor(color);
  };

  const handleAnswer = (selected) => {
    setTotalAttempts(prev => prev + 1);
    
    const isCorrect = selected === currentColor.code;
    
    if (isCorrect) {
      const newCombo = combo + 1;
      const comboBonus = Math.floor(newCombo / 3) * 5;
      setScore(prev => prev + 10 + comboBonus);
      setCorrectAttempts(prev => prev + 1);
      setCombo(newCombo);
    } else {
      setCombo(0);
    }
    
    setTimeout(loadNewColor, 500);
  };

  const endGame = () => {
    const accuracy = totalAttempts > 0 
      ? Math.round((correctAttempts / totalAttempts) * 100) 
      : 0;

    setGameState('finished');

    if (user) {
      scoresAPI.submit({
        gameId: 'colormatcher',
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
        <h1 className="text-4xl font-bold mb-2">🎨 Color Code Matcher</h1>
        <p className="text-gray-400">Match colors to their hex/RGB codes</p>
      </motion.div>

      <div className="card space-y-6">
        {gameState === 'idle' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center space-y-6 py-12"
          >
            <Palette className="w-24 h-24 text-primary mx-auto" />
            <h2 className="text-2xl font-semibold">Ready to match colors?</h2>
            <p className="text-gray-400 max-w-md mx-auto">
              Test your color code knowledge! Match colors to their codes.
            </p>
            <button onClick={startGame} className="btn-primary flex items-center gap-2 mx-auto">
              <Play size={20} />
              Start Challenge
            </button>
          </motion.div>
        )}

        {gameState === 'playing' && currentColor && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            <div className="flex justify-between items-center">
              <div className="text-xl font-bold text-primary">Score: {score}</div>
              {combo > 0 && (
                <div className="text-warning font-semibold">
                  🔥 Combo: {combo}
                </div>
              )}
            </div>

            <div className="card bg-gray-800">
              <h3 className="text-lg font-semibold mb-4 text-center">What code represents this color?</h3>
              <div 
                className="w-full h-40 rounded-lg"
                style={{ backgroundColor: currentColor.hex }}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              {currentColor.options.map((option, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleAnswer(option)}
                  className="bg-dark-bg hover:bg-gray-800 border-2 border-gray-700 hover:border-primary rounded-lg p-4 transition-all group"
                >
                  <code className="text-lg font-mono group-hover:text-primary transition-colors">
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





