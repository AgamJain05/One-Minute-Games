import { motion } from 'framer-motion';
import { Trophy, Target, CheckCircle } from 'lucide-react';

export default function Results({ score, correct, total, accuracy, onPlayAgain, onGoHome }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center space-y-6 py-6"
    >
      <div className="text-6xl mb-4">🎉</div>
      <h2 className="text-3xl font-bold text-success">Challenge Complete!</h2>

      <div className="grid grid-cols-3 gap-4">
        <div className="card">
          <Trophy className="w-8 h-8 text-warning mx-auto mb-2" />
          <div className="text-3xl font-bold text-primary">{score}</div>
          <div className="text-sm text-gray-400">Score</div>
        </div>
        <div className="card">
          <CheckCircle className="w-8 h-8 text-success mx-auto mb-2" />
          <div className="text-3xl font-bold text-success">{correct}</div>
          <div className="text-sm text-gray-400">Correct</div>
        </div>
        <div className="card">
          <Target className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
          <div className="text-3xl font-bold text-cyan-400">{accuracy}%</div>
          <div className="text-sm text-gray-400">Accuracy</div>
        </div>
      </div>

      <div className="flex gap-4 justify-center pt-4">
        <button onClick={onPlayAgain} className="btn-primary">
          Play Again
        </button>
        <button onClick={onGoHome} className="btn-secondary">
          Home
        </button>
      </div>
    </motion.div>
  );
}





