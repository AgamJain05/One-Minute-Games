import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Play, TrendingUp } from 'lucide-react';
import { useAuthStore } from '@store/authStore';
import { scoresAPI, questionsAPI, answersAPI } from '@services/api';
import Timer from '../CodeType/components/Timer';
import Results from '../OutputPredictor/components/Results';

export default function BigOChallenge() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  
  const [gameState, setGameState] = useState('idle');
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [score, setScore] = useState(0);
  const [totalAttempts, setTotalAttempts] = useState(0);
  const [correctAttempts, setCorrectAttempts] = useState(0);
  const [usedQuestions, setUsedQuestions] = useState([]);
  const [questionCount, setQuestionCount] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [sessionId] = useState(() => crypto.randomUUID());
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());

  // Fetch question count on mount
  useEffect(() => {
    const fetchCount = async () => {
      try {
        const res = await questionsAPI.getCount('bigochallenge');
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
      const res = await questionsAPI.getQuestions('bigochallenge', 20);
      if (res.data.questions && res.data.questions.length > 0) {
        loadedQuestions = res.data.questions;
      } else {
        loadedQuestions = [];
      }
    } catch (error) {
      console.error('Failed to load questions:', error);
      loadedQuestions = [];
    }

    setQuestions(loadedQuestions);
    setScore(0);
    setTotalAttempts(0);
    setCorrectAttempts(0);
    setUsedQuestions([]);
    setCurrentQuestionIndex(0);
    setGameState('playing');
    
    // Load first question if available
    if (loadedQuestions.length > 0) {
      const firstQuestion = loadedQuestions[0];
      const questionData = firstQuestion.data || firstQuestion;
      setCurrentQuestion({ ...questionData, _id: firstQuestion._id });
      setCurrentQuestionIndex(1);
      setQuestionStartTime(Date.now());
    }
  };

  const loadNewQuestion = () => {
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
    
    setCurrentQuestion({ ...questionData, _id: question._id });
    setCurrentQuestionIndex(prev => prev + 1);
    setQuestionStartTime(Date.now());
  };

  const handleAnswer = async (selectedAnswer) => {
    setTotalAttempts(prev => prev + 1);
    
    const isCorrect = selectedAnswer === currentQuestion.answer;
    
    if (isCorrect) {
      setScore(prev => prev + 15);
      setCorrectAttempts(prev => prev + 1);
    }

    // Submit answer if user is logged in and question is from API
    if (user && currentQuestion._id) {
      try {
        await answersAPI.submit('bigochallenge', {
          questionId: currentQuestion._id,
          userAnswer: selectedAnswer,
          sessionId,
          timeSpent: Date.now() - questionStartTime,
          metadata: { isCorrect }
        });
      } catch (error) {
        console.error('Failed to submit answer:', error);
      }
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
        gameId: 'bigochallenge',
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
        <h1 className="text-4xl font-bold mb-2">📊 Big-O Challenge</h1>
        <p className="text-gray-400">Identify the time complexity of algorithms</p>
      </motion.div>

      <div className="card space-y-6">
        {gameState === 'idle' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center space-y-6 py-12"
          >
            <TrendingUp className="w-24 h-24 text-primary mx-auto" />
            <h2 className="text-2xl font-semibold">Ready to analyze complexity?</h2>
            <p className="text-gray-400 max-w-md mx-auto">
              Test your algorithm analysis skills! Identify the Big-O time complexity.
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

        {gameState === 'playing' && currentQuestion && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            <div className="text-xl font-bold text-primary">Score: {score}</div>

            <div className="bg-dark-bg border-2 border-gray-700 rounded-lg p-6">
              <pre className="text-cyan-300 font-mono text-sm leading-relaxed overflow-x-auto">
                {currentQuestion.code}
              </pre>
            </div>

            <div className="text-center text-sm text-gray-400 mb-2">
              What is the time complexity of this algorithm?
            </div>

            <div className="grid grid-cols-2 gap-3">
              {currentQuestion.options.map((option, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleAnswer(option)}
                  className="bg-dark-bg hover:bg-gray-800 border-2 border-gray-700 hover:border-primary rounded-lg p-4 transition-all group"
                >
                  <code className="text-2xl text-warning font-mono group-hover:text-primary transition-colors">
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





