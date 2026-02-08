import mongoose from 'mongoose';
import { baseQuestionSchema, baseQuestionMethods } from '../base/BaseQuestion.js';

const colorMatcherSchema = new mongoose.Schema({
  ...baseQuestionSchema,
  gameId: { type: String, default: 'colormatcher', immutable: true },
  hex: {
    type: String,
    required: true
  },
  code: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  options: {
    type: [String],
    required: true,
    validate: {
      validator: (v) => v.length >= 2,
      message: 'Must have at least 2 options'
    }
  }
}, { timestamps: true });

// Apply base methods
Object.assign(colorMatcherSchema.statics, baseQuestionMethods.static);

const ColorMatcherQuestion = mongoose.model('ColorMatcherQuestion', colorMatcherSchema);
export default ColorMatcherQuestion;
