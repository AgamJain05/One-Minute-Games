import express from 'express';
const router = express.Router();
import Answer from '../models/Answer.js';
import { getQuestionModel, validateGameId } from '../models/questions/index.js';
import auth from '../middleware/auth.js';

// @route   POST /api/games/:gameId/answers
// @desc    Submit an individual answer
// @access  Private
router.post('/:gameId/answers', auth, async (req, res) => {
  try {
    const { gameId } = req.params;
    const { questionId, userAnswer, sessionId, timeSpent, metadata } = req.body;

    // Validate required fields
    if (!questionId || !userAnswer || !sessionId) {
      return res.status(400).json({ 
        message: 'Missing required fields: questionId, userAnswer, sessionId' 
      });
    }

    if (!validateGameId(gameId)) {
      return res.status(400).json({ message: `Invalid game ID: ${gameId}` });
    }

    // Get the appropriate question model
    const QuestionModel = getQuestionModel(gameId);
    const question = await QuestionModel.findById(questionId);
    
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    // Validate answer based on game-specific logic
    const { isCorrect, correctAnswer, feedback } = validateAnswer(gameId, question, userAnswer);

    // Create answer record
    const answer = new Answer({
      userId: req.userId,
      gameId,
      questionId,
      sessionId,
      userAnswer,
      correctAnswer,
      isCorrect,
      timeSpent: timeSpent || 0,
      metadata: metadata || {}
    });

    await answer.save();

    res.json({ isCorrect, correctAnswer, feedback, answerId: answer._id });
  } catch (error) {
    console.error('Error submitting answer:', error);
    res.status(500).json({ message: 'Server error submitting answer' });
  }
});

// Game-specific validation logic
function validateAnswer(gameId, question, userAnswer) {
  switch(gameId) {
    case 'outputpredictor':
    case 'cssselector':
    case 'datastructure':
    case 'gitcommands':
    case 'httpstatus':
    case 'bigochallenge':
    case 'jsonpath':
      return {
        isCorrect: userAnswer === question.answer,
        correctAnswer: question.answer,
        feedback: userAnswer === question.answer ? 'Correct!' : `Incorrect. The correct answer is: ${question.answer}`
      };

    case 'debugrace':
      return {
        isCorrect: userAnswer === question.fix,
        correctAnswer: question.fix,
        feedback: userAnswer === question.fix ? 'Bug fixed!' : `Incorrect. The correct fix is: ${question.fix}`
      };

    case 'codeblocks':
    case 'flexbox':
      return {
        isCorrect: JSON.stringify(userAnswer) === JSON.stringify(question.blocks || question.items),
        correctAnswer: question.blocks || question.items,
        feedback: JSON.stringify(userAnswer) === JSON.stringify(question.blocks || question.items) ? 'Perfect order!' : 'Incorrect order'
      };

    case 'sqlbuilder':
      return {
        isCorrect: JSON.stringify(userAnswer) === JSON.stringify(question.clauses),
        correctAnswer: question.clauses,
        feedback: JSON.stringify(userAnswer) === JSON.stringify(question.clauses) ? 'Perfect SQL!' : 'Incorrect clause order'
      };

    case 'bugspotter':
      const userBugs = Array.isArray(userAnswer) ? userAnswer : [userAnswer];
      return {
        isCorrect: JSON.stringify(userBugs.sort()) === JSON.stringify(question.bugs.sort()),
        correctAnswer: question.bugs,
        feedback: JSON.stringify(userBugs.sort()) === JSON.stringify(question.bugs.sort()) ? 'All bugs found!' : 'Some bugs were missed'
      };

    case 'regexmatcher':
      return {
        isCorrect: userAnswer === question.matches,
        correctAnswer: question.matches,
        feedback: userAnswer === question.matches ? 'Correct match!' : 'Incorrect match'
      };

    case 'colormatcher':
      return {
        isCorrect: userAnswer === question.hex || userAnswer === question.name,
        correctAnswer: question.hex,
        feedback: (userAnswer === question.hex || userAnswer === question.name) ? 'Correct color!' : 'Incorrect match'
      };

    case 'codetype':
      return {
        isCorrect: userAnswer.isCorrect || false,
        correctAnswer: question.code,
        feedback: userAnswer.isCorrect ? 'Great typing!' : 'Keep practicing'
      };

    case 'apiendpoint':
      return {
        isCorrect: userAnswer === question.answer.fullEndpoint,
        correctAnswer: question.answer.fullEndpoint,
        feedback: userAnswer === question.answer.fullEndpoint ? 'Correct!' : question.explanation || 'Incorrect'
      };

    case 'terminalmaster':
      return {
        isCorrect: userAnswer === question.answer,
        correctAnswer: question.answer,
        feedback: userAnswer === question.answer ? question.explanation || 'Correct!' : question.hint || 'Incorrect'
      };

    case 'codewarriors':
      return {
        isCorrect: userAnswer === question.answer,
        correctAnswer: question.answer,
        feedback: userAnswer === question.answer ? 'Correct!' : 'Incorrect answer'
      };
    
    default:
      return {
        isCorrect: false,
        correctAnswer: null,
        feedback: 'Validation not implemented for this game type'
      };
  }
}

// @route   GET /api/games/:gameId/sessions/:sessionId/answers
// @desc    Get all answers for a game session
// @access  Private
router.get('/:gameId/sessions/:sessionId/answers', auth, async (req, res) => {
  try {
    const { sessionId } = req.params;

    // Verify this session belongs to the authenticated user
    const firstAnswer = await Answer.findOne({ sessionId });
    if (firstAnswer && firstAnswer.userId.toString() !== req.userId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const answers = await Answer.getSessionAnswers(sessionId);
    const stats = await Answer.getSessionStats(sessionId);

    res.json({
      answers,
      stats
    });
  } catch (error) {
    console.error('Error fetching session answers:', error);
    res.status(500).json({ message: 'Server error fetching session answers' });
  }
});

export default router;
