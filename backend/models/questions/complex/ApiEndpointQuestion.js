import mongoose from 'mongoose';
import { baseQuestionSchema, baseQuestionMethods } from '../base/BaseQuestion.js';

const apiEndpointSchema = new mongoose.Schema({
  ...baseQuestionSchema,
  gameId: { type: String, default: 'apiendpoint', immutable: true },
  questionId: Number, // Original ID from data.js
  category: {
    type: String,
    required: true
  },
  story: {
    type: String,
    required: true
  },
  problem: {
    type: String,
    required: true
  },
  context: {
    database: String,
    action: String,
    dataFlow: String
  },
  answer: {
    method: { type: String, required: true },
    path: { type: String, required: true },
    fullEndpoint: { type: String, required: true }
  },
  wrongAnswers: [{
    method: String,
    path: String,
    fullEndpoint: String
  }],
  explanation: String,
  why: String,
  example: {
    request: String,
    response: String
  },
  tip: String,
  commonMistake: String
}, { timestamps: true });

// Apply base methods
Object.assign(apiEndpointSchema.statics, baseQuestionMethods.static);

const ApiEndpointQuestion = mongoose.model('ApiEndpointQuestion', apiEndpointSchema);
export default ApiEndpointQuestion;
