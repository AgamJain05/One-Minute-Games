import express from 'express';
const router = express.Router();
import Game from '../models/Game.js';

// @route   GET /api/games
// @desc    Get all active games
// @access  Public
router.get('/', async (req, res) => {
  try {
    const games = await Game.find({ isActive: true }).sort({ name: 1 });
    res.json(games);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/games/:gameId
// @desc    Get specific game details
// @access  Public
router.get('/:gameId', async (req, res) => {
  try {
    const game = await Game.findOne({ gameId: req.params.gameId });
    if (!game) {
      return res.status(404).json({ message: 'Game not found' });
    }
    res.json(game);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;




