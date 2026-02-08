import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Play } from 'lucide-react';
import { useAuthStore } from '@store/authStore';
import { scoresAPI, questionsAPI, answersAPI } from '@services/api';
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
  const [questionCount, setQuestionCount] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [sessionId] = useState(() => crypto.randomUUID());
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());

  // Fetch question count on mount
  useEffect(() => {
    const fetchCount = async () => {
      try {
        const res = await questionsAPI.getCount('debugrace');
        setQuestionCount(res.data.count);
      } catch (error) {
        console.error('Failed to fetch question count:', error);
      }
    };
    fetchCount();
  }, []);

  const startGame = async () => {
    let loadedQuestions = [];
    
    try {
      const res = await questionsAPI.getQuestions('debugrace', 20);
      if (res.data.questions && res.data.questions.length > 0) {
        loadedQuestions = res.data.questions;
      } else {
        loadedQuestions = [].map(q => ({ data: q }));
      }
    } catch (error) {
      console.error('Failed to load questions:', error);
      loadedQuestions = [].map(q => ({ data: q }));
    }

    setQuestions(loadedQuestions);
    setScore(0);
    setTotalAttempts(0);
    setCorrectAttempts(0);
    setStreak(0);
    setCurrentQuestionIndex(0);
    setGameState('playing');
    
    // Load first question if available
    if (loadedQuestions.length > 0) {
      const firstQuestion = loadedQuestions[0];
      const questionData = firstQuestion.data || firstQuestion;
      setCurrentChallenge({ ...questionData, _id: firstQuestion._id });
      setCurrentQuestionIndex(1); // Start at 1 since we loaded index 0
      setQuestionStartTime(Date.now());
    }
  };

  const loadNewChallenge = () => {
    if (questions.length === 0) {
      console.error('No questions available');
      return;
    }
    
    if (currentQuestionIndex >= questions.length) {
      setCurrentQuestionIndex(0);
    }
    
    const question = questions[currentQuestionIndex];
    if (!question) {
      console.error('Question not found at index:', currentQuestionIndex);
      return;
    }
    
    const questionData = question.data || question;
    setCurrentChallenge({ ...questionData, _id: question._id });
    setCurrentQuestionIndex(prev => prev + 1);
    setQuestionStartTime(Date.now());
  };

  const handleAnswer = async (selected) => {
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

    // Submit answer if user is logged in and question is from API
    if (user && currentChallenge._id) {
      try {
        await answersAPI.submit('debugrace', {
          questionId: currentChallenge._id,
          userAnswer: selected,
          sessionId,
          timeSpent: Date.now() - questionStartTime,
          metadata: { streak, isCorrect }
        });
      } catch (error) {
        console.error('Failed to submit answer:', error);
      }
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
        metadata: { sessionId }
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
            {questionCount > 0 && (
              <p className="text-primary text-sm">
                {questionCount} questions available
              </p>
            )}
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





