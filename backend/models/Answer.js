import mongoose from 'mongoose';

const answerSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  gameId: {
    type: String,
    enum: [
      'codetype',
      'bugspotter',
      'terminalmaster',
      'outputpredictor',
      'regexmatcher',
      'httpstatus',
      'bigochallenge',
      'gitcommands',
      'codeblocks',
      'sqlbuilder',
      'flexbox',
      'datastructure',
      'colormatcher',
      'cssselector',
      'binary',
      'jsonpath',
      'debugrace',
      'apiendpoint',
      'codewarriors'
    ],
    required: true,
    index: true
  },
  questionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Question',
    required: true
  },
  sessionId: {
    type: String,
    required: true,
    index: true
  },
  userAnswer: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  correctAnswer: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  isCorrect: {
    type: Boolean,
    required: true,
    index: true
  },
  timeSpent: {
    type: Number,
    default: 0
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  }
}, {
  timestamps: true
});

// Compound indexes for efficient queries
answerSchema.index({ userId: 1, sessionId: 1 });
answerSchema.index({ sessionId: 1, createdAt: 1 });
answerSchema.index({ gameId: 1, createdAt: -1 });

// Static method to get session answers
answerSchema.statics.getSessionAnswers = async function(sessionId) {
  return await this.find({ sessionId })
    .populate('questionId')
    .sort({ createdAt: 1 })
    .exec();
};

// Static method to get user accuracy for a game
answerSchema.statics.getUserAccuracy = async function(userId, gameId) {
  const results = await this.aggregate([
    { $match: { userId: new mongoose.Types.ObjectId(userId), gameId } },
    {
      $group: {
        _id: null,
        total: { $sum: 1 },
        correct: { $sum: { $cond: ['$isCorrect', 1, 0] } }
      }
    }
  ]);

  if (results.length === 0) {
    return { total: 0, correct: 0, accuracy: 0 };
  }

  const { total, correct } = results[0];
  const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;

  return { total, correct, accuracy };
};

// Static method to get session stats
answerSchema.statics.getSessionStats = async function(sessionId) {
  const results = await this.aggregate([
    { $match: { sessionId } },
    {
      $group: {
        _id: null,
        total: { $sum: 1 },
        correct: { $sum: { $cond: ['$isCorrect', 1, 0] } },
        totalTime: { $sum: '$timeSpent' }
      }
    }
  ]);

  if (results.length === 0) {
    return { total: 0, correct: 0, incorrect: 0, accuracy: 0, totalTime: 0 };
  }

  const { total, correct, totalTime } = results[0];
  const incorrect = total - correct;
  const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;

  return { total, correct, incorrect, accuracy, totalTime };
};

const Answer = mongoose.model('Answer', answerSchema);

export default Answer;
