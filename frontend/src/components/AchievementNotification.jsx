import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import * as LucideIcons from 'lucide-react';

const AchievementNotification = ({ achievements = [] }) => {
    const [queue, setQueue] = useState([]);
    const [current, setCurrent] = useState(null);

    useEffect(() => {
        if (achievements && achievements.length > 0) {
            setQueue(prev => [...prev, ...achievements]);
        }
    }, [achievements]);

    useEffect(() => {
        if (!current && queue.length > 0) {
            const next = queue[0];
            setCurrent(next);
            setQueue(prev => prev.slice(1));

            // Get the icon component dynamically
            const IconComponent = LucideIcons[next.icon] || LucideIcons.Trophy;

            // Show toast notification
            toast.custom((t) => (
                <div
                    className={`${t.visible ? 'animate-enter' : 'animate-leave'
                        } max-w-md w-full bg-gradient-to-r from-yellow-500/20 via-orange-500/20 to-yellow-500/20 border-2 border-yellow-500 shadow-lg rounded-lg pointer-events-auto flex ring-2 ring-yellow-400 ring-offset-2 ring-offset-slate-900`}
                >
                    <div className="flex-1 w-0 p-4">
                        <div className="flex items-start">
                            <div className="flex-shrink-0 pt-0.5">
                                <LucideIcons.Trophy size={32} className="text-yellow-400" strokeWidth={1.5} />
                            </div>
                            <div className="ml-3 flex-1">
                                <p className="text-sm font-bold text-yellow-400 uppercase tracking-wide">
                                    Achievement Unlocked!
                                </p>
                                <div className="flex items-center gap-2 mt-1">
                                    <IconComponent size={24} className="text-white" strokeWidth={1.5} />
                                    <p className="text-base font-bold text-white">{next.name}</p>
                                    <span className="text-sm px-2 py-0.5 bg-yellow-500/30 text-yellow-300 rounded uppercase font-bold">
                                        {next.tier}
                                    </span>
                                </div>
                                <p className="mt-1 text-sm text-gray-300">{next.description}</p>
                                <div className="mt-2 flex items-center gap-2">
                                    <div className="inline-flex items-center gap-1 px-2 py-1 rounded bg-purple-500/30 text-purple-300 text-xs font-semibold">
                                        <LucideIcons.Zap size={12} fill="currentColor" />
                                        <span>+{next.xpReward} XP</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex border-l border-yellow-500/30">
                        <button
                            onClick={() => toast.dismiss(t.id)}
                            className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-yellow-400 hover:text-yellow-300 focus:outline-none"
                        >
                            <LucideIcons.X size={18} />
                        </button>
                    </div>
                </div>
            ), {
                duration: 6000,
                position: 'top-center',
            });

            // Clear current after showing
            setTimeout(() => {
                setCurrent(null);
            }, 6500);
        }
    }, [current, queue]);

    return null; // This component doesn't render anything directly
};

export default AchievementNotification;
