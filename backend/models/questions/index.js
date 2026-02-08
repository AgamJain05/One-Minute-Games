// Import all question models
import OutputPredictorQuestion from './qa/OutputPredictorQuestion.js';
import CssSelectorQuestion from './qa/CssSelectorQuestion.js';
import DataStructureQuestion from './qa/DataStructureQuestion.js';
import GitCommandsQuestion from './qa/GitCommandsQuestion.js';
import HttpStatusQuestion from './qa/HttpStatusQuestion.js';
import BigOChallengeQuestion from './qa/BigOChallengeQuestion.js';
import DebugRaceQuestion from './qa/DebugRaceQuestion.js';
import JsonPathQuestion from './qa/JsonPathQuestion.js';
import ColorMatcherQuestion from './matching/ColorMatcherQuestion.js';
import RegexMatcherQuestion from './matching/RegexMatcherQuestion.js';
import FlexboxQuestion from './sorting/FlexboxQuestion.js';
import CodeBlocksQuestion from './sorting/CodeBlocksQuestion.js';
import BugSpotterQuestion from './code-analysis/BugSpotterQuestion.js';
import CodeTypeQuestion from './code-analysis/CodeTypeQuestion.js';
import ApiEndpointQuestion from './complex/ApiEndpointQuestion.js';
import TerminalMasterQuestion from './complex/TerminalMasterQuestion.js';
import CodeWarriorsQuestion from './custom/CodeWarriorsQuestion.js';
import SqlBuilderQuestion from './custom/SqlBuilderQuestion.js';

// Model registry
export const QuestionModels = {
  outputpredictor: OutputPredictorQuestion,
  cssselector: CssSelectorQuestion,
  datastructure: DataStructureQuestion,
  gitcommands: GitCommandsQuestion,
  httpstatus: HttpStatusQuestion,
  bigochallenge: BigOChallengeQuestion,
  debugrace: DebugRaceQuestion,
  jsonpath: JsonPathQuestion,
  colormatcher: ColorMatcherQuestion,
  regexmatcher: RegexMatcherQuestion,
  flexbox: FlexboxQuestion,
  codeblocks: CodeBlocksQuestion,
  bugspotter: BugSpotterQuestion,
  codetype: CodeTypeQuestion,
  apiendpoint: ApiEndpointQuestion,
  terminalmaster: TerminalMasterQuestion,
  codewarriors: CodeWarriorsQuestion,
  sqlbuilder: SqlBuilderQuestion
};

// Factory function
export function getQuestionModel(gameId) {
  const model = QuestionModels[gameId];
  if (!model) {
    throw new Error(`No question model found for game: ${gameId}`);
  }
  return model;
}

// Validation helper
export function validateGameId(gameId) {
  return Object.keys(QuestionModels).includes(gameId);
}
