import rateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';
import redis from 'redis';

// In-memory store for development (use Redis in production)
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 login requests per windowMs
  message: {
    message: 'Too many login attempts. Please try again after 15 minutes.',
  },
  standardHeaders: true,
  legacyHeaders: false,
  // Use Redis store in production
  // store: new RedisStore({
  //   client: redis.createClient({ url: process.env.REDIS_URL }),
  //   prefix: 'rl:login:',
  // }),
  handler: (req, res) => {
    // Log failed attempts
    console.warn(`⚠️ Rate limit exceeded for IP: ${req.ip}`);
    res.status(429).json({
      message: 'Too many login attempts. Please try again after 15 minutes.',
    });
  },
});

const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // Limit each IP to 3 registration attempts per hour
  message: {
    message: 'Too many accounts created. Please try again after an hour.',
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    console.warn(`⚠️ Registration rate limit exceeded for IP: ${req.ip}`);
    res.status(429).json({
      message: 'Too many accounts created. Please try again after an hour.',
    });
  },
});

const passwordResetLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // Limit each IP to 3 password reset requests per hour
  message: {
    message: 'Too many password reset attempts. Please try again after an hour.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    message: 'Too many requests. Please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Sliding window limiter for sensitive operations
const strictLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 3,
  skipSuccessfulRequests: false,
  message: {
    message: 'Too many attempts. Please slow down.',
  },
});

export {
  loginLimiter,
  registerLimiter,
  passwordResetLimiter,
  apiLimiter,
  strictLimiter,
};



