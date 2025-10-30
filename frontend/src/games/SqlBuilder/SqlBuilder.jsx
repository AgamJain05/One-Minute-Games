import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Play } from 'lucide-react';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import { useAuthStore } from '@store/authStore';
import { scoresAPI } from '@services/api';
import { SQL_CHALLENGES } from './data';
import Timer from '../CodeType/components/Timer';
import SortableItem from './components/SortableItem';
import Results from './components/Results';

export default function SqlBuilder() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  
  const [gameState, setGameState] = useState('idle');
  const [currentChallenge, setCurrentChallenge] = useState(null);
  const [userOrder, setUserOrder] = useState([]);
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [totalAttempts, setTotalAttempts] = useState(0);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const startGame = () => {
    setScore(0);
    setCorrectCount(0);
    setTotalAttempts(0);
    setGameState('playing');
    loadNewChallenge();
  };

  const loadNewChallenge = () => {
    const challenge = SQL_CHALLENGES[Math.floor(Math.random() * SQL_CHALLENGES.length)];
    setCurrentChallenge(challenge);
    
    // Shuffle the clauses
    const shuffled = [...challenge.clauses].sort(() => Math.random() - 0.5);
    setUserOrder(shuffled);
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

  const checkAnswer = () => {
    setTotalAttempts(prev => prev + 1);
    
    const isCorrect = JSON.stringify(userOrder) === JSON.stringify(currentChallenge.clauses);
    
    if (isCorrect) {
      setScore(prev => prev + 15);
      setCorrectCount(prev => prev + 1);
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
        gameId: 'sqlbuilder',
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
        <h1 className="text-4xl font-bold mb-2">🗃️ SQL Query Builder</h1>
        <p className="text-gray-400">Drag and drop SQL clauses in the correct order</p>
      </motion.div>

      <div className="card space-y-6">
        {gameState === 'idle' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center space-y-6 py-12"
          >
            <div className="text-6xl mb-4">🗃️</div>
            <h2 className="text-2xl font-semibold">Ready to build SQL queries?</h2>
            <p className="text-gray-400 max-w-md mx-auto">
              Arrange SQL clauses in the correct order to build valid queries.
              Drag and drop to reorder!
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
              <h3 className="text-lg font-semibold mb-2">Challenge:</h3>
              <p className="text-gray-300">{currentChallenge.description}</p>
            </div>

            <div className="space-y-2">
              <p className="text-sm text-gray-400 text-center">Drag to reorder the SQL clauses:</p>
              
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
                    {userOrder.map((clause) => (
                      <SortableItem key={clause} id={clause} clause={clause} />
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





