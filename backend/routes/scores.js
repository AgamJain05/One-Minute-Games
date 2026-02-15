import express from 'express';
const router = express.Router();
import Score from '../models/Score.js';
import User from '../models/User.js';
import auth from '../middleware/auth.js';
import { checkAchievements } from '../utils/achievementService.js';

// @route   POST /api/scores
// @desc    Submit a new score
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const { gameId, score, accuracy, correctAnswers, totalAttempts, metadata } = req.body;

    const newScore = new Score({
      userId: req.userId,
      gameId,
      score,
      accuracy,
      correctAnswers,
      totalAttempts,
      metadata
    });

    await newScore.save();

    // Update user stats atomically to prevent race conditions
    const xpGain = Math.floor(score / 10); // 1 XP per 10 points
    const today = new Date().toDateString();

    // First, get the user to check streak logic
    let user = await User.findById(req.userId);
    const lastPlayed = user.lastPlayedDate ? new Date(user.lastPlayedDate).toDateString() : null;

    // Store previous streak for comeback achievement
    const previousStreak = user.currentStreak;

    // Determine streak update
    let streakUpdate = {};
    if (lastPlayed === today) {
      // Already played today, don't change streak
    } else if (lastPlayed === new Date(Date.now() - 86400000).toDateString()) {
      // Played yesterday, increment streak
      const newStreak = user.currentStreak + 1;
      streakUpdate = {
        currentStreak: newStreak,
        longestStreak: Math.max(newStreak, user.longestStreak)
      };
    } else {
      // Streak broken, reset
      streakUpdate = { currentStreak: 1 };
    }

    // Use atomic update to prevent race conditions
    user = await User.findByIdAndUpdate(
      req.userId,
      {
        $inc: { gamesPlayed: 1, totalXP: xpGain },
        $set: { lastPlayedDate: new Date(), ...streakUpdate }
      },
      { new: true }
    );

    // Calculate level after atomic update
    user.calculateLevel();
    await user.save();

    // Check for new achievements
    const newAchievements = await checkAchievements(req.userId, {
      score: newScore,
      previousStreak
    });

    res.status(201).json({
      score: newScore,
      user: {
        level: user.level,
        totalXP: user.totalXP,
        currentStreak: user.currentStreak,
        gamesPlayed: user.gamesPlayed
      },
      achievements: newAchievements // Include newly earned achievements
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/scores/my/:gameId
// @desc    Get user's scores for a specific game
// @access  Private
router.get('/my/:gameId', auth, async (req, res) => {
  try {
    const scores = await Score.find({
      userId: req.userId,
      gameId: req.params.gameId
    }).sort({ score: -1 }).limit(10);

    const bestScore = scores.length > 0 ? scores[0] : null;

    res.json({
      scores,
      bestScore
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/scores/leaderboard/:gameId
// @desc    Get leaderboard for a specific game with pagination
// @access  Public
router.get('/leaderboard/:gameId', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 50;
    const offset = parseInt(req.query.offset) || 0;

    const result = await Score.getLeaderboard(req.params.gameId, limit, offset);

    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/scores/recent
// @desc    Get recent scores for current user
// @access  Private
router.get('/recent', auth, async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 5;
    const scores = await Score.find({ userId: req.userId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate('gameId', 'name icon');

    res.json(scores);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;




