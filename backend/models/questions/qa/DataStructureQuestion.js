import mongoose from 'mongoose';
import { baseQuestionSchema, baseQuestionMethods } from '../base/BaseQuestion.js';

const dataStructureSchema = new mongoose.Schema({
  ...baseQuestionSchema,
  gameId: { type: String, default: 'datastructure', immutable: true },
  type: String,
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
Object.assign(dataStructureSchema.statics, baseQuestionMethods.static);

const DataStructureQuestion = mongoose.model('DataStructureQuestion', dataStructureSchema);
export default DataStructureQuestion;
