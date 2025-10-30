import express from 'express';
import path from 'path';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

// Debug: Check if JWT_SECRET is loaded
console.log('🔐 JWT_SECRET exists:', !!process.env.JWT_SECRET);
console.log('🔐 JWT_SECRET value:', process.env.JWT_SECRET ? 'LOADED' : 'NOT LOADED');

const app = express();

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(compression());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database Connection (require explicit MONGODB_URI)
if (!process.env.MONGODB_URI) {
  console.error('❌ MONGODB_URI is not set. Please define it in your .env');
  process.exit(1);
}

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(async () => {
  console.log('✅ MongoDB Connected');
  try {
    // Ensure indexes reflect latest schema (e.g., sparse unique email)
    const User = require('./models/User');
    await User.syncIndexes();
    await User.init(); // proactively create users collection

    // Initialize other collections proactively
    const Score = require('./models/Score');
    const AnalyticsEvent = require('./models/AnalyticsEvent');
    await Promise.all([
      Score.init(),
      AnalyticsEvent.init(),
    ]);
    console.log('✅ User indexes synchronized');
  } catch (e) {
    console.error('⚠️ Failed to sync indexes:', e.message);
  }
})
.catch((err) => console.error('❌ MongoDB Connection Error:', err));

// API Routes
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import scoreRoutes from './routes/scores.js';
import gameRoutes from './routes/games.js';
import analyticsRoutes from './routes/analytics.js';

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/scores', scoreRoutes);
app.use('/api/games', gameRoutes);
app.use('/api/analytics', analyticsRoutes);

// PAYMENT ROUTES DISABLED - Uncomment below to re-enable
// app.use('/api/payment', require('./routes/payment'));

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
});

