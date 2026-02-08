import express from 'express';
const router = express.Router();
import { getQuestionModel, validateGameId } from '../models/questions/index.js';

// @route   GET /api/games/:gameId/questions
// @desc    Get questions for a specific game
// @access  Public
router.get('/:gameId/questions', async (req, res) => {
  try {
    const { gameId } = req.params;
    
    if (!validateGameId(gameId)) {
      return res.status(400).json({ message: `Invalid game ID: ${gameId}` });
    }

    const QuestionModel = getQuestionModel(gameId);
    const { limit, random } = req.query;

    let questions;
    if (random === 'true' && limit) {
      questions = await QuestionModel.getRandom(gameId, parseInt(limit));
    } else if (limit) {
      questions = await QuestionModel.getByGameId(gameId, parseInt(limit));
    } else {
      questions = await QuestionModel.getByGameId(gameId);
    }

    const total = await QuestionModel.getCount(gameId);

    res.json({ questions, total });
  } catch (error) {
    console.error('Error fetching questions:', error);
    res.status(500).json({ message: 'Server error fetching questions' });
  }
});

// @route   GET /api/games/:gameId/questions/count
// @desc    Get question count for a specific game
// @access  Public
router.get('/:gameId/questions/count', async (req, res) => {
  try {
    const { gameId } = req.params;
    
    if (!validateGameId(gameId)) {
      return res.status(400).json({ message: `Invalid game ID: ${gameId}` });
    }

    const QuestionModel = getQuestionModel(gameId);
    const count = await QuestionModel.getCount(gameId);

    res.json({ count, gameId });
  } catch (error) {
    console.error('Error fetching question count:', error);
    res.status(500).json({ message: 'Server error fetching question count' });
  }
});

export default router;
