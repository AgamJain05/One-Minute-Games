import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Play } from 'lucide-react';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, horizontalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import { useAuthStore } from '@store/authStore';
import { scoresAPI } from '@services/api';
import { FLEXBOX_CHALLENGES } from './data';
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
    const challenge = FLEXBOX_CHALLENGES[Math.floor(Math.random() * FLEXBOX_CHALLENGES.length)];
    setCurrentChallenge(challenge);
    
    // Shuffle the items
    const shuffled = [...challenge.items].sort(() => Math.random() - 0.5);
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
    
    const isCorrect = JSON.stringify(userOrder) === JSON.stringify(currentChallenge.items);
    
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
        gameId: 'flexbox',
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





