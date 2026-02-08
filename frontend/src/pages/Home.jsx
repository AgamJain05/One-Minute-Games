import { useState, useMemo, useEffect, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Play, Star, Zap, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
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

const GAME_CONFIG = [
  { id: 'codewarriors', name: 'Code Warriors', icon: '⚔️', badge: '2-Player Battle', featured: true, category: 'Featured', categoryOrder: 0, description: 'Epic coding battles', categoryShort: 'FEATURED' },
  { id: 'codetype', name: 'CodeType', icon: '⌨️', badge: 'Typing', category: 'Typing & Code', categoryOrder: 1, description: 'Type real code fast', categoryShort: 'TYPING & CODE' },
  { id: 'bugspotter', name: 'Bug Spotter', icon: '🐛', badge: 'Debug', category: 'Typing & Code', categoryOrder: 1, description: 'Find bugs quickly', categoryShort: 'TYPING & CODE' },
  { id: 'codeblocks', name: 'Code Block Arranger', icon: '🧩', badge: 'Drag & Drop', category: 'Typing & Code', categoryOrder: 1, description: 'Arrange code blocks', categoryShort: 'TYPING & CODE' },
  { id: 'terminalmaster', name: 'Terminal Master', icon: '💻', badge: 'CLI', category: 'Terminal & Git', categoryOrder: 2, description: 'Master terminal commands', categoryShort: 'TERMINAL & GIT' },
  { id: 'gitcommands', name: 'Git Command Rush', icon: '🔱', badge: 'Git', category: 'Terminal & Git', categoryOrder: 2, description: 'Learn Git commands', categoryShort: 'TERMINAL & GIT' },
  { id: 'outputpredictor', name: 'Output Predictor', icon: '🔮', badge: 'Logic', category: 'Logic & Output', categoryOrder: 3, description: 'Predict code output', categoryShort: 'LOGIC & OUTPUT' },
  { id: 'regexmatcher', name: 'Regex Matcher', icon: '🔍', badge: 'Pattern', category: 'Logic & Output', categoryOrder: 3, description: 'Match regex patterns', categoryShort: 'LOGIC & OUTPUT' },
  { id: 'binary', name: 'Binary Blitz', icon: '💾', badge: 'Binary', category: 'Logic & Output', categoryOrder: 3, description: 'Binary conversion speed', categoryShort: 'LOGIC & OUTPUT' },
  { id: 'httpstatus', name: 'HTTP Status Quiz', icon: '🌐', badge: 'API', category: 'Web & API', categoryOrder: 4, description: 'Know your status codes', categoryShort: 'WEB & API' },
  { id: 'apiendpoint', name: 'API Endpoint Rush', icon: '⚡', badge: 'REST', category: 'Web & API', categoryOrder: 4, description: 'Design REST APIs', categoryShort: 'WEB & API' },
  { id: 'bigochallenge', name: 'Big-O Challenge', icon: '📊', badge: 'Algorithm', category: 'Algorithms & DS', categoryOrder: 5, description: 'Analyze complexity', categoryShort: 'ALGORITHMS & DS' },
  { id: 'datastructure', name: 'Data Structure Builder', icon: '🏗️', badge: 'DS', category: 'Algorithms & DS', categoryOrder: 5, description: 'Build data structures', categoryShort: 'ALGORITHMS & DS' },
  { id: 'sqlbuilder', name: 'SQL Query Builder', icon: '🗃️', badge: 'Database', category: 'Database', categoryOrder: 6, description: 'Write SQL queries', categoryShort: 'DATABASE' },
  { id: 'flexbox', name: 'Flexbox Frenzy', icon: '📐', badge: 'CSS', category: 'CSS & Design', categoryOrder: 7, description: 'Master flexbox layouts', categoryShort: 'CSS & DESIGN' },
  { id: 'cssselector', name: 'CSS Selector Ninja', icon: '🥷', badge: 'CSS', category: 'CSS & Design', categoryOrder: 7, description: 'Target elements precisely', categoryShort: 'CSS & DESIGN' },
  { id: 'colormatcher', name: 'Color Code Matcher', icon: '🎨', badge: 'Design', category: 'CSS & Design', categoryOrder: 7, description: 'Match color codes', categoryShort: 'CSS & DESIGN' },
  { id: 'jsonpath', name: 'JSON Path Finder', icon: '🗺️', badge: 'Data', category: 'Data & Debug', categoryOrder: 8, description: 'Navigate JSON paths', categoryShort: 'DATA & DEBUG' },
  { id: 'debugrace', name: 'Debug Race', icon: '🏁', badge: 'Speed', category: 'Data & Debug', categoryOrder: 8, description: 'Debug at lightning speed', categoryShort: 'DATA & DEBUG' },
];

const SORT_OPTIONS = [
  { value: 'default', label: 'Default' },
  { value: 'category', label: 'Category' },
  { value: 'nameAsc', label: 'Name A–Z' },
  { value: 'nameDesc', label: 'Name Z–A' },
  { value: 'featured', label: 'Featured first' },
];

const GAME_BY_ID = Object.fromEntries(GAME_CONFIG.map((g) => [g.id, g]));

// Game Card Component - Matching Screenshot Design
function GameCard({ game, size = 'default', onClick }) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const bgUrl = getGameCardImageUrl(game.id);
  const placeholder = getGamePlaceholder(game.id);
  const isSmall = size === 'small';

  return (
    <Link
      to={`/game/${game.id}`}
      onClick={onClick}
      className="group block h-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="h-full flex flex-col bg-gradient-to-br from-[#0a1628] via-[#0d1b2a] to-[#1b263b] rounded-2xl overflow-hidden border border-cyan-500/10 hover:border-cyan-400/30 transition-all duration-500 hover:shadow-[0_0_40px_rgba(6,182,212,0.15)] hover:-translate-y-2 relative">

        {/* Animated glow effect on hover */}
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/0 via-cyan-400/0 to-purple-500/0 group-hover:from-cyan-500/5 group-hover:via-cyan-400/5 group-hover:to-purple-500/5 transition-all duration-500 pointer-events-none rounded-2xl" />

        {/* Featured Shine Effect */}
        {game.featured && (
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none" />
        )}

        {/* Image Section */}
        <div className={`relative overflow-hidden ${isSmall ? 'aspect-video' : 'aspect-video'}`}>
          {/* Placeholder blur-up */}
          {placeholder && !imageLoaded && (
            <img
              src={placeholder}
              alt=""
              className="absolute inset-0 w-full h-full object-cover blur-2xl scale-110"
              aria-hidden="true"
            />
          )}

          {/* Main Image */}
          {bgUrl && (
            <img
              src={bgUrl}
              alt={game.name}
              className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ${imageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
                } group-hover:scale-110`}
              onLoad={() => setImageLoaded(true)}
              loading="lazy"
            />
          )}

          {/* Gradient Overlay - darker at bottom */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0a1628]/30 to-[#0a1628]" />



          {/* Play Button Overlay */}
          <div className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'
            }`}>
            <div className="relative">
              {/* Pulsing glow ring */}
              <div className="absolute inset-0 bg-cyan-400/20 rounded-full blur-xl scale-150 animate-pulse" />
              {/* Play button */}
              <div className="relative bg-gradient-to-br from-cyan-400 to-cyan-600 rounded-full p-4 shadow-2xl transform transition-transform duration-300 group-hover:scale-110">
                <Play size={isSmall ? 20 : 28} fill="currentColor" className="text-white ml-0.5" />
              </div>
            </div>
          </div>
        </div>

        {/* Content Section - Pulled up into gradient */}
        <div className={`flex-1 flex flex-col ${isSmall ? 'px-4 pb-4 pt-3' : 'px-5 pb-5 pt-4'} relative -mt-8 z-10`}>
          {/* Game Title */}
          <h3 className={`font-bold text-white mb-2 leading-tight ${isSmall ? 'text-base' : 'text-xl'} group-hover:text-cyan-300 transition-colors duration-300`}>
            {game.name}
          </h3>

          {/* Description */}
          {!isSmall && (
            <p className="text-sm text-gray-400 leading-relaxed mb-4 flex-1">
              {game.description}
            </p>
          )}

          {/* Card Footer: Tag & Play Link */}
          <div className="flex items-center justify-between pt-3 border-t border-cyan-500/10">
            {/* Tag (Bottom Left) */}
            <div className="flex items-center gap-1.5 bg-cyan-500/5 border border-cyan-500/10 px-2 py-0.5 rounded text-[10px] font-medium text-cyan-300/80">
              <Zap size={10} className="text-cyan-400/80" />
              {game.badge}
            </div>

            {/* Play Now Link */}
            <span className="flex items-center gap-1.5 text-xs font-semibold text-cyan-400 group-hover:text-cyan-300 group-hover:gap-2 transition-all duration-300">
              Play Now
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform duration-300" />
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function Home() {
  const { user } = useAuthStore();
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const { current } = scrollRef;
      const scrollAmount = direction === 'left' ? -350 : 350;
      current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };
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
      transition: { staggerChildren: 0.05 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8 space-y-10">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4 py-12"
        >
          <h1 className="text-5xl md:text-7xl font-black bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent drop-shadow-2xl">
            Start Your Challenge
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto font-light">
            {user ? `Welcome back, ${user.username}! Ready to level up?` : 'Level up your developer skills in 60 seconds'}
          </p>
        </motion.div>

        {/* Recently Played */}
        {recentlyPlayedGames.length > 0 && (
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-5"
          >
            <div className="flex items-center gap-4">
              <h2 className="text-2xl font-bold text-white">Recently Played</h2>
              <div className="h-px flex-1 bg-gradient-to-r from-cyan-500/30 to-transparent" />
            </div>

            <div className="relative group/carousel">
              {/* Left Button */}
              <button
                onClick={() => scroll('left')}
                className="absolute left-0 top-1/2 -translate-y-1/2 -ml-5 z-20 bg-black/60 hover:bg-cyan-500 text-white p-3 rounded-full backdrop-blur-xl border border-white/10 shadow-xl opacity-0 group-hover/carousel:opacity-100 transition-all duration-300 hover:scale-110"
                aria-label="Scroll left"
              >
                <ChevronLeft size={20} />
              </button>

              {/* Scroll Container */}
              <div
                ref={scrollRef}
                className="flex gap-5 overflow-x-auto pb-4 scroll-smooth snap-x snap-mandatory px-1 [&::-webkit-scrollbar]:hidden"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {recentlyPlayedGames.map((game) => (
                  <div key={game.id} className="w-72 shrink-0 snap-center">
                    <GameCard
                      game={game}
                      size="small"
                      onClick={() => handleGameClick(game.id)}
                    />
                  </div>
                ))}
              </div>

              {/* Right Button */}
              <button
                onClick={() => scroll('right')}
                className="absolute right-0 top-1/2 -translate-y-1/2 -mr-5 z-20 bg-black/60 hover:bg-cyan-500 text-white p-3 rounded-full backdrop-blur-xl border border-white/10 shadow-xl opacity-0 group-hover/carousel:opacity-100 transition-all duration-300 hover:scale-110"
                aria-label="Scroll right"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </motion.section>
        )}

        {/* Sort Controls */}
        {/* Sort Controls - Pill Buttons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-4"
        >
          <div className="flex items-center justify-between flex-wrap gap-4">
            {/* Left: Sort Options */}
            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold text-gray-400 uppercase tracking-wider">

              </span>
              <div className="flex items-center gap-2 flex-wrap">
                {SORT_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setSortBy(opt.value)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${sortBy === opt.value
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/30 scale-105'
                      : 'bg-gradient-to-br from-[#0a1628] to-[#0d1b2a] text-gray-400 border border-cyan-500/20 hover:border-cyan-400/40 hover:text-cyan-300'
                      }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Right: Game Count */}
            {filteredGames.length > 0 && (
              <div className="flex items-center gap-2 px-4 py-2 bg-cyan-500/10 border border-cyan-400/20 rounded-lg backdrop-blur-sm">
                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
                <span className="text-sm font-semibold text-cyan-300">
                  {filteredGames.length} {filteredGames.length === 1 ? 'Game' : 'Games'}
                </span>
              </div>
            )}
          </div>
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
            className="text-center py-20"
          >
            <div className="text-7xl mb-6 opacity-50">🔍</div>
            <h3 className="text-3xl font-bold text-gray-300 mb-3">No games found</h3>
            <p className="text-gray-500 text-lg">Try adjusting your search or filters</p>
          </motion.div>
        )}

        {/* CTA for Non-Logged Users */}
        {!user && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="relative overflow-hidden bg-gradient-to-br from-cyan-500/10 via-blue-500/10 to-purple-500/10 border border-cyan-400/20 rounded-3xl p-12 text-center backdrop-blur-sm"
          >
            {/* Animated background gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-transparent to-purple-500/5 animate-pulse" />

            <div className="relative z-10">
              <h3 className="text-3xl font-bold text-white mb-4">
                Ready to track your progress?
              </h3>
              <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
                Create a free account to save your scores, compete on leaderboards, earn achievements, and level up your skills!
              </p>
              <Link
                to="/register"
                className="inline-flex items-center gap-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold px-10 py-4 rounded-xl transition-all hover:scale-105 shadow-lg shadow-cyan-500/25 hover:shadow-cyan-400/40"
              >
                Get Started Free
                <Zap size={22} fill="currentColor" />
              </Link>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}