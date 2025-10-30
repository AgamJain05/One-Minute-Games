import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuthStore } from '@store/authStore';
import { useQuery } from '@tanstack/react-query';
import { gamesAPI } from '@services/api';

const GAME_CONFIG = [
  // ⚔️ FEATURED GAME
  { id: 'codewarriors', name: 'Code Warriors', icon: '⚔️', badge: '2-Player Battle', featured: true },
  
  // ⌨️ TYPING & CODE
  { id: 'codetype', name: 'CodeType', icon: '⌨️', badge: 'Typing' },
  { id: 'bugspotter', name: 'Bug Spotter', icon: '🐛', badge: 'Debug' },
  { id: 'codeblocks', name: 'Code Block Arranger', icon: '🧩', badge: 'Drag & Drop' },
  
  // 💻 TERMINAL & GIT
  { id: 'terminalmaster', name: 'Terminal Master', icon: '💻', badge: 'CLI' },
  { id: 'gitcommands', name: 'Git Command Rush', icon: '🔱', badge: 'Git' },
  
  // 🔮 LOGIC & OUTPUT
  { id: 'outputpredictor', name: 'Output Predictor', icon: '🔮', badge: 'Logic' },
  { id: 'regexmatcher', name: 'Regex Matcher', icon: '🔍', badge: 'Pattern' },
  { id: 'binary', name: 'Binary Blitz', icon: '💾', badge: 'Binary' },
  
  // 🌐 WEB & API
  { id: 'httpstatus', name: 'HTTP Status Quiz', icon: '🌐', badge: 'API' },
  { id: 'apiendpoint', name: 'API Endpoint Rush', icon: '⚡', badge: 'REST' },
  
  // 📊 ALGORITHMS & DS
  { id: 'bigochallenge', name: 'Big-O Challenge', icon: '📊', badge: 'Algorithm' },
  { id: 'datastructure', name: 'Data Structure Builder', icon: '🏗️', badge: 'DS' },
  
  // 🗃️ DATABASE
  { id: 'sqlbuilder', name: 'SQL Query Builder', icon: '🗃️', badge: 'Database' },
  
  // 🎨 CSS & DESIGN
  { id: 'flexbox', name: 'Flexbox Frenzy', icon: '📐', badge: 'CSS' },
  { id: 'cssselector', name: 'CSS Selector Ninja', icon: '🥷', badge: 'CSS' },
  { id: 'colormatcher', name: 'Color Code Matcher', icon: '🎨', badge: 'Design' },
  
  // 🗺️ DATA & DEBUG
  { id: 'jsonpath', name: 'JSON Path Finder', icon: '🗺️', badge: 'Data' },
  { id: 'debugrace', name: 'Debug Race', icon: '🏁', badge: 'Speed' },
];

export default function Home() {
  const { user } = useAuthStore();

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <h1 className="text-5xl font-bold text-gradient">
          Welcome to OneMinuteLab
        </h1>
        <p className="text-xl text-gray-300">
          {user ? `Welcome back, ${user.username}!` : 'Level up your developer skills in 60 seconds'}
        </p>
        
        {user && (
          <div className="flex justify-center gap-6 mt-6">
            <div className="card text-center">
              <div className="text-3xl font-bold text-primary">{user.level}</div>
              <div className="text-sm text-gray-400">Level</div>
            </div>
            <div className="card text-center">
              <div className="text-3xl font-bold text-success">{user.totalXP || 0}</div>
              <div className="text-sm text-gray-400">Total XP</div>
            </div>
            <div className="card text-center">
              <div className="text-3xl font-bold text-warning">{user.currentStreak || 0}</div>
              <div className="text-sm text-gray-400">Day Streak</div>
            </div>
          </div>
        )}
      </motion.div>

      {/* Games Grid */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      >
        {GAME_CONFIG.map((game) => (
          <motion.div key={game.id} variants={item}>
            <Link to={`/game/${game.id}`}>
              <div className={`card hover:border-primary hover:-translate-y-1 transition-all cursor-pointer ${game.featured ? 'border-primary border-2 relative overflow-hidden' : ''}`}>
                {game.featured && (
                  <div className="absolute top-0 right-0 bg-gradient-to-r from-warning to-danger text-white text-xs px-3 py-1 rounded-bl-lg font-bold">
                    FEATURED
                  </div>
                )}
                <div className="text-5xl mb-3">{game.icon}</div>
                <div className="text-xs bg-primary bg-opacity-20 text-primary px-2 py-1 rounded inline-block mb-2">
                  {game.badge}
                </div>
                <h3 className="text-xl font-semibold mb-2">{game.name}</h3>
                <p className="text-gray-400 text-sm">Click to play</p>
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>

      {!user && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center py-8"
        >
          <p className="text-lg text-gray-300 mb-4">
            Create an account to track your progress, compete on leaderboards, and earn achievements!
          </p>
          <Link to="/register" className="btn-primary inline-block">
            Get Started Free
          </Link>
        </motion.div>
      )}
    </div>
  );
}

