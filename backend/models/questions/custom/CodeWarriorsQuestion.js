import mongoose from 'mongoose';
import { baseQuestionSchema, baseQuestionMethods } from '../base/BaseQuestion.js';

const codeWarriorsSchema = new mongoose.Schema({
  ...baseQuestionSchema,
  gameId: { type: String, default: 'codewarriors', immutable: true },
  characterId: {
    type: String,
    required: true,
    enum: ['algorithm', 'database', 'frontend', 'backend']
  },
  question: {
    type: String,
    required: true
  },
  options: {
    type: [String],
    required: true
  },
  answer: {
    type: String,
    required: true
  },
  expectedTime: {
    type: Number,
    default: 10
  }
}, { timestamps: true });

// Apply base methods
Object.assign(codeWarriorsSchema.statics, baseQuestionMethods.static);

const CodeWarriorsQuestion = mongoose.model('CodeWarriorsQuestion', codeWarriorsSchema);
export default CodeWarriorsQuestion;
