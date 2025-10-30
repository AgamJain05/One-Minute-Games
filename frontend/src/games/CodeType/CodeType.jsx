import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Play } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuthStore } from '@store/authStore';
import { scoresAPI } from '@services/api';
import { CODE_SNIPPETS } from './data';
import Timer from './components/Timer';
import Results from './components/Results';

export default function CodeType() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const inputRef = useRef(null);
  
  const [gameState, setGameState] = useState('idle'); // idle, playing, finished
  const [currentSnippet, setCurrentSnippet] = useState(null);
  const [userInput, setUserInput] = useState('');
  const [startTime, setStartTime] = useState(null);
  const [results, setResults] = useState(null);

  const startGame = () => {
    const snippet = CODE_SNIPPETS[Math.floor(Math.random() * CODE_SNIPPETS.length)];
    setCurrentSnippet(snippet);
    setUserInput('');
    setStartTime(Date.now());
    setGameState('playing');
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const endGame = () => {
    if (!currentSnippet) return;

    const timeElapsed = (Date.now() - startTime) / 60000; // minutes
    const correctChars = userInput.split('').filter((char, i) => char === currentSnippet.code[i]).length;
    const totalChars = userInput.length;
    const cpm = Math.round(correctChars / timeElapsed);
    const accuracy = totalChars > 0 ? Math.round((correctChars / totalChars) * 100) : 0;
    const score = Math.round(cpm * (accuracy / 100));

    const gameResults = {
      score,
      cpm,
      accuracy,
      correctChars,
      totalChars
    };

    setResults(gameResults);
    setGameState('finished');

    // Submit score if logged in
    if (user) {
      scoresAPI.submit({
        gameId: 'codetype',
        score,
        accuracy,
        correctAnswers: correctChars,
        totalAttempts: totalChars,
        metadata: { cpm }
      }).catch(err => console.error('Failed to submit score:', err));
    }
  };

  const handleInputChange = (e) => {
    setUserInput(e.target.value);
    if (e.target.value === currentSnippet.code) {
      endGame();
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
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

      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-4xl font-bold mb-2">⌨️ CodeType</h1>
        <p className="text-gray-400">Type the code snippet as accurately as possible</p>
      </motion.div>

      {/* Game Content */}
      <div className="card space-y-6">
        {gameState === 'idle' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center space-y-6 py-12"
          >
            <div className="text-6xl mb-4">⌨️</div>
            <h2 className="text-2xl font-semibold">Ready to type?</h2>
            <p className="text-gray-400 max-w-md mx-auto">
              You'll have 60 seconds to type a code snippet as accurately as possible.
              Your score is based on speed (CPM) and accuracy.
            </p>
            <button onClick={startGame} className="btn-primary flex items-center gap-2 mx-auto">
              <Play size={20} />
              Start Challenge
            </button>
          </motion.div>
        )}

        {gameState === 'playing' && currentSnippet && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            <div className="bg-primary bg-opacity-20 text-primary px-3 py-1 rounded inline-block text-sm">
              {currentSnippet.language}
            </div>
            
            <pre className="bg-dark-bg border-2 border-gray-700 rounded-lg p-4 font-mono text-sm overflow-x-auto">
              <code className="text-cyan-300">{currentSnippet.code}</code>
            </pre>

            <textarea
              ref={inputRef}
              value={userInput}
              onChange={handleInputChange}
              className="w-full bg-dark-bg border-2 border-gray-700 rounded-lg p-4 font-mono text-sm resize-none focus:border-primary outline-none"
              rows={10}
              placeholder="Start typing here..."
              spellCheck={false}
            />
            
            <div className="text-sm text-gray-400 text-center">
              Characters: {userInput.length} / {currentSnippet.code.length}
            </div>
          </motion.div>
        )}

        {gameState === 'finished' && results && (
          <Results results={results} onPlayAgain={startGame} onGoHome={() => navigate('/')} />
        )}
      </div>
    </div>
  );
}





