import React from 'react';
import * as LucideIcons from 'lucide-react';

const tierColors = {
    bronze: {
        bg: 'from-amber-700/20 to-amber-900/20',
        border: 'border-amber-700/50',
        text: 'text-amber-400',
        glow: 'shadow-amber-500/20'
    },
    silver: {
        bg: 'from-gray-400/20 to-gray-600/20',
        border: 'border-gray-400/50',
        text: 'text-gray-300',
        glow: 'shadow-gray-400/20'
    },
    gold: {
        bg: 'from-yellow-400/20 to-yellow-600/20',
        border: 'border-yellow-500/50',
        text: 'text-yellow-400',
        glow: 'shadow-yellow-500/20'
    },
    platinum: {
        bg: 'from-cyan-400/20 to-blue-500/20',
        border: 'border-cyan-400/50',
        text: 'text-cyan-300',
        glow: 'shadow-cyan-400/20'
    }
};

const AchievementCard = ({ achievement, isEarned, progress, isNew }) => {
    const tier = achievement.tier || 'bronze';
    const colors = tierColors[tier];

    // Get the icon component dynamically
    const IconComponent = LucideIcons[achievement.icon] || LucideIcons.Trophy;

    return (
        <div
            className={`
        relative overflow-hidden rounded-xl border backdrop-blur-sm
        transition-all duration-300 hover:scale-105 hover:shadow-xl
        ${isEarned ? `bg-gradient-to-br ${colors.bg} ${colors.border} ${colors.glow}` : 'bg-gray-900/40 border-gray-700/50 grayscale opacity-60'}
        ${isNew ? 'ring-2 ring-yellow-400 ring-offset-2 ring-offset-slate-900 animate-pulse' : ''}
      `}
        >
            {/* New badge */}
            {isNew && (
                <div className="absolute top-2 right-2 bg-yellow-400 text-gray-900 text-xs font-bold px-2 py-1 rounded-full">
                    NEW!
                </div>
            )}

            <div className="p-6">
                {/* Icon */}
                <div className="flex justify-center mb-4">
                    <IconComponent
                        size={48}
                        className={isEarned ? colors.text : 'text-gray-500'}
                        strokeWidth={1.5}
                    />
                </div>

                {/* Tier badge */}
                <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold mb-3 ${colors.text} bg-gray-900/50`}>
                    {tier === 'bronze' && <LucideIcons.Medal size={12} />}
                    {tier === 'silver' && <LucideIcons.Medal size={12} />}
                    {tier === 'gold' && <LucideIcons.Medal size={12} />}
                    {tier === 'platinum' && <LucideIcons.Gem size={12} />}
                    <span className="uppercase">{tier}</span>
                </div>

                {/* Name */}
                <h3 className={`text-lg font-bold mb-2 ${isEarned ? 'text-white' : 'text-gray-400'}`}>
                    {achievement.name}
                </h3>

                {/* Description */}
                <p className={`text-sm mb-3 ${isEarned ? 'text-gray-300' : 'text-gray-500'}`}>
                    {achievement.description}
                </p>

                {/* XP Reward */}
                <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-lg text-sm font-semibold ${isEarned ? 'bg-purple-500/20 text-purple-300' : 'bg-gray-800/50 text-gray-500'}`}>
                    <LucideIcons.Zap size={14} fill="currentColor" />
                    <span>{achievement.xpReward} XP</span>
                </div>

                {/* Progress bar (for locked achievements with trackable progress) */}
                {!isEarned && progress && (
                    <div className="mt-4">
                        <div className="flex justify-between text-xs text-gray-400 mb-1">
                            <span>Progress</span>
                            <span>{progress.current} / {progress.target}</span>
                        </div>
                        <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-300"
                                style={{ width: `${progress.percentage}%` }}
                            />
                        </div>
                        <div className="text-xs text-gray-500 mt-1 text-center">
                            {progress.percentage}% Complete
                        </div>
                    </div>
                )}

                {/* Earned date */}
                {isEarned && achievement.earnedAt && (
                    <div className="mt-4 pt-4 border-t border-gray-700/50">
                        <p className="text-xs text-gray-400">
                            Earned on {new Date(achievement.earnedAt).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric'
                            })}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AchievementCard;
