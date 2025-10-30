import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Timer as TimerIcon, Zap, Shield, Sword } from 'lucide-react';

export default function BattleArena({ battleState, setBattleState, questions, onEnd }) {
  const [selectedAttack, setSelectedAttack] = useState(null);
  const [showQuiz, setShowQuiz] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [quizStartTime, setQuizStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);

  const currentPlayer = battleState.currentTurn;
  const opponent = currentPlayer === 'player1' ? 'player2' : 'player1';

  // Timer for quiz
  useEffect(() => {
    if (showQuiz && quizStartTime) {
      const interval = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - quizStartTime) / 1000));
      }, 100);
      return () => clearInterval(interval);
    }
  }, [showQuiz, quizStartTime]);

  const handleAttack = (attack) => {
    if (battleState[currentPlayer].mana < attack.manaCost) return;

    setSelectedAttack(attack);

    if (attack.requiresQuiz) {
      const charId = battleState[currentPlayer].id;
      const q = questions[charId][Math.floor(Math.random() * questions[charId].length)];
      setCurrentQuestion(q);
      setShowQuiz(true);
      setQuizStartTime(Date.now());
      setElapsedTime(0);
    } else {
      executeAttack(attack, true, 0);
    }
  };

  const answerQuiz = (isCorrect) => {
    const timeTaken = elapsedTime;
    setShowQuiz(false);
    setQuizStartTime(null);
    executeAttack(selectedAttack, isCorrect, timeTaken);
  };

  const calculateDamage = (baseDamage, isCorrect, timeTaken, difficulty, expectedTime) => {
    if (!isCorrect) {
      // Wrong answer: 30% damage
      return Math.floor(baseDamage * 0.3);
    }

    // Correct answer: Calculate based on time and difficulty
    let damageMultiplier = 1.0;
    
    // Time performance calculation
    const timeRatio = timeTaken / expectedTime;
    
    if (difficulty === 'easy') {
      // Easy: Penalty for taking too long
      // Fast (< 70% time): 1.0x damage
      // Normal (70-100% time): 0.9x damage
      // Slow (> 100% time): 0.6x damage
      if (timeRatio < 0.7) {
        damageMultiplier = 1.0;
      } else if (timeRatio <= 1.0) {
        damageMultiplier = 0.9;
      } else {
        damageMultiplier = Math.max(0.5, 1.0 - (timeRatio - 1.0) * 0.5);
      }
    } else if (difficulty === 'medium') {
      // Medium: Balanced rewards
      // Fast (< 60% time): 1.3x damage
      // Normal (60-100% time): 1.0x damage
      // Slow (> 100% time): 0.7x damage
      if (timeRatio < 0.6) {
        damageMultiplier = 1.3;
      } else if (timeRatio <= 1.0) {
        damageMultiplier = 1.0;
      } else {
        damageMultiplier = Math.max(0.6, 1.0 - (timeRatio - 1.0) * 0.4);
      }
    } else if (difficulty === 'hard') {
      // Hard: Big rewards for speed
      // Fast (< 50% time): 2.0x damage (CRITICAL HIT!)
      // Normal (50-80% time): 1.5x damage
      // Slow (80-100% time): 1.2x damage
      // Very Slow (> 100% time): 0.8x damage
      if (timeRatio < 0.5) {
        damageMultiplier = 2.0;
      } else if (timeRatio < 0.8) {
        damageMultiplier = 1.5;
      } else if (timeRatio <= 1.0) {
        damageMultiplier = 1.2;
      } else {
        damageMultiplier = Math.max(0.7, 1.0 - (timeRatio - 1.0) * 0.3);
      }
    }

    const finalDamage = Math.floor(baseDamage * damageMultiplier);
    return { damage: finalDamage, multiplier: damageMultiplier };
  };

  const executeAttack = (attack, quizSuccess, timeTaken) => {
    let damage, multiplier, damageType;
    
    if (attack.requiresQuiz && currentQuestion) {
      const result = calculateDamage(
        attack.damage, 
        quizSuccess, 
        timeTaken, 
        currentQuestion.difficulty,
        currentQuestion.expectedTime
      );
      damage = result.damage;
      multiplier = result.multiplier;
      
      // Determine damage type based on multiplier
      if (multiplier >= 2.0) {
        damageType = 'CRITICAL HIT!';
      } else if (multiplier >= 1.5) {
        damageType = 'POWERFUL!';
      } else if (multiplier >= 1.2) {
        damageType = 'STRONG!';
      } else if (multiplier <= 0.6) {
        damageType = 'WEAK...';
      } else {
        damageType = '';
      }
    } else {
      damage = attack.damage;
      damageType = '';
    }
    // Create battle log message
    let logMessage = `${battleState[currentPlayer].name} used ${attack.name}!`;
    if (attack.requiresQuiz) {
      logMessage += ` (${currentQuestion?.difficulty?.toUpperCase()} - ${timeTaken}s)`;
    }
    if (damageType) {
      logMessage += ` ${damageType}`;
    }
    logMessage += ` Dealt ${damage} damage!`;
    
    setBattleState(prev => ({
      ...prev,
      [currentPlayer]: {
        ...prev[currentPlayer],
        mana: prev[currentPlayer].mana - attack.manaCost
      },
      [opponent]: {
        ...prev[opponent],
        health: Math.max(0, prev[opponent].health - damage)
      },
      log: [...prev.log, logMessage],
      currentTurn: opponent,
      round: currentPlayer === 'player2' ? prev.round + 1 : prev.round
    }));

    // Check for winner
    if (battleState[opponent].health - damage <= 0) {
      setTimeout(() => onEnd(currentPlayer), 1000);
    }

    // Regenerate mana
    setTimeout(() => {
      setBattleState(prev => ({
        ...prev,
        [opponent]: {
          ...prev[opponent],
          mana: Math.min(100, prev[opponent].mana + 10)
        }
      }));
    }, 500);
  };

  return (
    <div className="space-y-6">
      {/* Battle Stats */}
      <div className="grid md:grid-cols-2 gap-6">
        {['player1', 'player2'].map(player => (
          <div key={player} className={`card ${currentPlayer === player ? 'border-warning' : ''}`}>
            <div className="text-center mb-4">
              <div className="text-5xl mb-2">{battleState[player].avatar}</div>
              <h3 className="text-xl font-bold">{battleState[player].name}</h3>
            </div>
            <div className="space-y-2">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Health</span>
                  <span>{battleState[player].health}/100</span>
                </div>
                <div className="bg-gray-700 rounded-full h-4">
                  <div 
                    className="bg-danger rounded-full h-full transition-all"
                    style={{ width: `${battleState[player].health}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Mana</span>
                  <span>{battleState[player].mana}/100</span>
                </div>
                <div className="bg-gray-700 rounded-full h-4">
                  <div 
                    className="bg-primary rounded-full h-full transition-all"
                    style={{ width: `${battleState[player].mana}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Current Turn Info */}
      <div className="card bg-warning bg-opacity-20 border-warning text-center">
        <h3 className="text-2xl font-bold">
          {battleState[currentPlayer].name}'s Turn (Round {battleState.round})
        </h3>
      </div>

      {!showQuiz && (
        <div className="card">
          <h3 className="text-xl font-bold mb-4">Choose Attack:</h3>
          <div className="grid gap-3">
            {battleState[currentPlayer].attacks.map((attack, idx) => (
              <motion.button
                key={idx}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleAttack(attack)}
                disabled={battleState[currentPlayer].mana < attack.manaCost}
                className="bg-dark-bg hover:bg-gray-800 border-2 border-gray-700 hover:border-primary rounded-lg p-4 text-left transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-bold text-lg">{attack.name}</h4>
                    <p className="text-sm text-gray-400">
                      Damage: {attack.damage} | Mana: {attack.manaCost}
                    </p>
                  </div>
                  {attack.requiresQuiz && <span className="text-warning">📝 Quiz</span>}
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      )}

      {showQuiz && currentQuestion && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="card bg-primary bg-opacity-20 border-primary"
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold">Answer to Attack!</h3>
            <div className="flex items-center gap-4">
              {/* Difficulty Badge */}
              <span className={`px-3 py-1 rounded-full font-bold text-sm ${
                currentQuestion.difficulty === 'easy' 
                  ? 'bg-green-500 text-white' 
                  : currentQuestion.difficulty === 'medium'
                  ? 'bg-warning text-white'
                  : 'bg-danger text-white'
              }`}>
                {currentQuestion.difficulty === 'easy' && <Shield className="inline w-4 h-4 mr-1" />}
                {currentQuestion.difficulty === 'medium' && <Sword className="inline w-4 h-4 mr-1" />}
                {currentQuestion.difficulty === 'hard' && <Zap className="inline w-4 h-4 mr-1" />}
                {currentQuestion.difficulty.toUpperCase()}
              </span>
              {/* Timer */}
              <div className={`flex items-center gap-2 px-3 py-1 rounded-full font-mono font-bold ${
                elapsedTime > currentQuestion.expectedTime 
                  ? 'bg-danger text-white'
                  : elapsedTime > currentQuestion.expectedTime * 0.7
                  ? 'bg-warning text-white'
                  : 'bg-success text-white'
              }`}>
                <TimerIcon className="w-4 h-4" />
                {elapsedTime}s
              </div>
            </div>
          </div>

          {/* Time hints */}
          <div className="mb-4 p-3 bg-dark-bg rounded-lg border border-gray-700">
            <p className="text-sm text-gray-400">
              {currentQuestion.difficulty === 'easy' && (
                <>💡 <span className="text-yellow-400">Easy:</span> Answer quickly to avoid damage penalty!</>
              )}
              {currentQuestion.difficulty === 'medium' && (
                <>⚡ <span className="text-orange-400">Medium:</span> Fast answers deal bonus damage!</>
              )}
              {currentQuestion.difficulty === 'hard' && (
                <>🔥 <span className="text-red-400">Hard:</span> Lightning fast = CRITICAL HIT (2x damage)!</>
              )}
            </p>
          </div>

          <p className="text-lg mb-4">{currentQuestion.question}</p>
          <div className="grid gap-2">
            {currentQuestion.options.map((option, idx) => (
              <button
                key={idx}
                onClick={() => answerQuiz(option === currentQuestion.answer)}
                className="bg-dark-bg hover:bg-gray-800 border-2 border-gray-700 hover:border-primary rounded-lg p-3 text-left transition-all"
              >
                {option}
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Battle Log */}
      <div className="card max-h-48 overflow-y-auto">
        <h4 className="font-bold mb-2">Battle Log:</h4>
        <div className="space-y-1 text-sm">
          {battleState.log.slice(-6).reverse().map((msg, idx) => {
            const isCritical = msg.includes('CRITICAL');
            const isPowerful = msg.includes('POWERFUL');
            const isWeak = msg.includes('WEAK');
            
            return (
              <div 
                key={idx}
                className={`p-2 rounded ${
                  isCritical 
                    ? 'bg-danger bg-opacity-20 text-danger font-bold'
                    : isPowerful
                    ? 'bg-warning bg-opacity-20 text-warning font-semibold'
                    : isWeak
                    ? 'bg-gray-700 text-gray-400'
                    : 'text-gray-300'
                }`}
              >
                {msg}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

