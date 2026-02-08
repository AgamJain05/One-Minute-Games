import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Code, 
  Zap, 
  CheckCircle2, 
  XCircle, 
  Lightbulb,
  Database,
  ArrowRight,
  Server,
  AlertTriangle,
  BookOpen
} from 'lucide-react';
import { useAuthStore } from '@store/authStore';
import { questionsAPI, answersAPI, scoresAPI } from '@services/api';
import Results from './components/Results';

export default function ApiEndpoint() {
  const { user } = useAuthStore();
  
  const [gameStarted, setGameStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [gameStartTime, setGameStartTime] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [answers, setAnswers] = useState([]);
  
  // Randomized questions
  const [questions, setQuestions] = useState([]);
  const [allOptions, setAllOptions] = useState([]);
  const [showTip, setShowTip] = useState(false);
  const [showMethodGuide, setShowMethodGuide] = useState(false);
  
  // API integration state
  const [questionCount, setQuestionCount] = useState(0);
  const [sessionId] = useState(() => crypto.randomUUID());
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());

  // Fetch question count on mount
  useEffect(() => {
    const fetchCount = async () => {
      try {
        const res = await questionsAPI.getCount('apiendpoint');
        setQuestionCount(res.data.count);
      } catch (error) {
        console.error('Failed to fetch question count:', error);
      }
    };
    fetchCount();
  }, []);

  // Start game
  const startGame = async () => {
    let loadedQuestions = [];
    
    try {
      const res = await questionsAPI.getQuestions('apiendpoint', 15);
      if (res.data.questions && res.data.questions.length > 0) {
        // Transform API questions to match local format
        loadedQuestions = res.data.questions.map(q => {
          const data = q.data || q;
          return {
            ...q, // Preserve _id and other MongoDB fields
            ...data,
            answer: data.answer || { fullEndpoint: data.correctAnswer },
            wrongAnswers: data.wrongAnswers || []
          };
        });
      } else {
        // Fallback to local data
        loadedQuestions = [...[]].sort(() => Math.random() - 0.5).slice(0, 15);
      }
    } catch (error) {
      console.error('Failed to load questions:', error);
      // Fallback to local data
      loadedQuestions = [...[]].sort(() => Math.random() - 0.5).slice(0, 15);
    }

    setQuestions(loadedQuestions);
    setGameStarted(true);
    setCurrentQuestion(0);
    setScore(0);
    setStreak(0);
    setGameStartTime(Date.now());
    setShowResults(false);
    setAnswers([]);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setShowTip(false);
    setQuestionStartTime(Date.now());
    
    // Shuffle options for first question
    if (loadedQuestions[0]) {
      const firstOptions = [
        loadedQuestions[0].answer,
        ...loadedQuestions[0].wrongAnswers
      ].sort(() => Math.random() - 0.5);
      setAllOptions(firstOptions);
    }
  };

  // Handle answer selection
  const handleAnswer = async (answer) => {
    if (selectedAnswer) return;

    const current = questions[currentQuestion];
    const isCorrect = answer.fullEndpoint === current.answer.fullEndpoint;
    
    setSelectedAnswer(answer);
    setShowExplanation(true);

    if (isCorrect) {
      const points = 100 + (streak * 10);
      setScore(prev => prev + points);
      setStreak(prev => prev + 1);
      setAnswers(prev => [...prev, { 
        correct: true, 
        question: current.story,
        answer: answer.fullEndpoint 
      }]);
    } else {
      setStreak(0);
      setAnswers(prev => [...prev, { 
        correct: false, 
        question: current.story,
        answer: answer.fullEndpoint,
        correctAnswer: current.answer.fullEndpoint 
      }]);
    }

    // Submit answer to API if user is logged in and question has ID
    if (user && current._id) {
      try {
        await answersAPI.submit('apiendpoint', {
          questionId: current._id,
          userAnswer: answer.fullEndpoint,
          sessionId,
          timeSpent: Date.now() - questionStartTime,
          metadata: { 
            isCorrect,
            streak,
            selectedMethod: answer.method || '',
            selectedPath: answer.path || ''
          }
        });
      } catch (error) {
        console.error('Failed to submit answer:', error);
      }
    }
    
    // Reset timer for next question
    setQuestionStartTime(Date.now());
  };

  // Next question
  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      const nextIdx = currentQuestion + 1;
      setCurrentQuestion(nextIdx);
      setSelectedAnswer(null);
      setShowExplanation(false);
      setShowTip(false);
      setQuestionStartTime(Date.now());
      
      // Shuffle options for next question
      const nextOptions = [
        questions[nextIdx].answer,
        ...questions[nextIdx].wrongAnswers
      ].sort(() => Math.random() - 0.5);
      setAllOptions(nextOptions);
    } else {
      // Submit score when game ends
      if (user) {
        const accuracy = questions.length > 0 
          ? Math.round((answers.filter(a => a.correct).length / questions.length) * 100) 
          : 0;
        scoresAPI.submit({
          gameId: 'apiendpoint',
          score,
          accuracy,
          correctAnswers: answers.filter(a => a.correct).length,
          totalAttempts: questions.length,
          metadata: { sessionId }
        }).catch(err => console.error('Failed to submit score:', err));
      }
      setShowResults(true);
    }
  };

  // Reset game
  const resetGame = () => {
    setGameStarted(false);
    setCurrentQuestion(0);
    setScore(0);
    setStreak(0);
    setShowResults(false);
    setAnswers([]);
  };

  if (showResults) {
    return (
      <Results
        score={score}
        totalQuestions={questions.length}
        correctAnswers={answers.filter(a => a.correct).length}
        timeTaken={Math.floor((Date.now() - gameStartTime) / 1000)}
        onPlayAgain={resetGame}
        answers={answers}
      />
    );
  }

  if (!gameStarted) {
    return (
      <div className="space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Server className="w-12 h-12 text-primary" />
            <h1 className="text-4xl font-bold text-gradient">API Endpoint Rush</h1>
          </div>
          <p className="text-xl text-gray-300 mb-2">
            Think Like a Backend Developer! 🚀
          </p>
          <p className="text-gray-400">
            Real problems, real scenarios, real API design decisions
          </p>
        </motion.div>

        {/* Game Description */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="card bg-gradient-to-br from-primary/20 to-transparent border-primary max-w-3xl mx-auto"
        >
          <div className="flex items-start gap-4">
            <Lightbulb className="w-8 h-8 text-warning flex-shrink-0" />
            <div>
              <h3 className="text-xl font-bold mb-3">How It Works</h3>
              <div className="space-y-2 text-gray-300">
                <p>📖 <strong>Read the situation</strong> - A real scenario developers face</p>
                <p>🤔 <strong>Think through the solution</strong> - What should happen?</p>
                <p>🎯 <strong>Build the endpoint</strong> - Choose the right HTTP method + path</p>
                <p>💡 <strong>Learn from feedback</strong> - See why it's right (or wrong)</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* HTTP Methods Quick Reference */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="card max-w-3xl mx-auto"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-primary" />
              Quick Reference: HTTP Methods
            </h3>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-3 bg-dark-bg rounded-lg">
              <div className="font-bold text-success mb-1">GET</div>
              <div className="text-sm text-gray-400">Read/fetch data (no changes)</div>
              <code className="text-xs text-success">GET /users</code>
            </div>
            <div className="p-3 bg-dark-bg rounded-lg">
              <div className="font-bold text-primary mb-1">POST</div>
              <div className="text-sm text-gray-400">Create new resource</div>
              <code className="text-xs text-primary">POST /users</code>
            </div>
            <div className="p-3 bg-dark-bg rounded-lg">
              <div className="font-bold text-warning mb-1">PUT</div>
              <div className="text-sm text-gray-400">Replace entire resource</div>
              <code className="text-xs text-warning">PUT /users/3</code>
            </div>
            <div className="p-3 bg-dark-bg rounded-lg">
              <div className="font-bold text-info mb-1">PATCH</div>
              <div className="text-sm text-gray-400">Update parts of resource</div>
              <code className="text-xs text-info">PATCH /users/3</code>
            </div>
            <div className="p-3 bg-dark-bg rounded-lg md:col-span-2">
              <div className="font-bold text-danger mb-1">DELETE</div>
              <div className="text-sm text-gray-400">Remove resource permanently</div>
              <code className="text-xs text-danger">DELETE /users/3</code>
            </div>
          </div>
        </motion.div>

        {/* Start Button */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center"
        >
          <button
            onClick={startGame}
            className="btn-primary px-12 py-4 text-xl flex items-center gap-3 mx-auto"
          >
            <Zap className="w-6 h-6" />
            Start Building APIs
            <ArrowRight className="w-6 h-6" />
          </button>
          <p className="text-gray-400 mt-4">15 real-world scenarios • ~5 minutes</p>
          {questionCount > 0 && (
            <p className="text-primary text-sm mt-2">
              {questionCount} questions available
            </p>
          )}
        </motion.div>

        {/* Sample Scenario Preview */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="card max-w-3xl mx-auto bg-dark-card"
        >
          <div className="text-sm text-gray-400 mb-2">Example Scenario:</div>
          <div className="p-4 bg-primary bg-opacity-10 rounded-lg border border-primary">
            <p className="text-gray-300 mb-3">
              "A new person named Sarah fills out your registration form with name, email, and password."
            </p>
            <p className="font-bold text-white mb-2">
              What endpoint should your app hit to save Sarah to the database?
            </p>
            <div className="flex gap-2 flex-wrap">
              <code className="text-success border border-success px-3 py-1 rounded">POST /users</code>
              <code className="text-gray-500 border border-gray-700 px-3 py-1 rounded">GET /users</code>
              <code className="text-gray-500 border border-gray-700 px-3 py-1 rounded">PUT /users</code>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  const current = questions[currentQuestion];
  if (!current) return null;

  // Get difficulty color
  const difficultyColor = {
    beginner: 'text-success',
    intermediate: 'text-warning',
    advanced: 'text-danger'
  }[current.difficulty];

  const difficultyBg = {
    beginner: 'bg-success',
    intermediate: 'bg-warning',
    advanced: 'bg-danger'
  }[current.difficulty];

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
              {currentQuestion + 1} / {questions.length}
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

      {/* Scenario Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestion}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          className="space-y-6"
        >
          {/* Story */}
          <div className="card bg-gradient-to-br from-primary/10 to-transparent border-primary">
            <div className="flex items-start gap-4">
              <span className="text-4xl">{current.category.match(/[👥📝🔍🔐💬]/)?.[0] || '💻'}</span>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-gray-400">{current.category}</span>
                  <span className={`px-3 py-1 ${difficultyBg} bg-opacity-20 ${difficultyColor} rounded-full text-sm font-bold uppercase`}>
                    {current.difficulty}
                  </span>
                </div>
                <h2 className="text-2xl font-bold mb-4 text-white">The Situation:</h2>
                <p className="text-gray-200 text-lg leading-relaxed">{current.story}</p>
              </div>
            </div>
          </div>

          {/* Context Info */}
          <div className="grid md:grid-cols-3 gap-4">
            <div className="card bg-dark-card">
              <div className="flex items-center gap-2 mb-2">
                <Database className="w-5 h-5 text-primary" />
                <div className="font-bold text-sm text-gray-400">Database</div>
              </div>
              <div className="text-white">{current.context.database}</div>
            </div>
            <div className="card bg-dark-card">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-5 h-5 text-warning" />
                <div className="font-bold text-sm text-gray-400">Action</div>
              </div>
              <div className="text-white">{current.context.action}</div>
            </div>
            <div className="card bg-dark-card">
              <div className="flex items-center gap-2 mb-2">
                <ArrowRight className="w-5 h-5 text-success" />
                <div className="font-bold text-sm text-gray-400">Data Flow</div>
              </div>
              <div className="text-white">{current.context.dataFlow}</div>
            </div>
          </div>

          {/* Question */}
          <div className="card">
            <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Code className="w-6 h-6 text-warning" />
              {current.problem}
            </h3>

            {/* Endpoint Options */}
            <div className="space-y-3">
              {allOptions.map((option, idx) => {
                const isSelected = selectedAnswer?.fullEndpoint === option.fullEndpoint;
                const isCorrect = option.fullEndpoint === current.answer.fullEndpoint;
                const showResult = selectedAnswer !== null;

                let buttonClass = 'text-left transition-all';
                if (showResult) {
                  if (isSelected && isCorrect) {
                    buttonClass += ' bg-success border-success text-white';
                  } else if (isSelected && !isCorrect) {
                    buttonClass += ' bg-danger border-danger text-white';
                  } else if (isCorrect) {
                    buttonClass += ' bg-success bg-opacity-30 border-success text-success';
                  } else {
                    buttonClass += ' bg-dark-bg border-gray-700 text-gray-500';
                  }
                } else {
                  buttonClass += ' bg-dark-bg border-gray-700 hover:border-primary hover:bg-primary hover:bg-opacity-10';
                }

                return (
                  <motion.button
                    key={idx}
                    whileHover={{ scale: selectedAnswer ? 1 : 1.01 }}
                    whileTap={{ scale: selectedAnswer ? 1 : 0.99 }}
                    onClick={() => handleAnswer(option)}
                    disabled={selectedAnswer !== null}
                    className={`w-full p-4 border-2 rounded-lg font-mono text-lg flex items-center justify-between ${buttonClass}`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 rounded ${
                        option.method === 'GET' ? 'bg-success bg-opacity-20 text-success' :
                        option.method === 'POST' ? 'bg-primary bg-opacity-20 text-primary' :
                        option.method === 'PUT' ? 'bg-warning bg-opacity-20 text-warning' :
                        option.method === 'PATCH' ? 'bg-info bg-opacity-20 text-info' :
                        'bg-danger bg-opacity-20 text-danger'
                      }`}>
                        {option.method}
                      </span>
                      <span>{option.path}</span>
                    </div>
                    {showResult && isCorrect && <CheckCircle2 className="w-6 h-6" />}
                    {showResult && isSelected && !isCorrect && <XCircle className="w-6 h-6" />}
                  </motion.button>
                );
              })}
            </div>

            {/* Help Buttons */}
            {!selectedAnswer && (
              <div className="flex gap-4 mt-6">
                <button
                  onClick={() => setShowTip(!showTip)}
                  className="btn-secondary flex items-center gap-2"
                >
                  <Lightbulb className="w-4 h-4" />
                  {showTip ? 'Hide' : 'Show'} Tip
                </button>
                <button
                  onClick={() => setShowMethodGuide(!showMethodGuide)}
                  className="btn-secondary flex items-center gap-2"
                >
                  <BookOpen className="w-4 h-4" />
                  Method Guide
                </button>
              </div>
            )}

            {/* Tip */}
            {showTip && !selectedAnswer && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 p-4 bg-warning bg-opacity-10 border border-warning rounded-lg"
              >
                <div className="flex items-start gap-2">
                  <Lightbulb className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-warning mb-1">Hint:</div>
                    <div className="text-gray-300">{current.tip}</div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Method Guide */}
            {showMethodGuide && !selectedAnswer && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 p-4 bg-primary bg-opacity-10 border border-primary rounded-lg"
              >
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
                  <div>
                    <div className="font-bold text-success mb-1">GET</div>
                    <div className="text-gray-400">Fetch/Read data</div>
                  </div>
                  <div>
                    <div className="font-bold text-primary mb-1">POST</div>
                    <div className="text-gray-400">Create new</div>
                  </div>
                  <div>
                    <div className="font-bold text-warning mb-1">PUT</div>
                    <div className="text-gray-400">Replace all</div>
                  </div>
                  <div>
                    <div className="font-bold text-info mb-1">PATCH</div>
                    <div className="text-gray-400">Update parts</div>
                  </div>
                  <div className="md:col-span-2">
                    <div className="font-bold text-danger mb-1">DELETE</div>
                    <div className="text-gray-400">Remove forever</div>
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
                  selectedAnswer?.fullEndpoint === current.answer.fullEndpoint
                    ? 'bg-success bg-opacity-10 border-success'
                    : 'bg-danger bg-opacity-10 border-danger'
                }`}>
                  <div className="flex items-center gap-2 mb-2">
                    {selectedAnswer?.fullEndpoint === current.answer.fullEndpoint ? (
                      <>
                        <CheckCircle2 className="w-6 h-6 text-success" />
                        <span className="text-xl font-bold text-success">Perfect! 🎯</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-6 h-6 text-danger" />
                        <span className="text-xl font-bold text-danger">Not quite!</span>
                      </>
                    )}
                  </div>
                  <p className="text-gray-300 text-lg">{current.explanation}</p>
                </div>

                {/* Why */}
                <div className="p-4 bg-dark-bg rounded-lg">
                  <div className="font-bold mb-2 flex items-center gap-2">
                    <Lightbulb className="w-5 h-5 text-warning" />
                    Why This Works:
                  </div>
                  <p className="text-gray-300">{current.why}</p>
                </div>

                {/* Example */}
                <div className="p-4 bg-dark-card rounded-lg">
                  <div className="font-bold mb-3">📡 Real Example:</div>
                  <div className="space-y-3">
                    <div>
                      <div className="text-xs text-gray-400 mb-1">REQUEST:</div>
                      <pre className="text-success font-mono text-sm whitespace-pre-wrap bg-dark-bg p-3 rounded">
                        {current.example.request}
                      </pre>
                    </div>
                    <div>
                      <div className="text-xs text-gray-400 mb-1">RESPONSE:</div>
                      <pre className="text-primary font-mono text-sm whitespace-pre-wrap bg-dark-bg p-3 rounded">
                        {current.example.response}
                      </pre>
                    </div>
                  </div>
                </div>

                {/* Common Mistake */}
                <div className="p-4 bg-warning bg-opacity-10 border border-warning rounded-lg">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold text-warning mb-1">Common Mistake:</div>
                      <div className="text-gray-300">{current.commonMistake}</div>
                    </div>
                  </div>
                </div>

                {/* Next Button */}
                <button
                  onClick={nextQuestion}
                  className="btn-primary w-full flex items-center justify-center gap-2 py-4"
                >
                  {currentQuestion < questions.length - 1 ? (
                    <>Next Scenario <ArrowRight className="w-5 h-5" /></>
                  ) : (
                    <>See Results <CheckCircle2 className="w-5 h-5" /></>
                  )}
                </button>
              </motion.div>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
