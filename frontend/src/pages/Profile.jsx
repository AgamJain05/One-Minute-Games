import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Trophy, Zap, Target, TrendingUp } from 'lucide-react';
import { usersAPI } from '@services/api';
import { useAuthStore } from '@store/authStore';

export default function Profile() {
  const { user } = useAuthStore();
  
  const { data, isLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: () => usersAPI.getProfile().then(res => res.data)
  });

  if (isLoading) {
    return <div className="text-center py-20">Loading profile...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card text-center"
      >
        <div className="text-6xl mb-4">{user.avatar}</div>
        <h1 className="text-3xl font-bold mb-2">{user.username}</h1>
        <p className="text-gray-400">{user.email}</p>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
          <div className="card">
            <Trophy className="w-8 h-8 text-warning mx-auto mb-2" />
            <div className="text-2xl font-bold">{user.level}</div>
            <div className="text-sm text-gray-400">Level</div>
          </div>
          <div className="card">
            <Zap className="w-8 h-8 text-success mx-auto mb-2" />
            <div className="text-2xl font-bold">{user.totalXP || 0}</div>
            <div className="text-sm text-gray-400">Total XP</div>
          </div>
          <div className="card">
            <Target className="w-8 h-8 text-primary mx-auto mb-2" />
            <div className="text-2xl font-bold">{user.gamesPlayed || 0}</div>
            <div className="text-sm text-gray-400">Games Played</div>
          </div>
          <div className="card">
            <TrendingUp className="w-8 h-8 text-danger mx-auto mb-2" />
            <div className="text-2xl font-bold">{user.currentStreak || 0}</div>
            <div className="text-sm text-gray-400">Day Streak</div>
          </div>
        </div>
      </motion.div>

      {data?.gameStats && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="card"
        >
          <h2 className="text-2xl font-bold mb-6">Game Statistics</h2>
          <div className="space-y-4">
            {Object.entries(data.gameStats).map(([gameId, stats]) => (
              <div key={gameId} className="flex justify-between items-center p-4 bg-dark-bg rounded-lg">
                <div>
                  <div className="font-semibold">{gameId}</div>
                  <div className="text-sm text-gray-400">Played {stats.played} times</div>
                </div>
                <div className="text-right">
                  <div className="text-primary font-bold">{stats.bestScore}</div>
                  <div className="text-sm text-gray-400">Best Score</div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}





