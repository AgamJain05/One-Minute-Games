import express from 'express';
const router = express.Router();
import User from '../models/User.js';
import Score from '../models/Score.js';
import auth from '../middleware/auth.js';

// @route   GET /api/users/profile
// @desc    Get user profile with stats
// @access  Private
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    
    // Get game statistics
    const scores = await Score.find({ userId: req.userId });
    const gameStats = {};
    
    scores.forEach(score => {
      if (!gameStats[score.gameId]) {
        gameStats[score.gameId] = {
          played: 0,
          bestScore: 0,
          averageScore: 0,
          totalScore: 0
        };
      }
      gameStats[score.gameId].played += 1;
      gameStats[score.gameId].totalScore += score.score;
      gameStats[score.gameId].bestScore = Math.max(gameStats[score.gameId].bestScore, score.score);
    });

    // Calculate averages
    Object.keys(gameStats).forEach(gameId => {
      gameStats[gameId].averageScore = Math.round(
        gameStats[gameId].totalScore / gameStats[gameId].played
      );
    });

    res.json({
      user,
      gameStats,
      totalGamesPlayed: scores.length
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/users/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', auth, async (req, res) => {
  try {
    const { username, avatar } = req.body;
    const updates = {};

    if (username) updates.username = username;
    if (avatar) updates.avatar = avatar;

    const user = await User.findByIdAndUpdate(
      req.userId,
      updates,
      { new: true, runValidators: true }
    ).select('-password');

    res.json(user);
  } catch (error) {
    console.error(error);
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Username already taken' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/users/leaderboard
// @desc    Get global leaderboard
// @access  Public
router.get('/leaderboard', async (req, res) => {
  try {
    const users = await User.find()
      .select('username avatar level totalXP gamesPlayed')
      .sort({ totalXP: -1 })
      .limit(50);

    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;




