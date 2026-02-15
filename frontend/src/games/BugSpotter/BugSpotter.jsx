import { useState, useEffect, useCallback, useMemo, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Play, Lightbulb } from 'lucide-react';
import { useAuthStore } from '@store/authStore';
import { scoresAPI, questionsAPI, answersAPI } from '@services/api';
import Timer from '../CodeType/components/Timer';
import Results from './components/Results';
import toast from 'react-hot-toast';

// Define local fallback questions
const localBugQuestions = [
  {
    code: [
      'function calculateSum(arr) {',
      '  let sum = 0;',
      '  for (let i = 0; i <= arr.length; i++) {',
      '    sum += arr[i];',
      '  }',
      '  return sum;',
      '}'
    ],
    bugs: [2],
    language: 'JavaScript',
    explanation: 'Array index should be < arr.length, not <=',
    _id: 'local-1'
  },
  {
    code: [
      'def find_max(numbers):',
      '  max_num = 0',
      '  for num in numbers:',
      '    if num > max_num:',
      '      max_num = num',
      '  return max_num'
    ],
    bugs: [1],
    language: 'Python',
    explanation: 'Should initialize with first element or negative infinity',
    _id: 'local-2'
  },
  {
    code: [
      'const fetchData = async () => {',
      '  const response = await fetch(url);',
      '  const data = response.json();',
      '  return data;',
      '}'
    ],
    bugs: [2],
    language: 'JavaScript',
    explanation: 'Missing await before response.json()',
    _id: 'local-3'
  }
];

// Validate question structure
const validateQuestion = (questionData) => {
  if (!questionData) return false;
  if (!questionData.code || !Array.isArray(questionData.code)) return false;
  if (!questionData.bugs || !Array.isArray(questionData.bugs)) return false;
  if (questionData.code.length === 0) return false;
  if (questionData.bugs.length === 0) return false;
  return true;
};

// Memoized code line component
const CodeLine = memo(({ line, index, isFound, isWrong, isHint, onClick }) => (
  <div
    onClick={() => onClick(index)}
    className={`px-3 py-1 rounded cursor-pointer transition-all ${isFound
      ? 'bg-green-500 bg-opacity-20 border-l-4 border-green-500'
      : isWrong
        ? 'bg-red-500 bg-opacity-20 animate-pulse'
        : isHint
          ? 'ring-2 ring-yellow-500 animate-pulse'
          : 'hover:bg-gray-800'
      }`}
  >
    <span className="text-gray-500 mr-4">{index + 1}</span>
    <span className="text-cyan-300">{line}</span>
  </div>
));

export default function BugSpotter() {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const [gameState, setGameState] = useState('idle');
  const [currentCode, setCurrentCode] = useState(null);
  const [score, setScore] = useState(0);
  const [totalAttempts, setTotalAttempts] = useState(0);
  const [correctAttempts, setCorrectAttempts] = useState(0);
  const [foundBugs, setFoundBugs] = useState(new Set());
  const [wrongClicks, setWrongClicks] = useState(new Set());
  const [clickedLines, setClickedLines] = useState(new Set());
  const [questionCount, setQuestionCount] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [sessionId, setSessionId] = useState(() => crypto.randomUUID());
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());
  const [isLoading, setIsLoading] = useState(false);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [showHint, setShowHint] = useState(null);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);

  // Fetch question count on mount
  useEffect(() => {
    const fetchCount = async () => {
      try {
        const res = await questionsAPI.getCount('bugspotter');
        setQuestionCount(res.data?.count || 0);
      } catch (error) {
        console.error('Failed to fetch question count:', error);
      }
    };
    fetchCount();
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (gameState === 'playing') {
        console.log('Game interrupted');
      }
    };
  }, [gameState]);

  // Memoize progress calculation
  const progress = useMemo(() => ({
    found: foundBugs.size,
    total: currentCode?.bugs?.length || 0,
    percentage: currentCode?.bugs?.length
      ? Math.round((foundBugs.size / currentCode.bugs.length) * 100)
      : 0
  }), [foundBugs, currentCode]);

  const startGame = async () => {
    setIsLoading(true);
    setSessionId(crypto.randomUUID()); // New session ID

    let loadedQuestions = [];

    try {
      const res = await questionsAPI.getQuestions('bugspotter', 20);
      if (res.data?.questions?.length > 0) {
        loadedQuestions = res.data.questions;
      } else {
        // Use local questions as fallback
        loadedQuestions = localBugQuestions.map(q => ({ data: q, _id: q._id }));
        toast.info('Using practice questions');
      }
    } catch (error) {
      console.error('Failed to load questions:', error);
      // Use local questions on error
      loadedQuestions = localBugQuestions.map(q => ({ data: q, _id: q._id }));
      toast.error('Failed to load questions. Using practice mode.');
    } finally {
      setIsLoading(false);
    }

    // Validate we have questions
    if (loadedQuestions.length === 0) {
      toast.error('No questions available');
      return;
    }

    setQuestions(loadedQuestions);
    setScore(0);
    setTotalAttempts(0);
    setCorrectAttempts(0);
    setCurrentQuestionIndex(0);
    setCombo(0);
    setMaxCombo(0);
    setHintsUsed(0);
    setClickedLines(new Set());
    setGameState('playing');

    // Load first question
    loadQuestion(0, loadedQuestions);
  };

  // Separate load question function
  const loadQuestion = (index, questionsArray = questions) => {
    if (index >= questionsArray.length) {
      endGame();
      return;
    }

    const question = questionsArray[index];
    const questionData = question.data || question;

    // Validate question data
    if (!validateQuestion(questionData)) {
      console.error('Invalid question data:', questionData);
      toast.error('Invalid question. Skipping...');
      loadQuestion(index + 1, questionsArray);
      return;
    }

    setCurrentCode({ ...questionData, _id: question._id });
    setFoundBugs(new Set());
    setWrongClicks(new Set());
    setClickedLines(new Set());
    setShowHint(null); // Reset hint highlight
    setQuestionStartTime(Date.now());
  };

  // Better generateNewProblem
  const generateNewProblem = useCallback(() => {
    const nextIndex = currentQuestionIndex + 1; // Load next question

    if (nextIndex >= questions.length) {
      endGame();
      return;
    }

    loadQuestion(nextIndex);
    setCurrentQuestionIndex(nextIndex);
  }, [currentQuestionIndex, questions]);

  // Hint system
  const useHint = () => {
    if (hintsUsed >= 3 || !currentCode) return;

    const unfoundBug = currentCode.bugs.find(bugIndex => !foundBugs.has(bugIndex));

    if (unfoundBug !== undefined) {
      setShowHint(unfoundBug);
      setHintsUsed(prev => prev + 1);
      setScore(prev => Math.max(0, prev - 5));
      toast.info(`Hint: Check line ${unfoundBug + 1}`);

      setTimeout(() => setShowHint(null), 3000);
    }
  };

  // Improved handleLineClick
  const handleLineClick = useCallback(async (lineIndex) => {
    if (gameState !== 'playing') return;

    // Null checks
    if (!currentCode || !currentCode.bugs || !Array.isArray(currentCode.bugs)) {
      console.error('Invalid current code');
      return;
    }

    // Prevent duplicate clicks
    if (clickedLines.has(lineIndex)) {
      toast.error('You already clicked this line!');
      return;
    }

    // Prevent clicking already found bugs
    if (foundBugs.has(lineIndex)) {
      return;
    }

    setClickedLines(prev => new Set(prev).add(lineIndex));
    setTotalAttempts(prev => prev + 1);

    const isCorrect = currentCode.bugs.includes(lineIndex);

    if (isCorrect) {
      // Correct! Found a bug
      const newFoundBugs = new Set(foundBugs);
      newFoundBugs.add(lineIndex);
      setFoundBugs(newFoundBugs);
      setCorrectAttempts(prev => prev + 1);

      // Combo system
      const newCombo = combo + 1;
      setCombo(newCombo);
      setMaxCombo(Math.max(maxCombo, newCombo));

      const comboBonus = newCombo > 1 ? (newCombo - 1) * 2 : 0;
      setScore(prev => prev + 10 + comboBonus);

      toast.success(`Bug found! ${comboBonus > 0 ? `Combo x${newCombo} (+${comboBonus})` : ''}`);

      // Submit answer if user is logged in and question is from API
      if (user && currentCode._id && !currentCode._id.startsWith('local-')) {
        try {
          await answersAPI.submit('bugspotter', {
            questionId: currentCode._id,
            userAnswer: { lineIndex, isCorrect: true },
            sessionId,
            timeSpent: Date.now() - questionStartTime,
            metadata: { bugLine: lineIndex, combo: newCombo }
          });
        } catch (error) {
          console.error('Failed to submit answer:', error);
        }
      }

      // If all bugs found, generate new problem
      if (newFoundBugs.size === currentCode.bugs.length) {
        toast.success('All bugs found! Next question...');
        setTimeout(generateNewProblem, 1000);
      }
    } else {
      // Wrong! Not a bug
      setCombo(0); // Reset combo

      // Visual feedback for wrong click
      setWrongClicks(prev => new Set(prev).add(lineIndex));
      setTimeout(() => {
        setWrongClicks(prev => {
          const newSet = new Set(prev);
          newSet.delete(lineIndex);
          return newSet;
        });
      }, 1000);

      toast.error('Not a bug!');

      // Submit incorrect answer
      if (user && currentCode._id && !currentCode._id.startsWith('local-')) {
        try {
          await answersAPI.submit('bugspotter', {
            questionId: currentCode._id,
            userAnswer: { lineIndex, isCorrect: false },
            sessionId,
            timeSpent: Date.now() - questionStartTime,
            metadata: { bugLine: lineIndex }
          });
        } catch (error) {
          console.error('Failed to submit answer:', error);
        }
      }
    }
  }, [gameState, currentCode, foundBugs, clickedLines, combo, maxCombo, user, sessionId, questionStartTime, generateNewProblem]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (gameState !== 'playing') return;

      // Number keys 1-9
      const num = parseInt(e.key);
      if (num >= 1 && num <= 9 && currentCode?.code?.length >= num) {
        handleLineClick(num - 1);
      }

      // H for hint
      if (e.key === 'h' || e.key === 'H') {
        useHint();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [gameState, currentCode, handleLineClick]);

  const endGame = async () => {
    const accuracy = totalAttempts > 0
      ? Math.round((correctAttempts / totalAttempts) * 100)
      : 0;

    setGameState('finished');

    if (user) {
      try {
        await scoresAPI.submit({
          gameId: 'bugspotter',
          score,
          accuracy,
          correctAnswers: correctAttempts,
          totalAttempts,
          metadata: {
            sessionId,
            maxCombo,
            hintsUsed,
            questionsCompleted: currentQuestionIndex
          }
        });
        toast.success('Score saved!');
      } catch (err) {
        console.error('Failed to submit score:', err);
        toast.error('Failed to save score');
      }
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
            {questionCount > 0 && (
              <p className="text-primary text-sm">
                {questionCount} questions available
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

        {gameState === 'playing' && currentCode && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            <div className="flex justify-between items-center">
              <div className="space-y-1">
                <div className="text-xl font-bold text-primary">Score: {score}</div>
                {combo > 1 && (
                  <div className="text-sm text-yellow-400 animate-pulse">
                    Combo x{combo}! 🔥
                  </div>
                )}
              </div>
              <div className="text-right space-y-1">
                <div className="text-sm text-gray-400">
                  Bugs Found: {progress.found} / {progress.total}
                </div>
                <div className="text-xs text-gray-500">
                  Question {currentQuestionIndex + 1}
                </div>
              </div>
            </div>

            {/* Hint Button */}
            <div className="flex justify-center">
              <button
                onClick={useHint}
                disabled={hintsUsed >= 3}
                className="btn-secondary flex items-center gap-2 disabled:opacity-30"
              >
                <Lightbulb size={16} />
                Hint ({3 - hintsUsed} left) (-5 points)
              </button>
            </div>

            <div className="bg-dark-bg border-2 border-gray-700 rounded-lg p-4">
              <div className="font-mono text-sm space-y-1">
                {currentCode.code.map((line, index) => (
                  <CodeLine
                    key={index}
                    line={line}
                    index={index}
                    isFound={foundBugs.has(index)}
                    isWrong={wrongClicks.has(index)}
                    isHint={showHint === index}
                    onClick={handleLineClick}
                  />
                ))}
              </div>
            </div>

            <div className="text-center text-sm text-gray-400 space-y-1">
              <div>Click on lines you think have bugs</div>
              <div className="text-xs">Keyboard: Press 1-9 for lines, H for hint</div>
            </div>
          </motion.div>
        )}

        {gameState === 'finished' && (
          <Results
            score={score}
            correct={correctAttempts}
            total={totalAttempts}
            accuracy={totalAttempts > 0 ? Math.round((correctAttempts / totalAttempts) * 100) : 0}
            maxCombo={maxCombo}
            hintsUsed={hintsUsed}
            onPlayAgain={startGame}
            onGoHome={() => navigate('/')}
          />
        )}
      </div>
    </div>
  );
}