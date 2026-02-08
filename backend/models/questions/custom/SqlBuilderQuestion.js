import mongoose from 'mongoose';
import { baseQuestionSchema, baseQuestionMethods } from '../base/BaseQuestion.js';

const sqlBuilderSchema = new mongoose.Schema({
  ...baseQuestionSchema,
  gameId: { type: String, default: 'sqlbuilder', immutable: true },
  description: {
    type: String,
    required: true
  },
  clauses: {
    type: [String],
    required: true,
    validate: {
      validator: (v) => v.length >= 2,
      message: 'Must have at least 2 SQL clauses'
    }
  }
}, { timestamps: true });

// Apply base methods
Object.assign(sqlBuilderSchema.statics, baseQuestionMethods.static);

const SqlBuilderQuestion = mongoose.model('SqlBuilderQuestion', sqlBuilderSchema);
export default SqlBuilderQuestion;
