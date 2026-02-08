import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Play, XCircle } from 'lucide-react';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import toast from 'react-hot-toast';
import { useAuthStore } from '@store/authStore';
import { scoresAPI, questionsAPI, answersAPI } from '@services/api';
import Timer from '../CodeType/components/Timer';
import SortableItem from './components/SortableItem';
import Results from '../SqlBuilder/components/Results';

export default function CodeBlocks() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  
  const [gameState, setGameState] = useState('idle');
  const [currentProblem, setCurrentProblem] = useState(null);
  const [userOrder, setUserOrder] = useState([]);
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [totalAttempts, setTotalAttempts] = useState(0);
  const [questionCount, setQuestionCount] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [sessionId] = useState(() => crypto.randomUUID());
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());
  const [showIncorrect, setShowIncorrect] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  // Fetch question count on mount
  useEffect(() => {
    const fetchCount = async () => {
      try {
        const res = await questionsAPI.getCount('codeblocks');
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
      const res = await questionsAPI.getQuestions('codeblocks', 20);
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
    setCorrectCount(0);
    setTotalAttempts(0);
    setCurrentQuestionIndex(0);
    setGameState('playing');
    
    // Load first question if available
    if (loadedQuestions.length > 0) {
      const firstQuestion = loadedQuestions[0];
      const questionData = firstQuestion.data || firstQuestion;
      setCurrentProblem({ ...questionData, _id: firstQuestion._id });
      
      // Shuffle the blocks
      const shuffled = [...questionData.blocks].sort(() => Math.random() - 0.5);
      setUserOrder(shuffled);
      setCurrentQuestionIndex(1); // Start at 1 since we loaded index 0
      setQuestionStartTime(Date.now());
    }
  };

  const loadNewProblem = () => {
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
    setCurrentProblem({ ...questionData, _id: question._id });
    
    // Shuffle the blocks
    const shuffled = [...questionData.blocks].sort(() => Math.random() - 0.5);
    setUserOrder(shuffled);
    setCurrentQuestionIndex(prev => prev + 1);
    setQuestionStartTime(Date.now());
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    
    if (active.id !== over.id) {
      setUserOrder((items) => {
        const oldIndex = items.indexOf(active.id);
        const newIndex = items.indexOf(over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const checkAnswer = async () => {
    setTotalAttempts(prev => prev + 1);
    
    const isCorrect = JSON.stringify(userOrder) === JSON.stringify(currentProblem.blocks);
    
    if (isCorrect) {
      setScore(prev => prev + 15);
      setCorrectCount(prev => prev + 1);
      toast.success('Correct! Well done! 🎉', {
        duration: 2000,
        style: {
          background: '#10b981',
          color: '#fff',
        },
      });
    } else {
      // Show incorrect feedback
      setShowIncorrect(true);
      toast.error('Incorrect! Try arranging the blocks again.', {
        duration: 3000,
        icon: '❌',
        style: {
          background: '#ef4444',
          color: '#fff',
        },
      });
      
      // Remove red outline after animation
      setTimeout(() => {
        setShowIncorrect(false);
      }, 1000);
    }

    // Submit answer if user is logged in and question has ID
    if (user && currentProblem._id) {
      try {
        await answersAPI.submit('codeblocks', {
          questionId: currentProblem._id,
          userAnswer: JSON.stringify(userOrder),
          sessionId,
          timeSpent: Date.now() - questionStartTime,
          metadata: { isCorrect, expectedOrder: currentProblem.blocks }
        });
      } catch (error) {
        console.error('Failed to submit answer:', error);
      }
    }
    
    if (isCorrect) {
      setTimeout(loadNewProblem, 1000);
    }
  };

  const endGame = () => {
    const accuracy = totalAttempts > 0 
      ? Math.round((correctCount / totalAttempts) * 100) 
      : 0;

    setGameState('finished');

    if (user) {
      scoresAPI.submit({
        gameId: 'codeblocks',
        score,
        accuracy,
        correctAnswers: correctCount,
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
        <h1 className="text-4xl font-bold mb-2">🧩 Code Block Arranger</h1>
        <p className="text-gray-400">Drag code blocks into the correct order</p>
      </motion.div>

      <div className="card space-y-6">
        {gameState === 'idle' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center space-y-6 py-12"
          >
            <div className="text-6xl mb-4">🧩</div>
            <h2 className="text-2xl font-semibold">Ready to arrange code?</h2>
            <p className="text-gray-400 max-w-md mx-auto">
              Arrange code blocks in the correct order to create valid programs.
              Drag and drop to reorder!
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

        {gameState === 'playing' && currentProblem && (
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
              <h3 className="text-lg font-semibold mb-2">Task:</h3>
              <p className="text-gray-300">{currentProblem.description}</p>
            </div>

            <div className="space-y-2">
              <p className="text-sm text-gray-400 text-center">Drag to reorder the code blocks:</p>
              
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={userOrder}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="space-y-2">
                    {userOrder.map((block) => (
                      <SortableItem key={block} id={block} block={block} />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            </div>

            <motion.button
              onClick={checkAnswer}
              className={`btn-primary w-full transition-all duration-300 ${
                showIncorrect 
                  ? 'ring-4 ring-red-500 bg-red-600 hover:bg-red-700' 
                  : ''
              }`}
              animate={showIncorrect ? {
                x: [0, -10, 10, -10, 10, 0],
                transition: { duration: 0.5 }
              } : {}}
            >
              {showIncorrect ? (
                <span className="flex items-center justify-center gap-2">
                  <XCircle className="w-5 h-5" />
                  Incorrect - Try Again
                </span>
              ) : (
                'Check Answer'
              )}
            </motion.button>
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





