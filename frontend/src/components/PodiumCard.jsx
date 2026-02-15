import React from 'react';
import { Trophy, Medal, Crown, Award } from 'lucide-react';

const PodiumCard = ({ player, position }) => {
    const getPodiumStyles = () => {
        switch (position) {
            case 1:
                return {
                    height: 'h-72',
                    bg: 'from-yellow-400/20 to-yellow-600/20',
                    border: 'border-yellow-500/50',
                    text: 'text-yellow-400',
                    glow: 'shadow-lg shadow-yellow-500/30',
                    icon: <Crown size={64} className="text-yellow-400" strokeWidth={1.5} />,
                    medal: '🥇',
                    order: 'order-2'
                };
            case 2:
                return {
                    height: 'h-64',
                    bg: 'from-gray-400/20 to-gray-600/20',
                    border: 'border-gray-400/50',
                    text: 'text-gray-300',
                    glow: 'shadow-lg shadow-gray-400/20',
                    icon: <Medal size={56} className="text-gray-300" strokeWidth={1.5} />,
                    medal: '🥈',
                    order: 'order-1'
                };
            case 3:
                return {
                    height: 'h-56',
                    bg: 'from-amber-700/20 to-amber-900/20',
                    border: 'border-amber-700/50',
                    text: 'text-amber-400',
                    glow: 'shadow-lg shadow-amber-700/20',
                    icon: <Medal size={48} className="text-amber-400" strokeWidth={1.5} />,
                    medal: '🥉',
                    order: 'order-3'
                };
            default:
                return {};
        }
    };

    const styles = getPodiumStyles();

    return (
        <div className={`flex flex-col items-center ${styles.order}`}>
            {/* Player Card */}
            <div className={`
        relative w-full max-w-xs rounded-xl border backdrop-blur-sm p-6
        bg-gradient-to-br ${styles.bg} ${styles.border} ${styles.glow}
        transition-all duration-300 hover:scale-105
      `}>
                {/* Position Badge */}
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <div className={`
            text-4xl font-black px-4 py-1 rounded-full
            bg-gray-900 border-2 ${styles.border} ${styles.text}
          `}>
                        {position}
                    </div>
                </div>

                {/* Icon */}
                <div className="flex justify-center mt-4 mb-4">
                    {styles.icon}
                </div>

                {/* Avatar/Username */}
                <div className="text-center mb-3">
                    <div className="text-4xl mb-2">{player.avatar || '👤'}</div>
                    <h3 className="text-xl font-bold text-white truncate px-2">
                        {player.username}
                    </h3>
                </div>

                {/* Score/XP */}
                <div className="text-center mb-3">
                    <div className={`text-3xl font-black ${styles.text}`}>
                        {player.score || player.totalXP}
                    </div>
                    <div className="text-sm text-gray-400">
                        {player.score ? 'Score' : 'Total XP'}
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-2 text-center text-sm">
                    {player.level && (
                        <div className="bg-gray-900/50 rounded-lg p-2">
                            <div className="text-xs text-gray-400">Level</div>
                            <div className="font-bold text-white">{player.level}</div>
                        </div>
                    )}
                    {player.achievementCount !== undefined && (
                        <div className="bg-gray-900/50 rounded-lg p-2">
                            <div className="text-xs text-gray-400 flex items-center justify-center gap-1">
                                <Award size={12} />
                                <span>Achievements</span>
                            </div>
                            <div className="font-bold text-white">{player.achievementCount}</div>
                        </div>
                    )}
                </div>
            </div>

            {/* Podium Base */}
            <div className={`
        w-full max-w-xs ${styles.height} mt-4
        bg-gradient-to-br ${styles.bg} ${styles.border}
        border-2 rounded-t-xl
        flex items-center justify-center text-6xl
        transition-all duration-300
      `}>
                {styles.medal}
            </div>
        </div>
    );
};

export default PodiumCard;
