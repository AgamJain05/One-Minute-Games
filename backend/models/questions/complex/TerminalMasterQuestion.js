import mongoose from 'mongoose';
import { baseQuestionSchema, baseQuestionMethods } from '../base/BaseQuestion.js';

const terminalMasterSchema = new mongoose.Schema({
  ...baseQuestionSchema,
  gameId: { type: String, default: 'terminalmaster', immutable: true },
  questionId: Number, // Original ID from data.js
  level: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced']
  },
  category: String,
  situation: String,
  question: {
    type: String,
    required: true
  },
  answer: {
    type: String,
    required: true
  },
  explanation: String,
  options: {
    type: [String],
    required: true
  },
  hint: String,
  realExample: String,
  mnemonic: String,
  useCase: String
}, { timestamps: true });

// Apply base methods
Object.assign(terminalMasterSchema.statics, baseQuestionMethods.static);

const TerminalMasterQuestion = mongoose.model('TerminalMasterQuestion', terminalMasterSchema);
export default TerminalMasterQuestion;
