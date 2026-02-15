import React, { useState, useEffect } from 'react';
import { achievementsAPI } from '../services/api';
import AchievementCard from '../components/AchievementCard';
import toast from 'react-hot-toast';
import { Trophy, Award, Star, Lock } from 'lucide-react';

const Achievements = () => {
    const [loading, setLoading] = useState(true);
    const [earned, setEarned] = useState([]);
    const [locked, setLocked] = useState([]);
    const [stats, setStats] = useState({});
    const [filter, setFilter] = useState('all'); // all, earned, locked, milestone, streak, performance
    const [sortBy, setSortBy] = useState('recent'); // recent, alphabetical, progress

    useEffect(() => {
        fetchAchievements();
    }, []);

    const fetchAchievements = async () => {
        try {
            setLoading(true);
            const response = await achievementsAPI.getUserAchievements();
            setEarned(response.data.earned || []);
            setLocked(response.data.locked || []);
            setStats(response.data.stats || {});
        } catch (error) {
            console.error('Error fetching achievements:', error);
            toast.error('Failed to load achievements');
        } finally {
            setLoading(false);
        }
    };

    // Filter achievements
    const getFilteredAchievements = () => {
        let achievements = [];

        if (filter === 'all') {
            achievements = [...earned, ...locked];
        } else if (filter === 'earned') {
            achievements = earned;
        } else if (filter === 'locked') {
            achievements = locked;
        } else {
            // Filter by category (milestone, streak, performance)
            const earnedFiltered = earned.filter(ach => ach.category === filter);
            const lockedFiltered = locked.filter(ach => ach.category === filter);
            achievements = [...earnedFiltered, ...lockedFiltered];
        }

        // Sort achievements
        if (sortBy === 'recent') {
            achievements.sort((a, b) => {
                if (a.earnedAt && b.earnedAt) {
                    return new Date(b.earnedAt) - new Date(a.earnedAt);
                }
                if (a.earnedAt) return -1;
                if (b.earnedAt) return 1;
                return 0;
            });
        } else if (sortBy === 'alphabetical') {
            achievements.sort((a, b) => a.name.localeCompare(b.name));
        } else if (sortBy === 'progress') {
            achievements.sort((a, b) => {
                const progressA = a.percentage || (a.earnedAt ? 100 : 0);
                const progressB = b.percentage || (b.earnedAt ? 100 : 0);
                return progressB - progressA;
            });
        }

        return achievements;
    };

    const filteredAchievements = getFilteredAchievements();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-cyan-500 mx-auto mb-4"></div>
                    <p className="text-gray-400">Loading achievements...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8 text-center">
                    <h1 className="text-4xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 flex items-center justify-center gap-3">
                        <Trophy size={40} className="text-yellow-400" />
                        Achievements
                    </h1>
                    <p className="text-gray-400 text-lg mb-6">
                        Track your progress and unlock rewards!
                    </p>

                    {/* Stats Summary */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto mb-8">
                        <div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/30 rounded-lg p-4">
                            <div className="flex items-center justify-center gap-2 mb-2">
                                <Award size={24} className="text-cyan-400" />
                                <div className="text-3xl font-bold text-cyan-400">{stats.earnedCount || 0}</div>
                            </div>
                            <div className="text-sm text-gray-400">Unlocked</div>
                        </div>
                        <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-lg p-4">
                            <div className="flex items-center justify-center gap-2 mb-2">
                                <Trophy size={24} className="text-purple-400" />
                                <div className="text-3xl font-bold text-purple-400">{stats.completionPercentage || 0}%</div>
                            </div>
                            <div className="text-sm text-gray-400">Completion</div>
                        </div>
                        <div className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border border-yellow-500/30 rounded-lg p-4">
                            <div className="flex items-center justify-center gap-2 mb-2">
                                <Star size={24} className="text-yellow-400" />
                                <div className="text-3xl font-bold text-yellow-400">{stats.totalAchievements || 0}</div>
                            </div>
                            <div className="text-sm text-gray-400">Total</div>
                        </div>
                    </div>
                </div>

                {/* Filters and Sorting */}
                <div className="mb-6 flex flex-col sm:flex-row gap-4 items-center justify-between">
                    {/* Filter Tabs */}
                    <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                        {['all', 'earned', 'locked', 'milestone', 'streak', 'performance'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setFilter(tab)}
                                className={`
                  px-4 py-2 rounded-lg font-medium text-sm transition-all
                  ${filter === tab
                                        ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/30'
                                        : 'bg-gray-800/50 text-gray-400 hover:bg-gray-700/50 hover:text-white'
                                    }
                `}
                            >
                                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                            </button>
                        ))}
                    </div>

                    {/* Sort Dropdown */}
                    <div className="flex items-center gap-2">
                        <label className="text-sm text-gray-400">Sort by:</label>
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        >
                            <option value="recent">Most Recent</option>
                            <option value="alphabetical">A-Z</option>
                            <option value="progress">Progress</option>
                        </select>
                    </div>
                </div>

                {/* Achievements Grid */}
                {filteredAchievements.length === 0 ? (
                    <div className="text-center py-12">
                        <Lock size={64} className="text-gray-600 mx-auto mb-4" />
                        <p className="text-gray-400 text-lg">No achievements found for this filter</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredAchievements.map((achievement) => (
                            <AchievementCard
                                key={achievement.achievementId}
                                achievement={achievement}
                                isEarned={!!achievement.earnedAt}
                                progress={achievement.current !== undefined ? {
                                    current: achievement.current,
                                    target: achievement.target,
                                    percentage: achievement.percentage
                                } : null}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Achievements;
