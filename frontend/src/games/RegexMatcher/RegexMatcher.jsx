import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Play, Search, CheckCircle, XCircle } from 'lucide-react';
import { useAuthStore } from '@store/authStore';
import { scoresAPI, questionsAPI, answersAPI } from '@services/api';
import Timer from '../CodeType/components/Timer';
import Results from '../OutputPredictor/components/Results';

export default function RegexMatcher() {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const [gameState, setGameState] = useState('idle');
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [score, setScore] = useState(0);
  const [totalAttempts, setTotalAttempts] = useState(0);
  const [correctAttempts, setCorrectAttempts] = useState(0);
  const [questionCount, setQuestionCount] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [sessionId] = useState(() => crypto.randomUUID());
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());
  const [isLoading, setIsLoading] = useState(false);
  const [isAnswering, setIsAnswering] = useState(false);
  const [lastAnswerCorrect, setLastAnswerCorrect] = useState(null);

  // Ref to the pending setTimeout so we can cancel it on unmount
  const nextQuestionTimer = useRef(null);

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const res = await questionsAPI.getCount('regexmatcher');
        setQuestionCount(res.data.count);
      } catch (error) {
        console.error('Failed to fetch question count:', error);
      }
    };
    fetchCount();

    return () => {
      if (nextQuestionTimer.current) clearTimeout(nextQuestionTimer.current);
    };
  }, []);

  const startGame = useCallback(async () => {
    if (isLoading) return;
    setIsLoading(true);

    let loadedQuestions = [];
    try {
      const res = await questionsAPI.getQuestions('regexmatcher', 20);
      if (res.data.questions && res.data.questions.length > 0) {
        loadedQuestions = res.data.questions;
      }
    } catch (error) {
      console.error('Failed to load questions:', error);
    }

    setQuestions(loadedQuestions);
    setScore(0);
    setTotalAttempts(0);
    setCorrectAttempts(0);
    setIsAnswering(false);
    setLastAnswerCorrect(null);
    setGameState('playing');
    setIsLoading(false);

    if (loadedQuestions.length > 0) {
      const first = loadedQuestions[0];
      const questionData = first.data || first;
      setCurrentQuestion({ ...questionData, _id: first._id });
      setCurrentQuestionIndex(1);
      setQuestionStartTime(Date.now());
    }
  }, [isLoading]);

  // Use a ref to keep a stable reference to the questions array so loadNewQuestion
  // never captures a stale closure — avoids the wrap-around freeze bug.
  const questionsRef = useRef(questions);
  useEffect(() => { questionsRef.current = questions; }, [questions]);

  const loadNewQuestion = useCallback((nextIndex) => {
    const qs = questionsRef.current;
    if (qs.length === 0) return;

    // Compute the actual index to load, wrapping around without relying on async state
    const safeIndex = nextIndex >= qs.length ? 0 : nextIndex;
    const question = qs[safeIndex];
    if (!question) return;

    const questionData = question.data || question;
    setCurrentQuestion({ ...questionData, _id: question._id });
    setCurrentQuestionIndex(safeIndex + 1);
    setQuestionStartTime(Date.now());
    setIsAnswering(false);
    setLastAnswerCorrect(null);
  }, []);

  const handleAnswer = useCallback(async (userAnswer) => {
    if (isAnswering || !currentQuestion) return;
    setIsAnswering(true);

    const isCorrect = userAnswer === currentQuestion.matches;
    setLastAnswerCorrect(isCorrect);
    setTotalAttempts(prev => prev + 1);

    if (isCorrect) {
      setScore(prev => prev + 10);
      setCorrectAttempts(prev => prev + 1);
    }

    if (user && currentQuestion._id) {
      try {
        await answersAPI.submit('regexmatcher', {
          questionId: currentQuestion._id,
          userAnswer,
          sessionId,
          timeSpent: Date.now() - questionStartTime,
          metadata: { isCorrect, pattern: currentQuestion.pattern?.toString(), string: currentQuestion.string }
        });
      } catch (error) {
        console.error('Failed to submit answer:', error);
      }
    }

    // Pass the next index explicitly so loadNewQuestion never reads stale state
    const nextIdx = currentQuestionIndex;
    nextQuestionTimer.current = setTimeout(() => loadNewQuestion(nextIdx), 600);
  }, [isAnswering, currentQuestion, currentQuestionIndex, user, sessionId, questionStartTime, loadNewQuestion]);

  const endGame = useCallback(() => {
    if (nextQuestionTimer.current) clearTimeout(nextQuestionTimer.current);
    const accuracy = totalAttempts > 0
      ? Math.round((correctAttempts / totalAttempts) * 100)
      : 0;

    setGameState('finished');

    if (user) {
      scoresAPI.submit({
        gameId: 'regexmatcher',
        score,
        accuracy,
        correctAnswers: correctAttempts,
        totalAttempts,
        metadata: { sessionId }
      }).catch(err => console.error('Failed to submit score:', err));
    }
  }, [totalAttempts, correctAttempts, score, user, sessionId]);

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
        <h1 className="text-4xl font-bold mb-2">🔍 Regex Matcher</h1>
        <p className="text-gray-400">Does the string match the regex pattern?</p>
      </motion.div>

      <div className="card space-y-6">
        {gameState === 'idle' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center space-y-6 py-12"
          >
            <Search className="w-24 h-24 text-primary mx-auto" />
            <h2 className="text-2xl font-semibold">Ready to match patterns?</h2>
            <p className="text-gray-400 max-w-md mx-auto">
              Test your regex knowledge! Determine if strings match the given patterns.
            </p>
            {questionCount > 0 && (
              <p className="text-primary text-sm">
                {questionCount} questions available
              </p>
            )}
            <button
              onClick={startGame}
              disabled={isLoading}
              className="btn-primary flex items-center gap-2 mx-auto disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Loading...
                </>
              ) : (
                <>
                  <Play size={20} />
                  Start Challenge
                </>
              )}
            </button>
          </motion.div>
        )}

        {gameState === 'playing' && currentQuestion && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            <div className="text-xl font-bold text-primary">Score: {score}</div>

            <div className="card bg-primary bg-opacity-10 border-primary">
              <h3 className="text-lg font-semibold mb-3">Pattern:</h3>
              <code className="text-2xl text-cyan-400 font-mono block p-4 bg-dark-bg rounded">
                {currentQuestion.pattern?.toString() ?? '—'}
              </code>
            </div>

            <div className="card bg-gray-800">
              <h3 className="text-lg font-semibold mb-3">Test String:</h3>
              <code className="text-xl text-green-400 font-mono">
                "{currentQuestion.string}"
              </code>
            </div>

            {/* Inline answer feedback */}
            <AnimatePresence mode="wait">
              {isAnswering && lastAnswerCorrect !== null && (
                <motion.div
                  key={lastAnswerCorrect ? 'correct' : 'incorrect'}
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className={`flex items-center justify-center gap-2 text-lg font-semibold py-2 rounded-lg ${
                    lastAnswerCorrect
                      ? 'text-green-400 bg-green-400/10'
                      : 'text-red-400 bg-red-400/10'
                  }`}
                >
                  {lastAnswerCorrect ? (
                    <><CheckCircle size={20} /> Correct!</>
                  ) : (
                    <><XCircle size={20} /> Incorrect</>
                  )}
                </motion.div>
              )}

              {!isAnswering && (
                <motion.div
                  key="prompt"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center text-lg font-semibold text-gray-300 my-4"
                >
                  Does the string match the pattern?
                </motion.div>
              )}
            </AnimatePresence>

            <div className="grid grid-cols-2 gap-4">
              <motion.button
                whileHover={!isAnswering ? { scale: 1.05 } : {}}
                whileTap={!isAnswering ? { scale: 0.95 } : {}}
                onClick={() => handleAnswer(true)}
                disabled={isAnswering}
                className="btn-primary text-lg py-4 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
              >
                ✅ Yes, it matches
              </motion.button>
              <motion.button
                whileHover={!isAnswering ? { scale: 1.05 } : {}}
                whileTap={!isAnswering ? { scale: 0.95 } : {}}
                onClick={() => handleAnswer(false)}
                disabled={isAnswering}
                className="btn-secondary text-lg py-4 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
              >
                ❌ No, it doesn't
              </motion.button>
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
