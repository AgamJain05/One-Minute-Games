import express from 'express';
const router = express.Router();
import { body, validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Security: Ensure JWT_SECRET is set in production
const getJwtSecret = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret && process.env.NODE_ENV === 'production') {
    throw new Error('FATAL: JWT_SECRET must be set in production environment');
  }
  if (!secret) {
    console.warn('⚠️  WARNING: Using fallback JWT secret. Set JWT_SECRET in .env for production!');
  }
  return secret || 'fallback_secret_key_for_development_only';
};

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', [
  body('username')
    .trim()
    .isLength({ min: 3, max: 20 }).withMessage('Username must be 3-20 characters'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const firstError = errors.array()[0].msg;
      return res.status(400).json({ message: firstError });
    }

    const { username, password } = req.body;

    // Check if username already exists
    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(400).json({ message: 'This username is already taken. Please choose another one.' });
    }

    // Create new user (email is optional)
    const user = new User({ username, password });
    await user.save();

    // Generate JWT
    const token = jwt.sign(
      { userId: user._id },
      getJwtSecret(),
      { expiresIn: process.env.JWT_EXPIRE || '7d' }
    );

    res.status(201).json({
      token,
      user: {
        id: user._id,
        username: user.username,
        avatar: user.avatar,
        level: user.level,
        isAdmin: user.isAdmin || false
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    
    // Handle MongoDB duplicate key errors
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(400).json({ 
        message: `This ${field} is already taken. Please choose another one.` 
      });
    }
    
    res.status(500).json({ message: 'Registration failed. Please try again later.' });
  }
});

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', [
  body('username').trim().notEmpty().withMessage('Username is required'),
  body('password').notEmpty().withMessage('Password is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const firstError = errors.array()[0].msg;
      return res.status(400).json({ message: firstError });
    }

    const { username, password } = req.body;

    // Find user by username
    const user = await User.findOne({ username }).select('+password');
    if (!user) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    // Generate JWT
    const token = jwt.sign(
      { userId: user._id },
      getJwtSecret(),
      { expiresIn: process.env.JWT_EXPIRE || '7d' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        avatar: user.avatar,
        level: user.level,
        totalXP: user.totalXP,
        currentStreak: user.currentStreak,
        isPremium: user.isPremium,
        isAdmin: user.isAdmin || false
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Login failed. Please try again later.' });
  }
});

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
import auth from '../middleware/auth.js';

router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;


