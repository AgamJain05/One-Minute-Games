import mongoose from 'mongoose';
import { baseQuestionSchema, baseQuestionMethods } from '../base/BaseQuestion.js';

const flexboxSchema = new mongoose.Schema({
  ...baseQuestionSchema,
  gameId: { type: String, default: 'flexbox', immutable: true },
  description: {
    type: String,
    required: true
  },
  items: {
    type: [String],
    required: true,
    validate: {
      validator: (v) => v.length >= 2,
      message: 'Must have at least 2 items'
    }
  }
}, { timestamps: true });

// Apply base methods
Object.assign(flexboxSchema.statics, baseQuestionMethods.static);

const FlexboxQuestion = mongoose.model('FlexboxQuestion', flexboxSchema);
export default FlexboxQuestion;
