import express from 'express';
const router = express.Router();
import auth from '../middleware/auth.js';
import User from '../models/User.js';
import { ACHIEVEMENT_DEFINITIONS, calculateAchievementProgress } from '../utils/achievementService.js';

// @route   GET /api/achievements
// @desc    Get all available achievements
// @access  Public
router.get('/', async (req, res) => {
    try {
        res.json({
            achievements: ACHIEVEMENT_DEFINITIONS,
            total: ACHIEVEMENT_DEFINITIONS.length
        });
    } catch (error) {
        console.error('Error fetching achievements:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   GET /api/achievements/user
// @desc    Get current user's achievements with progress
// @access  Private
router.get('/user', auth, async (req, res) => {
    try {
        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Get earned achievements with full details
        const earnedAchievements = user.achievements.map(userAch => {
            const achDef = ACHIEVEMENT_DEFINITIONS.find(def => def.achievementId === userAch.name);
            return {
                ...achDef,
                earnedAt: userAch.earnedAt
            };
        }).filter(ach => ach.achievementId); // Filter out any invalid achievements

        // Get progress on locked achievements
        const lockedProgress = await calculateAchievementProgress(user);

        res.json({
            earned: earnedAchievements,
            locked: lockedProgress,
            stats: {
                totalAchievements: ACHIEVEMENT_DEFINITIONS.length,
                earnedCount: earnedAchievements.length,
                completionPercentage: Math.floor((earnedAchievements.length / ACHIEVEMENT_DEFINITIONS.length) * 100)
            }
        });
    } catch (error) {
        console.error('Error fetching user achievements:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   GET /api/achievements/user/:userId
// @desc    Get specific user's earned achievements (public profile)
// @access  Public
router.get('/user/:userId', async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Get earned achievements with full details
        const earnedAchievements = user.achievements.map(userAch => {
            const achDef = ACHIEVEMENT_DEFINITIONS.find(def => def.achievementId === userAch.name);
            return {
                ...achDef,
                earnedAt: userAch.earnedAt
            };
        }).filter(ach => ach.achievementId);

        res.json({
            username: user.username,
            avatar: user.avatar,
            earned: earnedAchievements,
            stats: {
                totalAchievements: ACHIEVEMENT_DEFINITIONS.length,
                earnedCount: earnedAchievements.length,
                completionPercentage: Math.floor((earnedAchievements.length / ACHIEVEMENT_DEFINITIONS.length) * 100)
            }
        });
    } catch (error) {
        console.error('Error fetching user achievements:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;
