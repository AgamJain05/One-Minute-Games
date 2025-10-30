import { motion } from 'framer-motion';
import { Trophy, Target, CheckCircle, Clock, Server, RotateCcw } from 'lucide-react';

export default function Results({ 
  score, 
  totalQuestions, 
  correctAnswers, 
  timeTaken, 
  onPlayAgain, 
  answers 
}) {
  const accuracy = Math.round((correctAnswers / totalQuestions) * 100);
  const minutes = Math.floor(timeTaken / 60);
  const seconds = timeTaken % 60;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="space-y-8 max-w-4xl mx-auto"
    >
      {/* Header */}
      <div className="text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="text-7xl mb-4"
        >
          {accuracy >= 80 ? '🎉' : accuracy >= 60 ? '👏' : '💪'}
        </motion.div>
        <h2 className="text-4xl font-bold mb-2 text-gradient">
          {accuracy >= 80 ? 'Excellent!' : accuracy >= 60 ? 'Good Job!' : 'Keep Learning!'}
        </h2>
        <p className="text-xl text-gray-300">
          {accuracy >= 80 
            ? 'You\'re thinking like a backend pro!' 
            : accuracy >= 60 
            ? 'You\'re getting the hang of API design!' 
            : 'Practice makes perfect!'}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card text-center"
        >
          <Trophy className="w-10 h-10 text-warning mx-auto mb-3" />
          <div className="text-4xl font-bold text-warning mb-1">{score}</div>
          <div className="text-sm text-gray-400">Total Score</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card text-center"
        >
          <CheckCircle className="w-10 h-10 text-success mx-auto mb-3" />
          <div className="text-4xl font-bold text-success mb-1">
            {correctAnswers}/{totalQuestions}
          </div>
          <div className="text-sm text-gray-400">Correct Answers</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card text-center"
        >
          <Target className="w-10 h-10 text-primary mx-auto mb-3" />
          <div className="text-4xl font-bold text-primary mb-1">{accuracy}%</div>
          <div className="text-sm text-gray-400">Accuracy</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="card text-center"
        >
          <Clock className="w-10 h-10 text-info mx-auto mb-3" />
          <div className="text-4xl font-bold text-info mb-1">
            {minutes > 0 ? `${minutes}:${seconds.toString().padStart(2, '0')}` : `${seconds}s`}
          </div>
          <div className="text-sm text-gray-400">Time Taken</div>
        </motion.div>
      </div>

      {/* Performance Message */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className={`card ${
          accuracy >= 80 
            ? 'bg-success bg-opacity-10 border-success' 
            : accuracy >= 60 
            ? 'bg-warning bg-opacity-10 border-warning' 
            : 'bg-primary bg-opacity-10 border-primary'
        }`}
      >
        <div className="flex items-start gap-4">
          <Server className={`w-8 h-8 flex-shrink-0 ${
            accuracy >= 80 ? 'text-success' : accuracy >= 60 ? 'text-warning' : 'text-primary'
          }`} />
          <div>
            <h3 className="font-bold text-lg mb-2">
              {accuracy >= 80 && '🌟 Outstanding API Design Skills!'}
              {accuracy >= 60 && accuracy < 80 && '📈 You\'re Making Progress!'}
              {accuracy < 60 && '💡 Keep Learning!'}
            </h3>
            <p className="text-gray-300">
              {accuracy >= 80 && 'You understand REST principles, HTTP methods, and URL patterns. You\'re ready to design real APIs!'}
              {accuracy >= 60 && accuracy < 80 && 'You\'re grasping the concepts. Review the scenarios you missed and try again to master API design.'}
              {accuracy < 60 && 'API design takes practice. Review the explanations, understand the patterns, and try again. You\'ll get there!'}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Review Answers */}
      {answers.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="card"
        >
          <h3 className="text-2xl font-bold mb-4">Review Your Answers</h3>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {answers.map((answer, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-lg border-2 ${
                  answer.correct
                    ? 'bg-success bg-opacity-10 border-success'
                    : 'bg-danger bg-opacity-10 border-danger'
                }`}
              >
                <div className="flex items-start gap-3">
                  {answer.correct ? (
                    <CheckCircle className="w-5 h-5 text-success flex-shrink-0 mt-1" />
                  ) : (
                    <Target className="w-5 h-5 text-danger flex-shrink-0 mt-1" />
                  )}
                  <div className="flex-1">
                    <div className="text-sm text-gray-400 mb-1">Question {idx + 1}</div>
                    <div className="text-white mb-2">{answer.question}</div>
                    <div className="flex flex-wrap gap-2 items-center">
                      <span className="text-sm text-gray-400">Your answer:</span>
                      <code className={`px-3 py-1 rounded font-mono text-sm ${
                        answer.correct ? 'bg-success text-white' : 'bg-danger text-white'
                      }`}>
                        {answer.answer}
                      </code>
                      {!answer.correct && answer.correctAnswer && (
                        <>
                          <span className="text-sm text-gray-400">Correct:</span>
                          <code className="px-3 py-1 rounded font-mono text-sm bg-success text-white">
                            {answer.correctAnswer}
                          </code>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="flex gap-4 justify-center pt-4"
      >
        <button
          onClick={onPlayAgain}
          className="btn-primary px-8 py-3 flex items-center gap-2"
        >
          <RotateCcw className="w-5 h-5" />
          Play Again
        </button>
      </motion.div>

      {/* Tips */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="card bg-dark-card text-center"
      >
        <h4 className="font-bold mb-3">💡 Pro Tips for API Design</h4>
        <div className="grid md:grid-cols-2 gap-4 text-left text-sm text-gray-300">
          <div>
            <strong className="text-primary">GET:</strong> Use for reading data, no body needed
          </div>
          <div>
            <strong className="text-primary">POST:</strong> Creates new resources, data in body
          </div>
          <div>
            <strong className="text-warning">PUT:</strong> Replaces entire resource with new data
          </div>
          <div>
            <strong className="text-info">PATCH:</strong> Updates only specific fields
          </div>
          <div>
            <strong className="text-danger">DELETE:</strong> Removes resource permanently
          </div>
          <div>
            <strong className="text-success">REST:</strong> Use plural nouns, no verbs in URLs
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}





