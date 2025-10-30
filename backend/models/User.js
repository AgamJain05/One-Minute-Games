import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    trim: true,
    minlength: [3, 'Username must be at least 3 characters'],
    maxlength: [20, 'Username cannot exceed 20 characters']
  },
  email: {
    type: String,
    required: false, // Email is optional
    unique: true,
    sparse: true, // Allow multiple null values for unique index
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  avatar: {
    type: String,
    default: '🎮'
  },
  level: {
    type: Number,
    default: 1
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
  totalXP: {
    type: Number,
    default: 0
  },
  gamesPlayed: {
    type: Number,
    default: 0
  },
  currentStreak: {
    type: Number,
    default: 0
  },
  longestStreak: {
    type: Number,
    default: 0
  },
  lastPlayedDate: {
    type: Date,
    default: null
  },
  achievements: [{
    name: String,
    earnedAt: Date,
    icon: String
  }],
  isPremium: {
    type: Boolean,
    default: false
  },
  premiumPurchasedAt: {
    type: Date,
    default: null
  },
  stripeCustomerId: {
    type: String,
    default: null
  },
  stripePaymentId: {
    type: String,
    default: null
  },
  
  // Email Verification
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  emailVerificationToken: {
    type: String,
    select: false
  },
  emailVerificationExpires: {
    type: Date,
    select: false
  },
  
  // Password Reset
  passwordResetToken: {
    type: String,
    select: false
  },
  passwordResetExpires: {
    type: Date,
    select: false
  },
  passwordChangedAt: {
    type: Date,
    select: false
  },
  
  // Multi-Factor Authentication (MFA/2FA)
  mfaEnabled: {
    type: Boolean,
    default: false
  },
  mfaSecret: {
    type: String,
    select: false
  },
  mfaBackupCodes: [{
    type: String,
    select: false
  }],
  
  // Security & Login Tracking
  failedLoginAttempts: {
    type: Number,
    default: 0
  },
  accountLockedUntil: {
    type: Date,
    default: null
  },
  lastLoginAt: {
    type: Date,
    default: null
  },
  lastLoginIP: {
    type: String,
    default: null
  },
  lastLoginLocation: {
    type: String,
    default: null
  },
  
  // Device Sessions
  activeSessions: [{
    deviceId: String,
    deviceName: String,
    deviceType: String,
    browser: String,
    os: String,
    ip: String,
    location: String,
    createdAt: {
      type: Date,
      default: Date.now
    },
    lastActivityAt: {
      type: Date,
      default: Date.now
    },
    refreshToken: String
  }],
  
  // Security Alerts
  securityAlerts: [{
    type: {
      type: String,
      enum: ['new_device', 'password_change', 'failed_attempts', 'mfa_change', 'account_locked', 'suspicious_login']
    },
    message: String,
    ip: String,
    location: String,
    createdAt: {
      type: Date,
      default: Date.now
    },
    acknowledged: {
      type: Boolean,
      default: false
    }
  }],
  
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Hash password before saving
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to compare passwords
UserSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Method to calculate level from XP
UserSchema.methods.calculateLevel = function() {
  this.level = Math.floor(this.totalXP / 100) + 1;
};

// Method to check if account is locked
UserSchema.methods.isAccountLocked = function() {
  return this.accountLockedUntil && this.accountLockedUntil > Date.now();
};

// Method to increment failed login attempts
UserSchema.methods.incrementFailedAttempts = async function() {
  this.failedLoginAttempts += 1;
  
  // Lock account after 5 failed attempts
  if (this.failedLoginAttempts >= 5) {
    this.accountLockedUntil = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
    
    // Create security alert
    this.securityAlerts.push({
      type: 'account_locked',
      message: 'Account locked due to multiple failed login attempts',
      ip: this.lastLoginIP || 'Unknown',
      location: this.lastLoginLocation || 'Unknown'
    });
  }
  
  await this.save();
};

// Method to reset failed login attempts
UserSchema.methods.resetFailedAttempts = async function() {
  this.failedLoginAttempts = 0;
  this.accountLockedUntil = null;
  await this.save();
};

// Method to generate email verification token
UserSchema.methods.generateEmailVerificationToken = function() {
  const crypto = require('crypto');
  const token = crypto.randomBytes(32).toString('hex');
  
  this.emailVerificationToken = crypto
    .createHash('sha256')
    .update(token)
    .digest('hex');
  
  this.emailVerificationExpires = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
  
  return token; // Return unhashed token to send via email
};

// Method to generate password reset token
UserSchema.methods.generatePasswordResetToken = function() {
  const crypto = require('crypto');
  const token = crypto.randomBytes(32).toString('hex');
  
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(token)
    .digest('hex');
  
  this.passwordResetExpires = Date.now() + 60 * 60 * 1000; // 1 hour
  
  return token; // Return unhashed token to send via email
};

// Method to check if password was changed after token was issued
UserSchema.methods.changedPasswordAfter = function(JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
    return JWTTimestamp < changedTimestamp;
  }
  return false;
};

// Method to add security alert
UserSchema.methods.addSecurityAlert = async function(type, message, ip = 'Unknown', location = 'Unknown') {
  this.securityAlerts.push({
    type,
    message,
    ip,
    location
  });
  
  // Keep only last 50 alerts
  if (this.securityAlerts.length > 50) {
    this.securityAlerts = this.securityAlerts.slice(-50);
  }
  
  await this.save();
};

// Method to create/update device session
UserSchema.methods.createSession = async function(deviceInfo, refreshToken) {
  const existingSessionIndex = this.activeSessions.findIndex(
    session => session.deviceId === deviceInfo.deviceId
  );
  
  if (existingSessionIndex !== -1) {
    // Update existing session
    this.activeSessions[existingSessionIndex].lastActivityAt = new Date();
    this.activeSessions[existingSessionIndex].refreshToken = refreshToken;
  } else {
    // Check if this is a new device
    if (this.activeSessions.length > 0) {
      await this.addSecurityAlert(
        'new_device',
        `New login from ${deviceInfo.deviceType} - ${deviceInfo.browser}`,
        deviceInfo.ip,
        deviceInfo.location
      );
    }
    
    // Add new session
    this.activeSessions.push({
      ...deviceInfo,
      refreshToken,
      createdAt: new Date(),
      lastActivityAt: new Date()
    });
  }
  
  // Keep only last 10 active sessions
  if (this.activeSessions.length > 10) {
    this.activeSessions = this.activeSessions.slice(-10);
  }
  
  await this.save();
};

// Method to revoke session
UserSchema.methods.revokeSession = async function(sessionId) {
  this.activeSessions = this.activeSessions.filter(
    session => session._id.toString() !== sessionId
  );
  await this.save();
};

// Method to revoke all sessions except current
UserSchema.methods.revokeAllSessionsExcept = async function(currentSessionId) {
  this.activeSessions = this.activeSessions.filter(
    session => session._id.toString() === currentSessionId
  );
  await this.save();
};

export default mongoose.model('User', UserSchema);

