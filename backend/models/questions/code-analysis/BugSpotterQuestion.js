import mongoose from 'mongoose';
import { baseQuestionSchema, baseQuestionMethods } from '../base/BaseQuestion.js';

const bugSpotterSchema = new mongoose.Schema({
  ...baseQuestionSchema,
  gameId: { type: String, default: 'bugspotter', immutable: true },
  code: {
    type: [String], // Array of code lines
    required: true
  },
  bugs: {
    type: [Number], // Array of line numbers with bugs
    required: true,
    validate: {
      validator: (v) => v.length >= 1,
      message: 'Must have at least 1 bug'
    }
  },
  explanation: String
}, { timestamps: true });

// Apply base methods
Object.assign(bugSpotterSchema.statics, baseQuestionMethods.static);

const BugSpotterQuestion = mongoose.model('BugSpotterQuestion', bugSpotterSchema);
export default BugSpotterQuestion;
