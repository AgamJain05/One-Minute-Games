import User from '../models/User.js';
import Score from '../models/Score.js';

// Achievement Definitions (23 total achievements)
export const ACHIEVEMENT_DEFINITIONS = [
    // ========== MILESTONE ACHIEVEMENTS ==========
    {
        achievementId: 'first_steps',
        name: 'First Steps',
        description: 'Play your first game',
        icon: 'Gamepad2',
        category: 'milestone',
        tier: 'bronze',
        xpReward: 50,
        requirements: { type: 'gamesPlayed', count: 1 }
    },
    {
        achievementId: 'game_explorer',
        name: 'Game Explorer',
        description: 'Play 10 different games',
        icon: 'Compass',
        category: 'milestone',
        tier: 'silver',
        xpReward: 100,
        requirements: { type: 'uniqueGames', count: 10 }
    },
    {
        achievementId: 'ultimate_explorer',
        name: 'Ultimate Explorer',
        description: 'Play all 19 games at least once',
        icon: 'Globe',
        category: 'milestone',
        tier: 'gold',
        xpReward: 250,
        requirements: { type: 'uniqueGames', count: 19 }
    },
    {
        achievementId: 'rising_star',
        name: 'Rising Star',
        description: 'Reach level 10',
        icon: 'Rocket',
        category: 'milestone',
        tier: 'bronze',
        xpReward: 100,
        requirements: { type: 'level', level: 10 }
    },
    {
        achievementId: 'elite_player',
        name: 'Elite Player',
        description: 'Reach level 25',
        icon: 'Sparkles',
        category: 'milestone',
        tier: 'silver',
        xpReward: 250,
        requirements: { type: 'level', level: 25 }
    },
    {
        achievementId: 'legendary',
        name: 'Legendary',
        description: 'Reach level 50',
        icon: 'Crown',
        category: 'milestone',
        tier: 'gold',
        xpReward: 500,
        requirements: { type: 'level', level: 50 }
    },
    {
        achievementId: 'xp_collector',
        name: 'XP Collector',
        description: 'Earn 1,000 total XP',
        icon: 'Coins',
        category: 'milestone',
        tier: 'bronze',
        xpReward: 50,
        requirements: { type: 'totalXP', xp: 1000 }
    },
    {
        achievementId: 'xp_master',
        name: 'XP Master',
        description: 'Earn 5,000 total XP',
        icon: 'Gem',
        category: 'milestone',
        tier: 'silver',
        xpReward: 150,
        requirements: { type: 'totalXP', xp: 5000 }
    },
    {
        achievementId: 'xp_god',
        name: 'XP God',
        description: 'Earn 10,000 total XP',
        icon: 'Trophy',
        category: 'milestone',
        tier: 'gold',
        xpReward: 300,
        requirements: { type: 'totalXP', xp: 10000 }
    },
    {
        achievementId: 'casual_gamer',
        name: 'Casual Gamer',
        description: 'Play 100 games',
        icon: 'Dices',
        category: 'milestone',
        tier: 'bronze',
        xpReward: 100,
        requirements: { type: 'gamesPlayed', count: 100 }
    },
    {
        achievementId: 'dedicated_player',
        name: 'Dedicated Player',
        description: 'Play 500 games',
        icon: 'Gamepad',
        category: 'milestone',
        tier: 'silver',
        xpReward: 250,
        requirements: { type: 'gamesPlayed', count: 500 }
    },
    {
        achievementId: 'gaming_legend',
        name: 'Gaming Legend',
        description: 'Play 1,000 games',
        icon: 'Swords',
        category: 'milestone',
        tier: 'gold',
        xpReward: 500,
        requirements: { type: 'gamesPlayed', count: 1000 }
    },

    // ========== STREAK ACHIEVEMENTS ==========
    {
        achievementId: 'getting_started',
        name: 'Getting Started',
        description: 'Maintain a 3-day streak',
        icon: 'Flame',
        category: 'streak',
        tier: 'bronze',
        xpReward: 75,
        requirements: { type: 'streak', days: 3 }
    },
    {
        achievementId: 'week_warrior',
        name: 'Week Warrior',
        description: 'Maintain a 7-day streak',
        icon: '🔥',
        category: 'streak',
        tier: 'silver',
        xpReward: 150,
        requirements: { type: 'streak', days: 7 }
    },
    {
        achievementId: 'monthly_master',
        name: 'Monthly Master',
        description: 'Maintain a 30-day streak',
        icon: '🔥',
        category: 'streak',
        tier: 'gold',
        xpReward: 500,
        requirements: { type: 'streak', days: 30 }
    },
    {
        achievementId: 'century_champion',
        name: 'Century Champion',
        description: 'Maintain a 100-day streak',
        icon: '🔥',
        category: 'streak',
        tier: 'platinum',
        xpReward: 1000,
        requirements: { type: 'streak', days: 100 }
    },
    {
        achievementId: 'comeback_kid',
        name: 'Comeback Kid',
        description: 'Return after breaking a 7+ day streak',
        icon: 'TrendingUp',
        category: 'streak',
        tier: 'bronze',
        xpReward: 50,
        requirements: { type: 'comeback', minStreakBroken: 7 }
    },

    // ========== PERFORMANCE ACHIEVEMENTS ==========
    {
        achievementId: 'perfectionist',
        name: 'Perfectionist',
        description: 'Get 100% accuracy on any game',
        icon: 'CheckCircle2',
        category: 'performance',
        tier: 'silver',
        xpReward: 150,
        requirements: { type: 'accuracy', accuracy: 100 }
    },
    {
        achievementId: 'high_scorer',
        name: 'High Scorer',
        description: 'Score 1000+ on any single game',
        icon: 'Target',
        category: 'performance',
        tier: 'silver',
        xpReward: 200,
        requirements: { type: 'score', score: 1000 }
    },
    {
        achievementId: 'overachiever',
        name: 'Overachiever',
        description: 'Beat your personal best 10 times',
        icon: 'TrendingUp',
        category: 'performance',
        tier: 'bronze',
        xpReward: 100,
        requirements: { type: 'personalBests', count: 10 }
    },
    {
        achievementId: 'performance_king',
        name: 'Performance King',
        description: 'Beat your personal best 50 times',
        icon: 'TrendingUp',
        category: 'performance',
        tier: 'gold',
        xpReward: 300,
        requirements: { type: 'personalBests', count: 50 }
    },
    {
        achievementId: 'leaderboard_star',
        name: 'Leaderboard Star',
        description: 'Earn a spot in top 10 for any game',
        icon: 'Medal',
        category: 'performance',
        tier: 'gold',
        xpReward: 250,
        requirements: { type: 'leaderboard', rank: 10 }
    }
];

// ========== HELPER FUNCTIONS ==========

/**
 * Check if user has already earned an achievement
 */
function hasAchievement(user, achievementId) {
    return user.achievements.some(ach => ach.name === achievementId);
}

/**
 * Award an achievement to a user
 */
export async function awardAchievement(userId, achievementDef) {
    const user = await User.findById(userId);

    // Prevent duplicate awards
    if (hasAchievement(user, achievementDef.achievementId)) {
        return null;
    }

    // Add achievement to user
    user.achievements.push({
        name: achievementDef.achievementId,
        earnedAt: new Date(),
        icon: achievementDef.icon
    });

    // Award bonus XP
    if (achievementDef.xpReward > 0) {
        user.totalXP += achievementDef.xpReward;
        user.calculateLevel();
    }

    await user.save();

    return {
        ...achievementDef,
        earnedAt: new Date()
    };
}

// ========== ACHIEVEMENT CHECKERS ==========

/**
 * Check milestone achievements based on user stats
 */
async function checkMilestoneAchievements(user) {
    const newAchievements = [];

    // Get unique games played count
    const uniqueGamesPlayed = await Score.distinct('gameId', { userId: user._id });
    const uniqueGamesCount = uniqueGamesPlayed.length;

    for (const achDef of ACHIEVEMENT_DEFINITIONS) {
        if (achDef.category !== 'milestone') continue;
        if (hasAchievement(user, achDef.achievementId)) continue;

        const req = achDef.requirements;
        let isEarned = false;

        switch (req.type) {
            case 'gamesPlayed':
                isEarned = user.gamesPlayed >= req.count;
                break;
            case 'uniqueGames':
                isEarned = uniqueGamesCount >= req.count;
                break;
            case 'level':
                isEarned = user.level >= req.level;
                break;
            case 'totalXP':
                // Check XP before the achievement bonus (to avoid immediate triggers)
                isEarned = (user.totalXP - achDef.xpReward) >= req.xp;
                break;
        }

        if (isEarned) {
            const awarded = await awardAchievement(user._id, achDef);
            if (awarded) newAchievements.push(awarded);
        }
    }

    return newAchievements;
}

/**
 * Check streak achievements
 */
async function checkStreakAchievements(user, previousStreak) {
    const newAchievements = [];

    for (const achDef of ACHIEVEMENT_DEFINITIONS) {
        if (achDef.category !== 'streak') continue;
        if (hasAchievement(user, achDef.achievementId)) continue;

        const req = achDef.requirements;
        let isEarned = false;

        switch (req.type) {
            case 'streak':
                isEarned = user.currentStreak >= req.days;
                break;
            case 'comeback':
                // Check if user had a streak of 7+ days that was broken and now they're back
                isEarned = previousStreak >= req.minStreakBroken && user.currentStreak === 1;
                break;
        }

        if (isEarned) {
            const awarded = await awardAchievement(user._id, achDef);
            if (awarded) newAchievements.push(awarded);
        }
    }

    return newAchievements;
}

/**
 * Check performance achievements based on score
 */
async function checkPerformanceAchievements(user, score) {
    const newAchievements = [];

    // Count personal bests (times user has beaten their best score)
    const personalBestsCount = await Score.aggregate([
        { $match: { userId: user._id } },
        { $sort: { createdAt: 1 } },
        {
            $group: {
                _id: '$gameId',
                scores: { $push: { score: '$score', date: '$createdAt' } }
            }
        }
    ]).then(results => {
        let totalPBs = 0;
        results.forEach(game => {
            let maxScore = 0;
            game.scores.forEach(s => {
                if (s.score > maxScore) {
                    totalPBs++;
                    maxScore = s.score;
                }
            });
        });
        return totalPBs;
    });

    for (const achDef of ACHIEVEMENT_DEFINITIONS) {
        if (achDef.category !== 'performance') continue;
        if (hasAchievement(user, achDef.achievementId)) continue;

        const req = achDef.requirements;
        let isEarned = false;

        switch (req.type) {
            case 'accuracy':
                isEarned = score.accuracy >= req.accuracy;
                break;
            case 'score':
                isEarned = score.score >= req.score;
                break;
            case 'personalBests':
                isEarned = personalBestsCount >= req.count;
                break;
            case 'leaderboard':
                // Check if user is in top 10 for this game
                const leaderboard = await Score.getLeaderboard(score.gameId, req.rank);
                isEarned = leaderboard.some(entry => entry._id.toString() === user._id.toString());
                break;
        }

        if (isEarned) {
            const awarded = await awardAchievement(user._id, achDef);
            if (awarded) newAchievements.push(awarded);
        }
    }

    return newAchievements;
}

/**
 * Calculate achievement progress for a user
 */
export async function calculateAchievementProgress(user) {
    const progress = [];

    // Get unique games played
    const uniqueGamesPlayed = await Score.distinct('gameId', { userId: user._id });
    const uniqueGamesCount = uniqueGamesPlayed.length;

    // Count personal bests
    const personalBestsCount = await Score.aggregate([
        { $match: { userId: user._id } },
        { $sort: { createdAt: 1 } },
        {
            $group: {
                _id: '$gameId',
                scores: { $push: { score: '$score', date: '$createdAt' } }
            }
        }
    ]).then(results => {
        let totalPBs = 0;
        results.forEach(game => {
            let maxScore = 0;
            game.scores.forEach(s => {
                if (s.score > maxScore) {
                    totalPBs++;
                    maxScore = s.score;
                }
            });
        });
        return totalPBs;
    });

    for (const achDef of ACHIEVEMENT_DEFINITIONS) {
        if (hasAchievement(user, achDef.achievementId)) {
            continue; // Skip earned achievements
        }

        const req = achDef.requirements;
        let current = 0;
        let target = 0;
        let canTrack = true;

        switch (req.type) {
            case 'gamesPlayed':
                current = user.gamesPlayed;
                target = req.count;
                break;
            case 'uniqueGames':
                current = uniqueGamesCount;
                target = req.count;
                break;
            case 'level':
                current = user.level;
                target = req.level;
                break;
            case 'totalXP':
                current = user.totalXP;
                target = req.xp;
                break;
            case 'streak':
                current = user.currentStreak;
                target = req.days;
                break;
            case 'personalBests':
                current = personalBestsCount;
                target = req.count;
                break;
            case 'accuracy':
            case 'score':
            case 'leaderboard':
            case 'comeback':
                canTrack = false; // These are event-based, can't show progress
                break;
        }

        if (canTrack) {
            progress.push({
                achievementId: achDef.achievementId,
                name: achDef.name,
                description: achDef.description,
                icon: achDef.icon,
                category: achDef.category,
                tier: achDef.tier,
                xpReward: achDef.xpReward,
                current,
                target,
                percentage: Math.min(100, Math.floor((current / target) * 100))
            });
        }
    }

    return progress;
}

/**
 * Main function to check all achievements after a game is played
 */
export async function checkAchievements(userId, context = {}) {
    const { score, previousStreak = 0 } = context;

    // Reload user to get latest data
    const user = await User.findById(userId);
    if (!user) return [];

    const newAchievements = [];

    // Check milestone achievements
    const milestoneAchs = await checkMilestoneAchievements(user);
    newAchievements.push(...milestoneAchs);

    // Check streak achievements if streak changed
    if (previousStreak !== undefined) {
        const streakAchs = await checkStreakAchievements(user, previousStreak);
        newAchievements.push(...streakAchs);
    }

    // Check performance achievements if score is provided
    if (score) {
        // Reload user again in case milestone achievements added XP
        const updatedUser = await User.findById(userId);
        const perfAchs = await checkPerformanceAchievements(updatedUser, score);
        newAchievements.push(...perfAchs);
    }

    return newAchievements;
}
