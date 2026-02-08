import mongoose from 'mongoose';

export const baseQuestionSchema = {
  gameId: {
    type: String,
    required: true,
    index: true
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard', 'beginner', 'intermediate', 'advanced'],
    default: 'medium'
  },
  isActive: {
    type: Boolean,
    default: true,
    index: true
  },
  category: String,
  tags: [String]
};

export const baseQuestionMethods = {
  // Shared static methods
  static: {
    async getByGameId(gameId, limit = null) {
      const query = this.find({ gameId, isActive: true });
      if (limit) query.limit(limit);
      return await query.exec();
    },
    
    async getCount(gameId) {
      return await this.countDocuments({ gameId, isActive: true });
    },
    
    async getRandom(gameId, count = 10) {
      return await this.aggregate([
        { $match: { gameId, isActive: true } },
        { $sample: { size: count } }
      ]);
    }
  }
};
