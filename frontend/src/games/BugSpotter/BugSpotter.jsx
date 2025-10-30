import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Play } from 'lucide-react';
import { useAuthStore } from '@store/authStore';
import { scoresAPI } from '@services/api';
import { BUGGY_CODE } from './data';
import Timer from '../CodeType/components/Timer';
import Results from './components/Results';

export default function BugSpotter() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  
  const [gameState, setGameState] = useState('idle');
  const [currentCode, setCurrentCode] = useState(null);
  const [score, setScore] = useState(0);
  const [totalAttempts, setTotalAttempts] = useState(0);
  const [correctAttempts, setCorrectAttempts] = useState(0);
  const [foundBugs, setFoundBugs] = useState(new Set());

  const startGame = () => {
    setScore(0);
    setTotalAttempts(0);
    setCorrectAttempts(0);
    setGameState('playing');
    generateNewProblem();
  };

  const generateNewProblem = () => {
    const problem = BUGGY_CODE[Math.floor(Math.random() * BUGGY_CODE.length)];
    setCurrentCode(problem);
    setFoundBugs(new Set());
  };

  const handleLineClick = (lineIndex) => {
    if (gameState !== 'playing') return;

    setTotalAttempts(prev => prev + 1);

    if (currentCode.bugs.includes(lineIndex)) {
      // Correct! Found a bug
      const newFoundBugs = new Set(foundBugs);
      newFoundBugs.add(lineIndex);
      setFoundBugs(newFoundBugs);
      setCorrectAttempts(prev => prev + 1);
      setScore(prev => prev + 10);

      // If all bugs found, generate new problem
      if (newFoundBugs.size === currentCode.bugs.length) {
        setTimeout(generateNewProblem, 500);
      }
    }
  };

  const endGame = () => {
    const accuracy = totalAttempts > 0 
      ? Math.round((correctAttempts / totalAttempts) * 100) 
      : 0;

    setGameState('finished');

    if (user) {
      scoresAPI.submit({
        gameId: 'bugspotter',
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
        <h1 className="text-4xl font-bold mb-2">🐛 Bug Spotter</h1>
        <p className="text-gray-400">Find and click on the buggy lines of code</p>
      </motion.div>

      <div className="card space-y-6">
        {gameState === 'idle' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center space-y-6 py-12"
          >
            <div className="text-6xl mb-4">🐛</div>
            <h2 className="text-2xl font-semibold">Ready to hunt bugs?</h2>
            <p className="text-gray-400 max-w-md mx-auto">
              Find as many bugs as you can in 60 seconds. Click on the lines with bugs!
            </p>
            <button onClick={startGame} className="btn-primary flex items-center gap-2 mx-auto">
              <Play size={20} />
              Start Challenge
            </button>
          </motion.div>
        )}

        {gameState === 'playing' && currentCode && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            <div className="flex justify-between items-center">
              <div className="text-xl font-bold text-primary">Score: {score}</div>
              <div className="text-sm text-gray-400">
                Bugs Found: {foundBugs.size} / {currentCode.bugs.length}
              </div>
            </div>

            <div className="bg-dark-bg border-2 border-gray-700 rounded-lg p-4">
              <div className="font-mono text-sm space-y-1">
                {currentCode.code.map((line, index) => (
                  <div
                    key={index}
                    onClick={() => handleLineClick(index)}
                    className={`px-3 py-1 rounded cursor-pointer transition-all ${
                      foundBugs.has(index)
                        ? 'bg-green-500 bg-opacity-20 border-l-4 border-green-500'
                        : 'hover:bg-gray-800'
                    }`}
                  >
                    <span className="text-gray-500 mr-4">{index + 1}</span>
                    <span className="text-cyan-300">{line}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="text-center text-sm text-gray-400">
              Click on lines you think have bugs
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





