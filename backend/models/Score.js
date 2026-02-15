import mongoose from 'mongoose';

const scoreSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  gameId: {
    type: String,
    enum: [
      // Quiz-Style Games
      'codetype',
      'bugspotter',
      'terminalmaster',
      'outputpredictor',
      'regexmatcher',
      'httpstatus',
      'bigochallenge',
      'gitcommands',
      // Drag-and-Drop Games
      'codeblocks',
      'sqlbuilder',
      'flexbox',
      'datastructure',
      // Interactive Games
      'colormatcher',
      'cssselector',
      'binary',
      'jsonpath',
      'debugrace',
      'apiendpoint',
      // Battle Game
      'codewarriors'
    ],
    required: true,
    index: true
  },
  score: {
    type: Number,
    required: true,
    min: 0
  },
  accuracy: {
    type: Number,
    min: 0,
    max: 100
  },
  wpm: {
    type: Number,
    min: 0
  },
  correctAnswers: {
    type: Number,
    min: 0,
    default: 0
  },
  totalAttempts: {
    type: Number,
    min: 0,
    default: 0
  },
  timeSpent: {
    type: Number, // in seconds
    min: 0
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  }
}, {
  timestamps: true
});

// Compound indexes for efficient queries
scoreSchema.index({ userId: 1, gameId: 1 });
scoreSchema.index({ gameId: 1, score: -1 }); // For leaderboards
scoreSchema.index({ userId: 1, createdAt: -1 }); // For user history

// Static method to get user's best score for a game
scoreSchema.statics.getUserBestScore = async function (userId, gameId) {
  return this.findOne({ userId, gameId })
    .sort({ score: -1 })
    .limit(1);
};

// Static method to get leaderboard with pagination
scoreSchema.statics.getLeaderboard = async function (gameId, limit = 50, offset = 0) {
  // Get total count of unique users for this game
  const uniqueUsers = await this.distinct('userId', { gameId });
  const totalUsers = uniqueUsers.length;

  const leaderboard = await this.aggregate([
    { $match: { gameId } },
    { $sort: { score: -1, createdAt: 1 } },
    {
      $group: {
        _id: '$userId',
        score: { $first: '$score' },
        createdAt: { $first: '$createdAt' }
      }
    },
    { $sort: { score: -1 } },
    { $skip: offset },
    { $limit: limit },
    {
      $lookup: {
        from: 'users',
        localField: '_id',
        foreignField: '_id',
        as: 'user'
      }
    },
    { $unwind: '$user' },
    {
      $project: {
        _id: 1,
        score: 1,
        createdAt: 1,
        username: '$user.username',
        avatar: '$user.avatar',
        level: '$user.level',
        achievementCount: { $size: '$user.achievements' }
      }
    }
  ]);

  return {
    data: leaderboard,
    hasMore: offset + limit < totalUsers,
    total: totalUsers,
    offset,
    limit
  };
};

// Static method to get user stats
scoreSchema.statics.getUserStats = async function (userId) {
  return this.aggregate([
    { $match: { userId: mongoose.Types.ObjectId(userId) } },
    {
      $group: {
        _id: '$gameId',
        totalGames: { $sum: 1 },
        bestScore: { $max: '$score' },
        avgScore: { $avg: '$score' },
        avgAccuracy: { $avg: '$accuracy' },
        totalCorrect: { $sum: '$correctAnswers' },
        totalAttempts: { $sum: '$totalAttempts' }
      }
    }
  ]);
};

const Score = mongoose.model('Score', scoreSchema);
export default Score;
