import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Trophy } from 'lucide-react';
import { usersAPI } from '@services/api';

export default function Leaderboard() {
  const { data: leaders, isLoading } = useQuery({
    queryKey: ['leaderboard'],
    queryFn: () => usersAPI.getLeaderboard().then(res => res.data)
  });

  const getRankColor = (rank) => {
    if (rank === 1) return 'text-warning';
    if (rank === 2) return 'text-gray-300';
    if (rank === 3) return 'text-orange-600';
    return 'text-gray-400';
  };

  const getRankIcon = (rank) => {
    if (rank <= 3) return '🏆';
    return rank;
  };

  if (isLoading) {
    return <div className="text-center py-20">Loading leaderboard...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <Trophy className="w-16 h-16 text-warning mx-auto mb-4" />
        <h1 className="text-4xl font-bold mb-2">Global Leaderboard</h1>
        <p className="text-gray-400">Top developers ranked by total XP</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="card space-y-3"
      >
        {leaders?.map((leader, index) => (
          <motion.div
            key={leader._id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className="flex items-center justify-between p-4 bg-dark-bg rounded-lg hover:bg-dark-lighter transition-colors"
          >
            <div className="flex items-center gap-4">
              <div className={`text-2xl font-bold w-12 text-center ${getRankColor(index + 1)}`}>
                {getRankIcon(index + 1)}
              </div>
              <div className="text-4xl">{leader.avatar}</div>
              <div>
                <div className="font-semibold text-lg">{leader.username}</div>
                <div className="text-sm text-gray-400">{leader.gamesPlayed} games played</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-primary">{leader.totalXP}</div>
              <div className="text-sm text-gray-400">Level {leader.level}</div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}





