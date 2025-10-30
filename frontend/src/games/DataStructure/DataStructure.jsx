import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Play } from 'lucide-react';
import { useAuthStore } from '@store/authStore';
import { scoresAPI } from '@services/api';
import { DS_CHALLENGES } from './data';
import Timer from '../CodeType/components/Timer';
import Results from '../SqlBuilder/components/Results';

export default function DataStructure() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  
  const [gameState, setGameState] = useState('idle');
  const [currentChallenge, setCurrentChallenge] = useState(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [totalAttempts, setTotalAttempts] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);

  const startGame = () => {
    setScore(0);
    setCorrectCount(0);
    setTotalAttempts(0);
    setGameState('playing');
    loadNewChallenge();
  };

  const loadNewChallenge = () => {
    const challenge = DS_CHALLENGES[Math.floor(Math.random() * DS_CHALLENGES.length)];
    setCurrentChallenge(challenge);
    setUserAnswer('');
    setSelectedOption(null);
  };

  const handleAnswer = (selected) => {
    if (!currentChallenge || selectedOption !== null) return;
    setTotalAttempts(prev => prev + 1);
    setSelectedOption(selected);
    
    const isCorrect = selected === currentChallenge.answer;
    
    if (isCorrect) {
      setScore(prev => prev + 15);
      setCorrectCount(prev => prev + 1);
    }
    
    setTimeout(loadNewChallenge, 700);
  };

  const endGame = () => {
    const accuracy = totalAttempts > 0 
      ? Math.round((correctCount / totalAttempts) * 100) 
      : 0;

    setGameState('finished');

    if (user) {
      scoresAPI.submit({
        gameId: 'datastructure',
        score,
        accuracy,
        correctAnswers: correctCount,
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
        <h1 className="text-4xl font-bold mb-2">🏗️ Data Structure Builder</h1>
        <p className="text-gray-400">Test your knowledge of stacks, queues, and more</p>
      </motion.div>

      <div className="card space-y-6">
        {gameState === 'idle' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center space-y-6 py-12"
          >
            <div className="text-6xl mb-4">🏗️</div>
            <h2 className="text-2xl font-semibold">Ready to build data structures?</h2>
            <p className="text-gray-400 max-w-md mx-auto">
              Test your understanding of common data structures and their operations!
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
              <div className="text-sm text-gray-400">Correct: {correctCount}</div>
            </div>

            <div className="card bg-primary bg-opacity-10 border-primary">
              <h3 className="text-lg font-semibold mb-3">{currentChallenge.type}:</h3>
              <p className="text-gray-300 text-lg">{currentChallenge.question}</p>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {currentChallenge.options.map((option, index) => {
                const showResult = selectedOption !== null;
                const isSelected = selectedOption === option;
                const isCorrect = option === currentChallenge.answer;
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
            correct={correctCount}
            total={totalAttempts}
            accuracy={totalAttempts > 0 ? Math.round((correctCount / totalAttempts) * 100) : 0}
            onPlayAgain={startGame}
            onGoHome={() => navigate('/')}
          />
        )}
      </div>
    </div>
  );
}




