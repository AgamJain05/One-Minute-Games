import mongoose from 'mongoose';
import { baseQuestionSchema, baseQuestionMethods } from '../base/BaseQuestion.js';

const codeBlocksSchema = new mongoose.Schema({
  ...baseQuestionSchema,
  gameId: { type: String, default: 'codeblocks', immutable: true },
  description: {
    type: String,
    required: true
  },
  blocks: {
    type: [String],
    required: true,
    validate: {
      validator: (v) => v.length >= 2,
      message: 'Must have at least 2 blocks'
    }
  }
}, { timestamps: true });

// Apply base methods
Object.assign(codeBlocksSchema.statics, baseQuestionMethods.static);

const CodeBlocksQuestion = mongoose.model('CodeBlocksQuestion', codeBlocksSchema);
export default CodeBlocksQuestion;
