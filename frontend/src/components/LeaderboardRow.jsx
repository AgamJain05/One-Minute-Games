import React from 'react';
import { Trophy, Award } from 'lucide-react';

const LeaderboardRow = ({ player, rank }) => {
    const showTrophy = rank >= 4 && rank <= 10;

    return (
        <div className="
      flex items-center justify-between p-4 
      bg-gray-900/40 hover:bg-gray-800/60 
      border border-gray-700/50 rounded-lg
      transition-all duration-200 hover:scale-[1.02]
      hover:shadow-lg hover:shadow-cyan-500/10
    ">
            <div className="flex items-center gap-4 flex-1">
                {/* Rank */}
                <div className="flex items-center justify-center w-12">
                    {showTrophy ? (
                        <Trophy size={24} className="text-cyan-400/70" strokeWidth={1.5} />
                    ) : (
                        <div className="text-xl font-bold text-gray-400 min-w-[2ch] text-center">
                            {rank}
                        </div>
                    )}
                </div>

                {/* Avatar */}
                <div className="text-3xl">
                    {player.avatar || '👤'}
                </div>

                {/* User Info */}
                <div className="flex-1 min-w-0">
                    <div className="font-semibold text-white truncate">
                        {player.username}
                    </div>
                    {player.level && (
                        <div className="text-sm text-gray-400">
                            Level {player.level}
                        </div>
                    )}
                </div>
            </div>

            {/* Right Side - Score & Achievements */}
            <div className="flex items-center gap-6">
                {/* Achievement Badge */}
                {player.achievementCount !== undefined && player.achievementCount > 0 && (
                    <div className="hidden sm:flex items-center gap-1 px-2 py-1 rounded-lg bg-purple-500/20 text-purple-300">
                        <Award size={14} />
                        <span className="text-sm font-semibold">{player.achievementCount}</span>
                    </div>
                )}

                {/* Score/XP */}
                <div className="text-right">
                    <div className="text-2xl font-bold text-cyan-400">
                        {(player.score || player.totalXP)?.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-400">
                        {player.score ? 'Score' : 'XP'}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LeaderboardRow;
