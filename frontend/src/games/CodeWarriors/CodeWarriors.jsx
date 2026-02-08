import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { useAuthStore } from '@store/authStore';
import { scoresAPI, questionsAPI } from '@services/api';
import CharacterSelect from './components/CharacterSelect';
import BattleArena from './components/BattleArena';
import BattleResults from './components/BattleResults';

export default function CodeWarriors() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  
  const [gameState, setGameState] = useState('select'); // select, battle, finished
  const [players, setPlayers] = useState({ player1: null, player2: null });
  const [battleState, setBattleState] = useState(null);
  const [questions, setQuestions] = useState({ algorithm: [], database: [], frontend: [] });
  const [questionCount, setQuestionCount] = useState(0);
  const [sessionId] = useState(() => crypto.randomUUID());

  // Fetch questions on mount
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await questionsAPI.getQuestions('codewarriors', 100);
        if (res.data.questions && res.data.questions.length > 0) {
          // Organize questions by characterType from metadata
          const organized = {
            algorithm: [],
            database: [],
            frontend: []
          };
          
          res.data.questions.forEach(q => {
            const questionData = q.data || q;
            const charType = questionData.characterType || questionData.category || 'algorithm';
            if (organized[charType]) {
              organized[charType].push({
                ...questionData,
                _id: q._id
              });
            }
          });
          
          // Only use API questions if we have questions for all character types
          if (organized.algorithm.length > 0 || organized.database.length > 0 || organized.frontend.length > 0) {
            // Merge with local fallback for missing character types
            setQuestions({
              algorithm: organized.algorithm.length > 0 ? organized.algorithm : [],
              database: organized.database.length > 0 ? organized.database : [],
              frontend: organized.frontend.length > 0 ? organized.frontend : []
            });
          }
        }
      } catch (error) {
        console.error('Failed to load questions:', error);
      }
    };
    
    const fetchCount = async () => {
      try {
        const res = await questionsAPI.getCount('codewarriors');
        setQuestionCount(res.data.count);
      } catch (error) {
        console.error('Failed to fetch question count:', error);
      }
    };
    
    fetchQuestions();
    fetchCount();
  }, []);

  const selectCharacter = (player, character) => {
    setPlayers(prev => ({ ...prev, [player]: character }));
  };

  const startBattle = () => {
    if (!players.player1 || !players.player2) return;
    
    setBattleState({
      player1: { ...players.player1, health: 100, mana: 100 },
      player2: { ...players.player2, health: 100, mana: 100 },
      currentTurn: 'player1',
      round: 1,
      log: []
    });
    setGameState('battle');
  };

  const endBattle = (winner) => {
    setGameState('finished');
    
    if (user) {
      scoresAPI.submit({
        gameId: 'codewarriors',
        score: winner === 'player1' ? 100 : 50,
        metadata: { winner, rounds: battleState.round, sessionId }
      }).catch(err => console.error('Failed to submit score:', err));
    }
  };

  const resetGame = () => {
    setPlayers({ player1: null, player2: null });
    setBattleState(null);
    setGameState('select');
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft size={20} />
          Back to Home
        </button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-5xl font-bold mb-2">⚔️ Code Warriors</h1>
        <p className="text-gray-400">Epic 2-player coding battle arena!</p>
      </motion.div>

      {gameState === 'select' && (
        <CharacterSelect
          characters={[]}
          players={players}
          onSelect={selectCharacter}
          onStart={startBattle}
        />
      )}

      {gameState === 'battle' && battleState && (
        <BattleArena
          battleState={battleState}
          setBattleState={setBattleState}
          questions={questions}
          onEnd={endBattle}
          user={user}
          sessionId={sessionId}
        />
      )}

      {gameState === 'finished' && battleState && (
        <BattleResults
          winner={battleState.player1.health > 0 ? 'Player 1' : 'Player 2'}
          rounds={battleState.round}
          onPlayAgain={resetGame}
          onGoHome={() => navigate('/')}
        />
      )}
    </div>
  );
}





