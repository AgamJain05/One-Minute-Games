import { useState, useMemo, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Play, Star, Zap } from 'lucide-react';
import { useAuthStore } from '@store/authStore';
import { useQuery } from '@tanstack/react-query';
import { scoresAPI } from '@services/api';
import { trackGameClick, getRecentGames } from '@utils/recentGames';

const GAME_CARD_IMAGE_URLS = {
  apiendpoint: 'https://ik.imagekit.io/cpnei0o4f/Games%20Backgrounds/API%20endpoint%20rush.png?tr=w-800,h-450,fo-auto',
  bigochallenge: 'https://ik.imagekit.io/cpnei0o4f/Games%20Backgrounds/BigO%20challenge.png?tr=w-800,h-450,fo-auto',
  binary: 'https://ik.imagekit.io/cpnei0o4f/Games%20Backgrounds/Binary.png?tr=w-800,h-450,fo-auto',
  bugspotter: 'https://ik.imagekit.io/cpnei0o4f/Games%20Backgrounds/Bugspotter.png?tr=w-800,h-450,fo-auto',
  codetype: 'https://ik.imagekit.io/cpnei0o4f/Code_type.png?tr=w-800,h-450,fo-auto',
  codewarriors: 'https://ik.imagekit.io/cpnei0o4f/Games%20Backgrounds/Type.png?updatedAt=1770541210036&tr=w-800,h-450,fo-auto',
  codeblocks: 'https://ik.imagekit.io/cpnei0o4f/Games%20Backgrounds/Drag%20n%20Drop.png?tr=w-800,h-450,fo-auto',
  colormatcher: 'https://ik.imagekit.io/cpnei0o4f/Games%20Backgrounds/colorcode.png?tr=w-800,h-450,fo-auto',
  cssselector: 'https://ik.imagekit.io/cpnei0o4f/Games%20Backgrounds/CSS.png?tr=w-800,h-450,fo-auto',
  datastructure: 'https://ik.imagekit.io/cpnei0o4f/Games%20Backgrounds/Data_structure.png?tr=w-800,h-450,fo-auto',
  debugrace: 'https://ik.imagekit.io/cpnei0o4f/Games%20Backgrounds/debug.png?tr=w-800,h-450,fo-auto',
  flexbox: 'https://ik.imagekit.io/cpnei0o4f/Games%20Backgrounds/FlexBox.png?tr=w-800,h-450,fo-auto',
  gitcommands: 'https://ik.imagekit.io/cpnei0o4f/Games%20Backgrounds/Git.png?tr=w-800,h-450,fo-auto',
  httpstatus: 'https://ik.imagekit.io/cpnei0o4f/Games%20Backgrounds/HTTP%20status.png?tr=w-800,h-450,fo-auto',
  jsonpath: 'https://ik.imagekit.io/cpnei0o4f/Games%20Backgrounds/json.png?tr=w-800,h-450,fo-auto',
  outputpredictor: 'https://ik.imagekit.io/cpnei0o4f/Games%20Backgrounds/outputPredictor.png?tr=w-800,h-450,fo-auto',
  regexmatcher: 'https://ik.imagekit.io/cpnei0o4f/Games%20Backgrounds/Regex.png?tr=w-800,h-450,fo-auto',
  sqlbuilder: 'https://ik.imagekit.io/cpnei0o4f/Games%20Backgrounds/SQL.png?tr=w-800,h-450,fo-auto',
  terminalmaster: 'https://ik.imagekit.io/cpnei0o4f/Games%20Backgrounds/TerminalMaster.png?tr=w-800,h-450,fo-auto',
};

// Placeholder images (tiny blur-up versions)
const GAME_PLACEHOLDERS = {
  apiendpoint: 'https://ik.imagekit.io/cpnei0o4f/Games%20Backgrounds/API%20endpoint%20rush.png?tr=w-20,h-20,bl-10',
  bigochallenge: 'https://ik.imagekit.io/cpnei0o4f/Games%20Backgrounds/BigO%20challenge.png?tr=w-20,h-20,bl-10',
  binary: 'https://ik.imagekit.io/cpnei0o4f/Games%20Backgrounds/Binary.png?tr=w-20,h-20,bl-10',
  bugspotter: 'https://ik.imagekit.io/cpnei0o4f/Games%20Backgrounds/Bugspotter.png?tr=w-20,h-20,bl-10',
  codetype: 'https://ik.imagekit.io/cpnei0o4f/Code_type.png?tr=w-20,h-20,bl-10',
  codewarriors: 'https://ik.imagekit.io/cpnei0o4f/Games%20Backgrounds/Type.png?updatedAt=1770541210036&tr=w-20,h-20,bl-10',
  codeblocks: 'https://ik.imagekit.io/cpnei0o4f/Games%20Backgrounds/Drag%20n%20Drop.png?tr=w-20,h-20,bl-10',
  colormatcher: 'https://ik.imagekit.io/cpnei0o4f/Games%20Backgrounds/colorcode.png?tr=w-20,h-20,bl-10',
  cssselector: 'https://ik.imagekit.io/cpnei0o4f/Games%20Backgrounds/CSS.png?tr=w-20,h-20,bl-10',
  datastructure: 'https://ik.imagekit.io/cpnei0o4f/Games%20Backgrounds/Data_structure.png?tr=w-20,h-20,bl-10',
  debugrace: 'https://ik.imagekit.io/cpnei0o4f/Games%20Backgrounds/debug.png?tr=w-20,h-20,bl-10',
  flexbox: 'https://ik.imagekit.io/cpnei0o4f/Games%20Backgrounds/FlexBox.png?tr=w-20,h-20,bl-10',
  gitcommands: 'https://ik.imagekit.io/cpnei0o4f/Games%20Backgrounds/Git.png?tr=w-20,h-20,bl-10',
  httpstatus: 'https://ik.imagekit.io/cpnei0o4f/Games%20Backgrounds/HTTP%20status.png?tr=w-20,h-20,bl-10',
  jsonpath: 'https://ik.imagekit.io/cpnei0o4f/Games%20Backgrounds/json.png?tr=w-20,h-20,bl-10',
  outputpredictor: 'https://ik.imagekit.io/cpnei0o4f/Games%20Backgrounds/outputPredictor.png?tr=w-20,h-20,bl-10',
  regexmatcher: 'https://ik.imagekit.io/cpnei0o4f/Games%20Backgrounds/Regex.png?tr=w-20,h-20,bl-10',
  sqlbuilder: 'https://ik.imagekit.io/cpnei0o4f/Games%20Backgrounds/SQL.png?tr=w-20,h-20,bl-10',
  terminalmaster: 'https://ik.imagekit.io/cpnei0o4f/Games%20Backgrounds/TerminalMaster.png?tr=w-20,h-20,bl-10',
};

function getGameCardImageUrl(gameId) {
  return GAME_CARD_IMAGE_URLS[gameId] || null;
}

function getGamePlaceholder(gameId) {
  return GAME_PLACEHOLDERS[gameId] || null;
}

const CATEGORY_ORDER = [
  'Featured',
  'Typing & Code',
  'Terminal & Git',
  'Logic & Output',
  'Web & API',
  'Algorithms & DS',
  'Database',
  'CSS & Design',
  'Data & Debug',
];

const GAME_CONFIG = [
  // ⚔️ FEATURED GAME
  { id: 'codewarriors', name: 'Code Warriors', icon: '⚔️', badge: '2-Player Battle', featured: true, category: 'Featured', categoryOrder: 0, description: 'Epic coding battles' },

  // ⌨️ TYPING & CODE
  { id: 'codetype', name: 'CodeType', icon: '⌨️', badge: 'Typing', category: 'Typing & Code', categoryOrder: 1, description: 'Type real code fast' },
  { id: 'bugspotter', name: 'Bug Spotter', icon: '🐛', badge: 'Debug', category: 'Typing & Code', categoryOrder: 1, description: 'Find bugs quickly' },
  { id: 'codeblocks', name: 'Code Block Arranger', icon: '🧩', badge: 'Drag & Drop', category: 'Typing & Code', categoryOrder: 1, description: 'Arrange code blocks' },

  // 💻 TERMINAL & GIT
  { id: 'terminalmaster', name: 'Terminal Master', icon: '💻', badge: 'CLI', category: 'Terminal & Git', categoryOrder: 2, description: 'Master terminal commands' },
  { id: 'gitcommands', name: 'Git Command Rush', icon: '🔱', badge: 'Git', category: 'Terminal & Git', categoryOrder: 2, description: 'Learn Git commands' },

  // 🔮 LOGIC & OUTPUT
  { id: 'outputpredictor', name: 'Output Predictor', icon: '🔮', badge: 'Logic', category: 'Logic & Output', categoryOrder: 3, description: 'Predict code output' },
  { id: 'regexmatcher', name: 'Regex Matcher', icon: '🔍', badge: 'Pattern', category: 'Logic & Output', categoryOrder: 3, description: 'Match regex patterns' },
  { id: 'binary', name: 'Binary Blitz', icon: '💾', badge: 'Binary', category: 'Logic & Output', categoryOrder: 3, description: 'Binary conversion speed' },

  // 🌐 WEB & API
  { id: 'httpstatus', name: 'HTTP Status Quiz', icon: '🌐', badge: 'API', category: 'Web & API', categoryOrder: 4, description: 'Know your status codes' },
  { id: 'apiendpoint', name: 'API Endpoint Rush', icon: '⚡', badge: 'REST', category: 'Web & API', categoryOrder: 4, description: 'Design REST APIs' },

  // 📊 ALGORITHMS & DS
  { id: 'bigochallenge', name: 'Big-O Challenge', icon: '📊', badge: 'Algorithm', category: 'Algorithms & DS', categoryOrder: 5, description: 'Analyze complexity' },
  { id: 'datastructure', name: 'Data Structure Builder', icon: '🏗️', badge: 'DS', category: 'Algorithms & DS', categoryOrder: 5, description: 'Build data structures' },

  // 🗃️ DATABASE
  { id: 'sqlbuilder', name: 'SQL Query Builder', icon: '🗃️', badge: 'Database', category: 'Database', categoryOrder: 6, description: 'Write SQL queries' },

  // 🎨 CSS & DESIGN
  { id: 'flexbox', name: 'Flexbox Frenzy', icon: '📐', badge: 'CSS', category: 'CSS & Design', categoryOrder: 7, description: 'Master flexbox layouts' },
  { id: 'cssselector', name: 'CSS Selector Ninja', icon: '🥷', badge: 'CSS', category: 'CSS & Design', categoryOrder: 7, description: 'Target elements precisely' },
  { id: 'colormatcher', name: 'Color Code Matcher', icon: '🎨', badge: 'Design', category: 'CSS & Design', categoryOrder: 7, description: 'Match color codes' },

  // 🗺️ DATA & DEBUG
  { id: 'jsonpath', name: 'JSON Path Finder', icon: '🗺️', badge: 'Data', category: 'Data & Debug', categoryOrder: 8, description: 'Navigate JSON paths' },
  { id: 'debugrace', name: 'Debug Race', icon: '🏁', badge: 'Speed', category: 'Data & Debug', categoryOrder: 8, description: 'Debug at lightning speed' },
];

const SORT_OPTIONS = [
  { value: 'default', label: 'Default' },
  { value: 'category', label: 'Category' },
  { value: 'nameAsc', label: 'Name A–Z' },
  { value: 'nameDesc', label: 'Name Z–A' },
  { value: 'featured', label: 'Featured first' },
];

const GAME_BY_ID = Object.fromEntries(GAME_CONFIG.map((g) => [g.id, g]));

// Game Card Component
function GameCard({ game, size = 'default', onClick }) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const bgUrl = getGameCardImageUrl(game.id);
  const placeholder = getGamePlaceholder(game.id);
  
  const isSmall = size === 'small';
  
  return (
    <Link 
      to={`/game/${game.id}`} 
      onClick={onClick}
      className="group block"
    >
      <div className={`bg-gray-900 rounded-xl overflow-hidden border border-gray-800 hover:border-primary transition-all duration-300 hover:shadow-xl hover:shadow-primary/20 hover:-translate-y-2 ${game.featured ? 'ring-2 ring-primary' : ''}`}>
        {/* Image Section */}
        <div className={`relative overflow-hidden bg-gray-800 ${isSmall ? 'aspect-video' : 'aspect-video'}`}>
          {/* Placeholder (blur-up) */}
          {placeholder && !imageLoaded && (
            <img
              src={placeholder}
              alt=""
              className="absolute inset-0 w-full h-full object-cover blur-xl scale-110"
              aria-hidden="true"
            />
          )}
          
          {/* Main Image */}
          {bgUrl && (
            <img
              src={bgUrl}
              alt={game.name}
              className={`absolute inset-0 w-full h-full object-cover transition-all duration-500 ${
                imageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
              } group-hover:scale-110`}
              onLoad={() => setImageLoaded(true)}
              loading="lazy"
            />
          )}
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          
          {/* Featured Badge */}
          {game.featured && (
            <div className="absolute top-3 right-3 z-10">
              <div className="flex items-center gap-1 bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                <Star size={12} fill="currentColor" />
                FEATURED
              </div>
            </div>
          )}
          
          {/* Play Icon Overlay */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="bg-primary rounded-full p-4 shadow-2xl transform group-hover:scale-110 transition-transform duration-300">
              <Play size={isSmall ? 24 : 32} fill="currentColor" className="text-white" />
            </div>
          </div>
          
          {/* Category Badge (on image) */}
          <div className="absolute bottom-3 left-3 z-10">
            <span className="text-2xl filter drop-shadow-lg">{}</span>
          </div>
        </div>
        
        {/* Details Section */}
        <div className={`p-4 ${isSmall ? 'p-3' : 'p-5'} space-y-2`}>
          {/* Badge */}
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 text-xs font-medium bg-primary/20 text-primary px-2.5 py-1 rounded-full">
              <Zap size={12} />
              {game.badge}
            </span>
          </div>
          
          {/* Game Name */}
          <h3 className={`font-bold text-white group-hover:text-primary transition-colors ${isSmall ? 'text-base' : 'text-xl'}`}>
            {game.name}
          </h3>
          
          {/* Description */}
          {!isSmall && (
            <p className="text-sm text-gray-400 line-clamp-2">
              {game.description}
            </p>
          )}
          
          {/* Category */}
          <div className="flex items-center justify-between pt-2">
            <span className="text-xs text-gray-500">{game.category}</span>
            <span className="text-xs text-primary opacity-0 group-hover:opacity-100 transition-opacity font-medium">
              Play now →
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function Home() {
  const { user } = useAuthStore();
  const [searchParams] = useSearchParams();
  const searchQuery = (searchParams.get('q') || '').trim().toLowerCase();
  const [sortBy, setSortBy] = useState('default');
  const [recentClickedGames, setRecentClickedGames] = useState([]);

  useEffect(() => {
    const recent = getRecentGames();
    setRecentClickedGames(recent);
  }, []);

  const { data: recentScores } = useQuery({
    queryKey: ['recentScores'],
    queryFn: () => scoresAPI.getRecent(20).then((res) => res.data),
    enabled: !!user,
  });

  const recentlyPlayedGames = useMemo(() => {
    const seen = new Set();
    const out = [];

    for (const item of recentClickedGames) {
      const id = item.gameId;
      if (id && !seen.has(id)) {
        seen.add(id);
        const game = GAME_BY_ID[id];
        if (game) out.push(game);
      }
      if (out.length >= 10) break;
    }

    if (recentScores && Array.isArray(recentScores) && out.length < 10) {
      for (const s of recentScores) {
        const id = s.gameId;
        if (id && !seen.has(id)) {
          seen.add(id);
          const game = GAME_BY_ID[id];
          if (game) out.push(game);
        }
        if (out.length >= 10) break;
      }
    }

    return out;
  }, [recentClickedGames, recentScores]);

  const handleGameClick = (gameId) => {
    trackGameClick(gameId);
    const recent = getRecentGames();
    setRecentClickedGames(recent);
  };

  const sortedGames = useMemo(() => {
    const list = [...GAME_CONFIG];
    switch (sortBy) {
      case 'category':
        return list.sort((a, b) => {
          if (a.categoryOrder !== b.categoryOrder) return a.categoryOrder - b.categoryOrder;
          if (a.category !== b.category) return (a.category || '').localeCompare(b.category || '');
          return (a.name || '').localeCompare(b.name || '');
        });
      case 'nameAsc':
        return list.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
      case 'nameDesc':
        return list.sort((a, b) => (b.name || '').localeCompare(a.name || ''));
      case 'featured': {
        const featured = list.filter((g) => g.featured);
        const rest = list.filter((g) => !g.featured);
        return [...featured, ...rest];
      }
      default:
        return list;
    }
  }, [sortBy]);

  const filteredGames = useMemo(() => {
    if (!searchQuery) return sortedGames;
    return sortedGames.filter(
      (g) =>
        (g.name && g.name.toLowerCase().includes(searchQuery)) ||
        (g.category && g.category.toLowerCase().includes(searchQuery)) ||
        (g.badge && g.badge.toLowerCase().includes(searchQuery)) ||
        (g.description && g.description.toLowerCase().includes(searchQuery))
    );
  }, [sortedGames, searchQuery]);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4 pt-8"
      >
        <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">
          Welcome to OneMinuteLab
        </h1>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
          {user ? `Welcome back, ${user.username}! Ready to level up?` : 'Level up your developer skills in 60 seconds'}
        </p>
        
        {user && (
          <div className="flex justify-center gap-4 mt-8 flex-wrap">
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 text-center min-w-[140px] hover:border-primary transition-colors">
              <div className="text-4xl font-bold bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">{user.level}</div>
              <div className="text-sm text-gray-400 mt-1">Level</div>
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 text-center min-w-[140px] hover:border-green-500 transition-colors">
              <div className="text-4xl font-bold bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">{user.totalXP || 0}</div>
              <div className="text-sm text-gray-400 mt-1">Total XP</div>
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 text-center min-w-[140px] hover:border-orange-500 transition-colors">
              <div className="text-4xl font-bold bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">{user.currentStreak || 0}</div>
              <div className="text-sm text-gray-400 mt-1">Day Streak 🔥</div>
            </div>
          </div>
        )}
      </motion.div>

      {/* Recently Played */}
      {recentlyPlayedGames.length > 0 && (
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-4"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white">Recently Played</h2>
            <div className="h-1 flex-1 ml-4 bg-gradient-to-r from-primary/50 to-transparent rounded-full" />
          </div>
          
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
            {recentlyPlayedGames.map((game) => (
              <div key={game.id} className="w-64 shrink-0">
                <GameCard 
                  game={game} 
                  size="small" 
                  onClick={() => handleGameClick(game.id)} 
                />
              </div>
            ))}
          </div>
        </motion.section>
      )}

      {/* Sort Controls */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-wrap items-center gap-4"
      >
        <span className="text-gray-400 font-medium">Sort by:</span>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="bg-gray-900 border border-gray-700 rounded-lg px-4 py-2.5 text-sm text-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/50 outline-none transition-all cursor-pointer hover:border-gray-600"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        
        {filteredGames.length > 0 && (
          <span className="text-sm text-gray-500">
            {filteredGames.length} {filteredGames.length === 1 ? 'game' : 'games'}
          </span>
        )}
      </motion.div>

      {/* Games Grid */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      >
        {filteredGames.map((game) => (
          <motion.div key={game.id} variants={item}>
            <GameCard 
              game={game} 
              onClick={() => handleGameClick(game.id)} 
            />
          </motion.div>
        ))}
      </motion.div>

      {/* No Results */}
      {filteredGames.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16"
        >
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-2xl font-bold text-gray-300 mb-2">No games found</h3>
          <p className="text-gray-500">Try adjusting your search or filters</p>
        </motion.div>
      )}

      {/* CTA for Non-Logged Users */}
      {!user && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-r from-primary/20 via-purple-500/20 to-pink-500/20 border border-primary/30 rounded-2xl p-8 text-center"
        >
          <h3 className="text-2xl font-bold text-white mb-3">
            Ready to track your progress?
          </h3>
          <p className="text-lg text-gray-300 mb-6 max-w-2xl mx-auto">
            Create a free account to save your scores, compete on leaderboards, earn achievements, and level up your skills!
          </p>
          <Link 
            to="/register" 
            className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-white font-bold px-8 py-3 rounded-lg transition-all hover:scale-105 shadow-lg shadow-primary/50"
          >
            Get Started Free
            <Zap size={20} fill="currentColor" />
          </Link>
        </motion.div>
      )}
    </div>
  );
}