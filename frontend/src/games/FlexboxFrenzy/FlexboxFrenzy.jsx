import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Play } from 'lucide-react';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, horizontalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import { useAuthStore } from '@store/authStore';
import { scoresAPI, questionsAPI, answersAPI } from '@services/api';
import Timer from '../CodeType/components/Timer';
import SortableItem from './components/SortableItem';
import Results from '../SqlBuilder/components/Results';

export default function FlexboxFrenzy() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  
  const [gameState, setGameState] = useState('idle');
  const [currentChallenge, setCurrentChallenge] = useState(null);
  const [userOrder, setUserOrder] = useState([]);
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [totalAttempts, setTotalAttempts] = useState(0);
  const [questionCount, setQuestionCount] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [sessionId] = useState(() => crypto.randomUUID());
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());

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
        const res = await questionsAPI.getCount('flexbox');
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
      const res = await questionsAPI.getQuestions('flexbox', 20);
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
      setCurrentChallenge({ ...questionData, _id: firstQuestion._id });
      
      // Shuffle the items
      const shuffled = [...questionData.items].sort(() => Math.random() - 0.5);
      setUserOrder(shuffled);
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
    
    // Shuffle the items
    const shuffled = [...questionData.items].sort(() => Math.random() - 0.5);
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
    
    const isCorrect = JSON.stringify(userOrder) === JSON.stringify(currentChallenge.items);
    
    if (isCorrect) {
      setScore(prev => prev + 15);
      setCorrectCount(prev => prev + 1);
    }

    // Submit answer if user is logged in and question has ID
    if (user && currentChallenge._id) {
      try {
        await answersAPI.submit('flexbox', {
          questionId: currentChallenge._id,
          userAnswer: JSON.stringify(userOrder),
          sessionId,
          timeSpent: Date.now() - questionStartTime,
          metadata: { isCorrect, expectedOrder: currentChallenge.items }
        });
      } catch (error) {
        console.error('Failed to submit answer:', error);
      }
    }
    
    if (isCorrect) {
      setTimeout(loadNewChallenge, 1000);
    }
  };

  const endGame = () => {
    const accuracy = totalAttempts > 0 
      ? Math.round((correctCount / totalAttempts) * 100) 
      : 0;

    setGameState('finished');

    if (user) {
      scoresAPI.submit({
        gameId: 'flexbox',
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
        <h1 className="text-4xl font-bold mb-2">📐 Flexbox Frenzy</h1>
        <p className="text-gray-400">Arrange elements using Flexbox layout</p>
      </motion.div>

      <div className="card space-y-6">
        {gameState === 'idle' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center space-y-6 py-12"
          >
            <div className="text-6xl mb-4">📐</div>
            <h2 className="text-2xl font-semibold">Ready to master Flexbox?</h2>
            <p className="text-gray-400 max-w-md mx-auto">
              Arrange items in the correct order using Flexbox properties.
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
              <h3 className="text-lg font-semibold mb-2">Layout Goal:</h3>
              <p className="text-gray-300">{currentChallenge.description}</p>
            </div>

            <div className="space-y-2">
              <p className="text-sm text-gray-400 text-center">Drag to arrange items:</p>
              
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={userOrder}
                  strategy={horizontalListSortingStrategy}
                >
                  <div className="flex gap-2 p-4 bg-dark-bg rounded-lg border-2 border-gray-700">
                    {userOrder.map((item) => (
                      <SortableItem key={item} id={item} item={item} />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            </div>

            <button
              onClick={checkAnswer}
              className="btn-primary w-full"
            >
              Check Answer
            </button>
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





