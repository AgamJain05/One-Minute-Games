import mongoose from 'mongoose';
import { baseQuestionSchema, baseQuestionMethods } from '../base/BaseQuestion.js';

const jsonPathSchema = new mongoose.Schema({
  ...baseQuestionSchema,
  gameId: { type: String, default: 'jsonpath', immutable: true },
  json: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  question: {
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
  answer: {
    type: String,
    required: true
  },
  explanation: String
}, { timestamps: true });

// Apply base methods
Object.assign(jsonPathSchema.statics, baseQuestionMethods.static);

const JsonPathQuestion = mongoose.model('JsonPathQuestion', jsonPathSchema);
export default JsonPathQuestion;
