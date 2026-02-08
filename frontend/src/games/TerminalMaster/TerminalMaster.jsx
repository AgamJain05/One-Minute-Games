import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Terminal as TerminalIcon, 
  BookOpen, 
  Zap, 
  Trophy,
  ArrowRight,
  CheckCircle2,
  XCircle,
  Lightbulb,
  Brain,
  Target,
  Sparkles
} from 'lucide-react';
import { useAuthStore } from '@store/authStore';
import { questionsAPI, answersAPI, scoresAPI } from '@services/api';
import Results from './components/Results';

export default function TerminalMaster() {
  const { user } = useAuthStore();
  // Game state
  const [gameMode, setGameMode] = useState(null); // null = menu, 'scenario', 'builder', 'quickfire'
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [gameStartTime, setGameStartTime] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [answers, setAnswers] = useState([]);
  
  // Mode-specific state
  const [currentData, setCurrentData] = useState([]);
  const [shuffledOptions, setShuffledOptions] = useState([]);
  const [showHint, setShowHint] = useState(false);
  const [showMnemonic, setShowMnemonic] = useState(false);
  
  // API state
  const [questionCount, setQuestionCount] = useState(0);
  const [sessionId] = useState(() => crypto.randomUUID());
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());

  // Fetch question count on mount
  useEffect(() => {
    const fetchCount = async () => {
      try {
        const res = await questionsAPI.getCount('terminalmaster');
        setQuestionCount(res.data.count);
      } catch (error) {
        console.error('Failed to fetch question count:', error);
      }
    };
    fetchCount();
  }, []);

  // Start game based on mode
  const startGame = async (mode) => {
    setGameMode(mode);
    setCurrentQuestion(0);
    setScore(0);
    setStreak(0);
    setGameStartTime(Date.now());
    setShowResults(false);
    setAnswers([]);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setShowHint(false);
    setShowMnemonic(false);
    setQuestionStartTime(Date.now());

    // Set data based on mode
    let data = [];
    
    if (mode === 'scenario') {
      // Try to load from API for scenario mode
      try {
        const res = await questionsAPI.getQuestions('terminalmaster', 15);
        if (res.data.questions && res.data.questions.length > 0) {
          // Transform API questions to match local format
          data = res.data.questions.map(q => {
            const questionData = q.data || q;
            return {
              ...q, // Preserve _id and other MongoDB fields
              ...questionData,
              options: questionData.options || []
            };
          });
        } else {
          // Fallback to local data
          data = [...[]].sort(() => Math.random() - 0.5).slice(0, 15);
        }
      } catch (error) {
        console.error('Failed to load questions:', error);
        // Fallback to local data
        data = [...[]].sort(() => Math.random() - 0.5).slice(0, 15);
      }
    } else if (mode === 'builder') {
      data = [...[]].sort(() => Math.random() - 0.5).slice(0, 10);
    } else if (mode === 'quickfire') {
      data = [...[]].sort(() => Math.random() - 0.5).slice(0, 20);
    }
    
    setCurrentData(data);
    
    // Shuffle options for current question
    if (mode === 'scenario' && data[0] && data[0].options) {
      setShuffledOptions([...data[0].options].sort(() => Math.random() - 0.5));
    }
  };

  // Handle answer selection
  const handleAnswer = async (answer) => {
    if (selectedAnswer) return; // Prevent multiple answers

    const current = currentData[currentQuestion];
    const isCorrect = answer === current.answer;
    
    setSelectedAnswer(answer);
    setShowExplanation(true);

    if (isCorrect) {
      const points = 100 + (streak * 10);
      setScore(prev => prev + points);
      setStreak(prev => prev + 1);
      setAnswers(prev => [...prev, { correct: true, question: current.question || current.scenario, answer }]);
    } else {
      setStreak(0);
      setAnswers(prev => [...prev, { correct: false, question: current.question || current.scenario, answer, correctAnswer: current.answer }]);
    }

    // Submit answer if user is logged in and question is from API (scenario mode)
    if (user && gameMode === 'scenario' && current._id) {
      try {
        await answersAPI.submit('terminalmaster', {
          questionId: current._id,
          userAnswer: answer,
          sessionId,
          timeSpent: Date.now() - questionStartTime,
          metadata: { streak, isCorrect, gameMode }
        });
      } catch (error) {
        console.error('Failed to submit answer:', error);
      }
    }

    setQuestionStartTime(Date.now());
  };

  // Move to next question
  const nextQuestion = () => {
    if (currentQuestion < currentData.length - 1) {
      const nextIdx = currentQuestion + 1;
      setCurrentQuestion(nextIdx);
      setSelectedAnswer(null);
      setShowExplanation(false);
      setShowHint(false);
      setShowMnemonic(false);
      setQuestionStartTime(Date.now());
      
      // Shuffle options for next question
      if (gameMode === 'scenario' && currentData[nextIdx] && currentData[nextIdx].options) {
        setShuffledOptions([...currentData[nextIdx].options].sort(() => Math.random() - 0.5));
      }
    } else {
      // Submit score when game ends
      if (user) {
        const accuracy = currentData.length > 0 
          ? Math.round((answers.filter(a => a.correct).length / currentData.length) * 100) 
          : 0;
        scoresAPI.submit({
          gameId: 'terminalmaster',
          score,
          accuracy,
          correctAnswers: answers.filter(a => a.correct).length,
          totalAttempts: currentData.length,
          metadata: { sessionId, gameMode }
        }).catch(err => console.error('Failed to submit score:', err));
      }
      // Game over
      setShowResults(true);
    }
  };

  // Reset game
  const resetGame = () => {
    setGameMode(null);
    setCurrentQuestion(0);
    setScore(0);
    setStreak(0);
    setShowResults(false);
    setAnswers([]);
  };

  if (showResults) {
    const correctAnswers = answers.filter(a => a.correct).length;
    const accuracy = currentData.length > 0 
      ? Math.round((correctAnswers / currentData.length) * 100) 
      : 0;
    return (
      <Results
        score={score}
        correct={correctAnswers}
        total={currentData.length}
        accuracy={accuracy}
        onPlayAgain={resetGame}
        onGoHome={resetGame}
      />
    );
  }

  // Mode selection menu
  if (!gameMode) {
    return (
      <div className="space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <TerminalIcon className="w-12 h-12 text-primary" />
            <h1 className="text-4xl font-bold text-gradient">Terminal Master</h1>
          </div>
          <p className="text-xl text-gray-300">
            Master terminal commands for life! 🚀
          </p>
          <p className="text-gray-400 mt-2">
            Choose your learning mode below
          </p>
          {questionCount > 0 && (
            <p className="text-primary text-sm mt-2">
              {questionCount} questions available
            </p>
          )}
        </motion.div>

        {/* Mode Selection Cards */}
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {/* Scenario Mode */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            onClick={() => startGame('scenario')}
            className="card hover:border-primary cursor-pointer group transition-all"
          >
            <div className="flex items-start gap-4">
              <div className="p-3 bg-primary bg-opacity-20 rounded-lg group-hover:scale-110 transition-transform">
                <BookOpen className="w-8 h-8 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold mb-2 flex items-center gap-2">
                  Scenario Master
                  <span className="text-xs bg-success px-2 py-1 rounded">BEST FOR LEARNING</span>
                </h3>
                <p className="text-gray-400 mb-3">
                  Real-world situations that teach you WHEN and WHY to use each command
                </p>
                <ul className="space-y-1 text-sm text-gray-300">
                  <li>✅ 15 practical scenarios</li>
                  <li>✅ Memory aids & mnemonics</li>
                  <li>✅ Real examples & use cases</li>
                  <li>✅ Learn context, not just commands</li>
                </ul>
                <div className="mt-4 flex items-center gap-2 text-primary font-semibold">
                  Start Learning <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Builder Mode */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            onClick={() => startGame('builder')}
            className="card hover:border-warning cursor-pointer group transition-all"
          >
            <div className="flex items-start gap-4">
              <div className="p-3 bg-warning bg-opacity-20 rounded-lg group-hover:scale-110 transition-transform">
                <Target className="w-8 h-8 text-warning" />
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold mb-2 flex items-center gap-2">
                  Command Builder
                  <span className="text-xs bg-warning px-2 py-1 rounded">INTERMEDIATE</span>
                </h3>
                <p className="text-gray-400 mb-3">
                  Construct complex commands with flags, pipes, and options
                </p>
                <ul className="space-y-1 text-sm text-gray-300">
                  <li>✅ 10 building challenges</li>
                  <li>✅ Learn flags & options</li>
                  <li>✅ Master pipes & chains</li>
                  <li>✅ Real-world command combos</li>
                </ul>
                <div className="mt-4 flex items-center gap-2 text-warning font-semibold">
                  Build Commands <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Quick Fire Mode */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            onClick={() => startGame('quickfire')}
            className="card hover:border-danger cursor-pointer group transition-all"
          >
            <div className="flex items-start gap-4">
              <div className="p-3 bg-danger bg-opacity-20 rounded-lg group-hover:scale-110 transition-transform">
                <Zap className="w-8 h-8 text-danger" />
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold mb-2 flex items-center gap-2">
                  Quick Fire
                  <span className="text-xs bg-danger px-2 py-1 rounded">FAST RECALL</span>
                </h3>
                <p className="text-gray-400 mb-3">
                  Rapid-fire command recall to build muscle memory
                </p>
                <ul className="space-y-1 text-sm text-gray-300">
                  <li>✅ 20 rapid questions</li>
                  <li>✅ Test your memory</li>
                  <li>✅ Build instant recall</li>
                  <li>✅ Perfect for review</li>
                </ul>
                <div className="mt-4 flex items-center gap-2 text-danger font-semibold">
                  Test Yourself <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Coming Soon: Sequence Master */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="card border-gray-700 opacity-60 relative overflow-hidden"
          >
            <div className="absolute top-2 right-2 bg-gray-700 text-gray-300 px-3 py-1 rounded-full text-xs font-bold">
              COMING SOON
            </div>
            <div className="flex items-start gap-4">
              <div className="p-3 bg-gray-700 rounded-lg">
                <Trophy className="w-8 h-8 text-gray-500" />
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold mb-2 text-gray-500">
                  Sequence Master
                </h3>
                <p className="text-gray-500 mb-3">
                  Multi-step command sequences for advanced workflows
                </p>
                <ul className="space-y-1 text-sm text-gray-500">
                  <li>⏳ Chain multiple commands</li>
                  <li>⏳ Real project workflows</li>
                  <li>⏳ Automation patterns</li>
                  <li>⏳ Expert-level challenges</li>
                </ul>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Learning Tips */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="card bg-primary bg-opacity-10 border-primary max-w-4xl mx-auto"
        >
          <div className="flex items-start gap-4">
            <Brain className="w-8 h-8 text-primary flex-shrink-0" />
            <div>
              <h3 className="text-xl font-bold mb-2">💡 Learning Tips</h3>
              <ul className="space-y-2 text-gray-300">
                <li><strong>Start with Scenarios</strong> - Learn the "why" behind each command</li>
                <li><strong>Use Memory Aids</strong> - Mnemonics make commands unforgettable</li>
                <li><strong>Practice Daily</strong> - 5 minutes a day builds lifetime memory</li>
                <li><strong>Apply Immediately</strong> - Use commands in your actual workflow</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  // Get current question data
  const current = currentData[currentQuestion];
  if (!current) return null;

  // Render based on game mode
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button onClick={resetGame} className="text-gray-400 hover:text-white transition-colors">
          ← Back to Menu
        </button>
        <div className="flex items-center gap-6">
          <div className="text-center">
            <div className="text-sm text-gray-400">Question</div>
            <div className="text-2xl font-bold text-primary">
              {currentQuestion + 1} / {currentData.length}
            </div>
          </div>
          <div className="text-center">
            <div className="text-sm text-gray-400">Score</div>
            <div className="text-2xl font-bold text-warning">{score}</div>
          </div>
          {streak > 1 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="text-center"
            >
              <div className="text-sm text-gray-400">Streak</div>
              <div className="text-2xl font-bold text-danger flex items-center gap-1">
                🔥 {streak}
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Scenario Mode Questions */}
      {gameMode === 'scenario' && (
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="space-y-6"
          >
            {/* Scenario Card */}
            <div className="card bg-gradient-to-br from-primary/10 to-transparent border-primary">
              <div className="flex items-start gap-3 mb-4">
                <span className="text-3xl">{current.situation.match(/[🏠📂🚀📁📄💾🐌⬇️🔍📝🔐]/)?.[0] || '💻'}</span>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-3 py-1 bg-primary bg-opacity-20 text-primary rounded-full text-sm font-bold">
                      {current.level.toUpperCase()}
                    </span>
                    <span className="text-gray-400">{current.category}</span>
                  </div>
                  <h2 className="text-xl font-bold mb-2">Situation:</h2>
                  <p className="text-gray-300 text-lg">{current.situation}</p>
                </div>
              </div>
            </div>

            {/* Question */}
            <div className="card">
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <TerminalIcon className="w-6 h-6 text-warning" />
                {current.question}
              </h3>

              {/* Options */}
              <div className="grid grid-cols-2 gap-4">
                {shuffledOptions.map((option, idx) => {
                  const isSelected = selectedAnswer === option;
                  const isCorrect = option === current.answer;
                  const showResult = selectedAnswer !== null;

                  let buttonClass = 'btn-secondary text-left';
                  if (showResult) {
                    if (isSelected && isCorrect) {
                      buttonClass = 'bg-success border-success text-white';
                    } else if (isSelected && !isCorrect) {
                      buttonClass = 'bg-danger border-danger text-white';
                    } else if (isCorrect) {
                      buttonClass = 'bg-success bg-opacity-30 border-success text-success';
                    }
                  }

                  return (
                    <motion.button
                      key={idx}
                      whileHover={{ scale: selectedAnswer ? 1 : 1.02 }}
                      whileTap={{ scale: selectedAnswer ? 1 : 0.98 }}
                      onClick={() => handleAnswer(option)}
                      disabled={selectedAnswer !== null}
                      className={`${buttonClass} p-4 font-mono text-lg flex items-center justify-between`}
                    >
                      <span>{option}</span>
                      {showResult && isCorrect && <CheckCircle2 className="w-5 h-5" />}
                      {showResult && isSelected && !isCorrect && <XCircle className="w-5 h-5" />}
                    </motion.button>
                  );
                })}
              </div>

              {/* Help Buttons */}
              {!selectedAnswer && (
                <div className="flex gap-4 mt-6">
                  <button
                    onClick={() => setShowHint(!showHint)}
                    className="btn-secondary flex items-center gap-2"
                  >
                    <Lightbulb className="w-4 h-4" />
                    {showHint ? 'Hide' : 'Show'} Hint
                  </button>
                  <button
                    onClick={() => setShowMnemonic(!showMnemonic)}
                    className="btn-secondary flex items-center gap-2"
                  >
                    <Brain className="w-4 h-4" />
                    {showMnemonic ? 'Hide' : 'Show'} Memory Aid
                  </button>
                </div>
              )}

              {/* Hint */}
              {showHint && !selectedAnswer && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 p-4 bg-warning bg-opacity-10 border border-warning rounded-lg"
                >
                  <div className="flex items-start gap-2">
                    <Lightbulb className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold text-warning mb-1">Hint:</div>
                      <div className="text-gray-300">{current.hint}</div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Mnemonic */}
              {showMnemonic && !selectedAnswer && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 p-4 bg-primary bg-opacity-10 border border-primary rounded-lg"
                >
                    <div className="flex items-start gap-3">
                    <span className="text-3xl">{({}[current.answer] || {}).visual}</span>
                    <div>
                      <div className="font-bold text-primary mb-1 flex items-center gap-2">
                        <Brain className="w-4 h-4" />
                        Memory Aid:
                      </div>
                      <div className="text-lg font-bold text-warning mb-1">
                        {current.mnemonic}
                      </div>
                      <div className="text-gray-400 text-sm">
                        {({}[current.answer] || {}).story}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Explanation */}
              {showExplanation && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-6 space-y-4"
                >
                  {/* Result */}
                  <div className={`p-4 rounded-lg border-2 ${
                    selectedAnswer === current.answer
                      ? 'bg-success bg-opacity-10 border-success'
                      : 'bg-danger bg-opacity-10 border-danger'
                  }`}>
                    <div className="flex items-center gap-2 mb-2">
                      {selectedAnswer === current.answer ? (
                        <>
                          <CheckCircle2 className="w-6 h-6 text-success" />
                          <span className="text-xl font-bold text-success">Correct!</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-6 h-6 text-danger" />
                          <span className="text-xl font-bold text-danger">Not quite!</span>
                        </>
                      )}
                    </div>
                    <p className="text-gray-300">{current.explanation}</p>
                  </div>

                  {/* Use Case */}
                  <div className="p-4 bg-dark-bg rounded-lg">
                    <div className="font-bold mb-2">💼 When to use this:</div>
                    <p className="text-gray-300">{current.useCase}</p>
                  </div>

                  {/* Real Example */}
                  <div className="p-4 bg-dark-card rounded-lg">
                    <div className="font-bold mb-2">📟 Real Example:</div>
                    <pre className="text-success font-mono text-sm whitespace-pre-wrap">
                      {current.realExample}
                    </pre>
                  </div>

                  {/* Next Button */}
                  <button
                    onClick={nextQuestion}
                    className="btn-primary w-full flex items-center justify-center gap-2"
                  >
                    {currentQuestion < currentData.length - 1 ? (
                      <>Next Scenario <ArrowRight /></>
                    ) : (
                      <>See Results <Trophy /></>
                    )}
                  </button>
                </motion.div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      )}

      {/* Quick Fire Mode */}
      {gameMode === 'quickfire' && (
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="space-y-6"
          >
            <div className="card text-center max-w-2xl mx-auto">
              <div className="mb-6">
                <h2 className="text-3xl font-bold mb-4 text-gradient">What does this command do?</h2>
                <div className="p-6 bg-dark-card rounded-lg border-2 border-primary">
                  <code className="text-5xl font-mono font-bold text-primary">
                    {current.cmd}
                  </code>
                </div>
              </div>

              {!selectedAnswer ? (
                <button
                  onClick={() => {
                    setSelectedAnswer(current.cmd);
                    setShowExplanation(true);
                  }}
                  className="btn-primary px-8 py-4 text-lg"
                >
                  <Sparkles className="inline w-5 h-5 mr-2" />
                  Reveal Answer
                </button>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  <div className="p-6 bg-success bg-opacity-10 border-2 border-success rounded-lg text-left">
                    <div className="font-bold text-success text-xl mb-2">
                      {current.cmd} = {current.meaning}
                    </div>
                    <div className="text-gray-300">
                      <strong>Use Case:</strong> {current.useCase}
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <button
                      onClick={() => {
                        handleAnswer(current.cmd); // Mark as correct
                        setTimeout(nextQuestion, 500);
                      }}
                      className="flex-1 btn-success flex items-center justify-center gap-2"
                    >
                      <CheckCircle2 className="w-5 h-5" />
                      I Knew It!
                    </button>
                    <button
                      onClick={() => {
                        setStreak(0); // Reset streak
                        setTimeout(nextQuestion, 500);
                      }}
                      className="flex-1 btn-secondary flex items-center justify-center gap-2"
                    >
                      <XCircle className="w-5 h-5" />
                      I Didn't Know
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      )}

      {/* Builder Mode - Coming in next iteration */}
      {gameMode === 'builder' && (
        <div className="card text-center">
          <h2 className="text-2xl font-bold mb-4">Command Builder Mode</h2>
          <p className="text-gray-400 mb-6">
            This advanced mode is under construction! 🚧
          </p>
          <button onClick={resetGame} className="btn-primary">
            Back to Menu
          </button>
        </div>
      )}
    </div>
  );
}
