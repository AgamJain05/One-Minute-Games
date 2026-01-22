import jwt from 'jsonwebtoken';

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

export default (req, res, next) => {
  // Get token from header
  const authHeader = req.header('Authorization');
  
  if (!authHeader) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  // Check if header starts with "Bearer "
  if (!authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  const token = authHeader.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    // Verify token
    const jwtSecret = getJwtSecret();
    const decoded = jwt.verify(token, jwtSecret);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};


