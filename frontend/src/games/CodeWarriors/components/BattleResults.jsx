import { motion } from 'framer-motion';
import { Trophy } from 'lucide-react';

export default function BattleResults({ winner, rounds, onPlayAgain, onGoHome }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="card text-center space-y-6 py-12"
    >
      <Trophy className="w-24 h-24 text-warning mx-auto" />
      <h2 className="text-4xl font-bold text-success">{winner} Wins!</h2>
      <p className="text-xl text-gray-400">Battle lasted {rounds} rounds</p>
      
      <div className="flex gap-4 justify-center pt-4">
        <button onClick={onPlayAgain} className="btn-primary">
          ⚔️ Battle Again
        </button>
        <button onClick={onGoHome} className="btn-secondary">
          Home
        </button>
      </div>
    </motion.div>
  );
}





