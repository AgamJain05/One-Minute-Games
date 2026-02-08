import mongoose from 'mongoose';
import { baseQuestionSchema, baseQuestionMethods } from '../base/BaseQuestion.js';

const regexMatcherSchema = new mongoose.Schema({
  ...baseQuestionSchema,
  gameId: { type: String, default: 'regexmatcher', immutable: true },
  pattern: {
    type: String, // Store regex as string, e.g., "/^\d{3}$/"
    required: true
  },
  string: {
    type: String,
    required: true
  },
  matches: {
    type: Boolean,
    required: true
  },
  explanation: String
}, { timestamps: true });

// Apply base methods
Object.assign(regexMatcherSchema.statics, baseQuestionMethods.static);

const RegexMatcherQuestion = mongoose.model('RegexMatcherQuestion', regexMatcherSchema);
export default RegexMatcherQuestion;
