import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Play } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuthStore } from '@store/authStore';
import { scoresAPI, questionsAPI, answersAPI } from '@services/api';
import Timer from './components/Timer';
import Results from './components/Results';


const localSnippets = [
  {
    language: 'JavaScript',
    code: 'function hello() {\n  console.log("Hello World");\n}',
    _id: 'local-1'
  },
  {
    language: 'Python',
    code: 'def hello():\n    print("Hello World")',
    _id: 'local-2'
  },
  {
    language: 'TypeScript',
    code: 'const greeting: string = "Hello World";\nconsole.log(greeting);',
    _id: 'local-3'
  }
];

const normalizeQuestion = (question) => ({
  language: question?.data?.language || question?.language || 'Unknown',
  code: question?.data?.code || question?.code || '',
  _id: question?._id || crypto.randomUUID()
});

const normalizeCode = (code) =>
  (code || '').replace(/\r\n/g, '\n').trim();

export default function CodeType() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const inputRef = useRef(null);

  const [gameState, setGameState] = useState('idle');
  const [currentSnippet, setCurrentSnippet] = useState(null);
  const [userInput, setUserInput] = useState('');
  const [startTime, setStartTime] = useState(null);
  const [results, setResults] = useState(null);
  const [questionCount, setQuestionCount] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [sessionId, setSessionId] = useState(() => crypto.randomUUID());
  const [isLoading, setIsLoading] = useState(false); // 🔥 FIX 4: Loading state

  // Fetch question count on mount
  useEffect(() => {
    const fetchCount = async () => {
      try {
        const res = await questionsAPI.getCount('codetype');
        setQuestionCount(res.data?.count || 0);
      } catch (error) {
        console.error('Failed to fetch question count:', error);
      }
    };
    fetchCount();
  }, []);

  useEffect(() => {
    return () => {
      if (gameState === 'playing') {
        console.log('Component unmounted during game');
      }
    };
  }, [gameState]);

  const startGame = async () => {
    setIsLoading(true);
    setSessionId(crypto.randomUUID());

    try {
      const res = await questionsAPI.getQuestions('codetype', 10);

      if (res.data?.questions?.length) {
        setQuestions(res.data.questions);
        const firstQuestion = res.data.questions[0];
        setCurrentSnippet(normalizeQuestion(firstQuestion));
      } else {
        // Fallback to local snippets
        const snippet = localSnippets[Math.floor(Math.random() * localSnippets.length)];
        setCurrentSnippet(snippet);
        toast.info('Using practice snippets');
      }
    } catch (error) {
      console.error('Failed to load questions:', error);
      toast.error('Failed to load questions. Using practice snippets.');

      // Fallback to local snippets
      const snippet = localSnippets[Math.floor(Math.random() * localSnippets.length)];
      setCurrentSnippet(snippet);
    } finally {
      setIsLoading(false);
    }

    setUserInput('');
    setStartTime(Date.now());
    setCurrentQuestionIndex(0);
    setGameState('playing');

    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const endGame = useCallback(async () => {
    if (!currentSnippet || !currentSnippet.code || !startTime) {
      console.error('Cannot end game: missing data');
      return;
    }

    const timeElapsedMs = Date.now() - startTime;
    const timeElapsedMinutes = Math.max(timeElapsedMs / 60000, 0.01); // Min 0.01 minutes

    const codeNormalized = normalizeCode(currentSnippet.code);
    const inputNormalized = normalizeCode(userInput);

    // Calculate correct characters
    const maxLength = Math.min(inputNormalized.length, codeNormalized.length);
    const correctChars = inputNormalized
      .slice(0, maxLength)
      .split('')
      .filter((char, i) => char === codeNormalized[i])
      .length;

    const totalChars = Math.max(inputNormalized.length, 1); // Prevent division by 0
    const cpm = Math.round(correctChars / timeElapsedMinutes);
    const accuracy = Math.round((correctChars / totalChars) * 100);
    const score = Math.round(cpm * (accuracy / 100));

    const gameResults = {
      score,
      cpm,
      accuracy,
      correctChars,
      totalChars,
      timeElapsed: Math.round(timeElapsedMs / 1000) // seconds
    };

    setResults(gameResults);
    setGameState('finished');

    // Submit answer if question is from API and user is logged in
    if (user && currentSnippet._id && !currentSnippet._id.startsWith('local-')) {
      try {
        await answersAPI.submit('codetype', {
          questionId: currentSnippet._id,
          userAnswer: {
            text: userInput,
            isCorrect: inputNormalized === codeNormalized
          },
          sessionId,
          timeSpent: timeElapsedMs,
          metadata: { cpm, accuracy }
        });
      } catch (error) {
        console.error('Failed to submit answer:', error);
      }
    }

    // Submit score if logged in
    if (user) {
      try {
        await scoresAPI.submit({
          gameId: 'codetype',
          score,
          accuracy,
          correctAnswers: correctChars,
          totalAttempts: totalChars,
          metadata: { cpm, sessionId, timeElapsed: Math.round(timeElapsedMs / 1000) }
        });
        toast.success('Score saved!');
      } catch (err) {
        console.error('Failed to submit score:', err);
        toast.error('Failed to save score');
      }
    }
  }, [currentSnippet, userInput, startTime, user, sessionId]);

  const handleInputChange = (e) => {
    const newInput = e.target.value;
    setUserInput(newInput);

    if (currentSnippet && currentSnippet.code) {
      const codeNormalized = normalizeCode(currentSnippet.code);
      const inputNormalized = normalizeCode(newInput);

      if (inputNormalized === codeNormalized) {
        endGame();
      }
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    toast.error('Pasting is not allowed in this challenge!');
  };

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'Escape' && gameState === 'playing') {
        if (window.confirm('Are you sure you want to end the game?')) {
          endGame();
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [gameState, endGame]);

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
            {questionCount > 0 && (
              <p className="text-primary text-sm">
                {questionCount} code snippets available
              </p>
            )}
            <button
              onClick={startGame}
              disabled={isLoading}
              className="btn-primary flex items-center gap-2 mx-auto disabled:opacity-50"
            >
              <Play size={20} />
              {isLoading ? 'Loading...' : 'Start Challenge'}
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
              onPaste={handlePaste}
              className="w-full bg-dark-bg border-2 border-gray-700 rounded-lg p-4 font-mono text-sm resize-none focus:border-primary outline-none"
              rows={10}
              placeholder="Start typing here..."
              spellCheck={false}
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              aria-label="Code input area"
            />

            <div className="text-sm text-gray-400 text-center">
              Characters: {userInput.length} / {currentSnippet.code.length}
              {' • '}
              Press ESC to end early
            </div>
          </motion.div>
        )}

        {gameState === 'finished' && results && (
          <Results
            results={results}
            onPlayAgain={startGame}
            onGoHome={() => navigate('/')}
          />
        )}
      </div>
    </div>
  );
}