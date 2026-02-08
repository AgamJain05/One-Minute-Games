import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
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
  type: {
    type: String,
    enum: [
      'code_snippet',
      'multiple_choice',
      'drag_drop',
      'bug_finding',
      'pattern_match',
      'scenario',
      'character_based'
    ],
    required: true,
    index: true
  },
  category: {
    type: String,
    default: null
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard', 'beginner', 'intermediate', 'advanced'],
    default: 'medium'
  },
  data: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  metadata: {
    language: String,
    expectedTime: Number,
    tags: [String]
  },
  isActive: {
    type: Boolean,
    default: true,
    index: true
  }
}, {
  timestamps: true
});

// Compound index for efficient queries
questionSchema.index({ gameId: 1, isActive: 1 });
questionSchema.index({ gameId: 1, type: 1 });

// Static method to get questions by gameId
questionSchema.statics.getByGameId = async function(gameId, limit = null) {
  const query = this.find({ gameId, isActive: true });
  if (limit) {
    query.limit(limit);
  }
  return await query.exec();
};

// Static method to get question count
questionSchema.statics.getCount = async function(gameId) {
  return await this.countDocuments({ gameId, isActive: true });
};

// Static method to get random questions
questionSchema.statics.getRandom = async function(gameId, count = 10) {
  return await this.aggregate([
    { $match: { gameId, isActive: true } },
    { $sample: { size: count } }
  ]);
};

const Question = mongoose.model('Question', questionSchema);

export default Question;
