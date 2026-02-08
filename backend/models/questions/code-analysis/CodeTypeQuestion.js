import mongoose from 'mongoose';
import { baseQuestionSchema, baseQuestionMethods } from '../base/BaseQuestion.js';

const codeTypeSchema = new mongoose.Schema({
  ...baseQuestionSchema,
  gameId: { type: String, default: 'codetype', immutable: true },
  language: {
    type: String,
    required: true
  },
  code: {
    type: String, // Code as single string
    required: true
  }
}, { timestamps: true });

// Apply base methods
Object.assign(codeTypeSchema.statics, baseQuestionMethods.static);

const CodeTypeQuestion = mongoose.model('CodeTypeQuestion', codeTypeSchema);
export default CodeTypeQuestion;
