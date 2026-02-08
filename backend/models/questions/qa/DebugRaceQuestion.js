import mongoose from 'mongoose';
import { baseQuestionSchema, baseQuestionMethods } from '../base/BaseQuestion.js';

const debugRaceSchema = new mongoose.Schema({
  ...baseQuestionSchema,
  gameId: { type: String, default: 'debugrace', immutable: true },
  code: {
    type: String,
    required: true
  },
  problem: {
    type: String,
    required: true
  },
  options: {
    type: [String],
    required: true,
    validate: {
      validator: (v) => v.length >= 2 && v.length <= 6,
      message: 'Options must have between 2 and 6 choices'
    }
  },
  fix: {
    type: String,
    required: true
  },
  explanation: String
}, { timestamps: true });

// Apply base methods
Object.assign(debugRaceSchema.statics, baseQuestionMethods.static);

const DebugRaceQuestion = mongoose.model('DebugRaceQuestion', debugRaceSchema);
export default DebugRaceQuestion;
