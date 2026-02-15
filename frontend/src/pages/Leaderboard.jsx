import React, { useState, useEffect, useRef, useCallback } from 'react';
import { leaderboardAPI } from '../services/api';
import PodiumCard from '../components/PodiumCard';
import LeaderboardRow from '../components/LeaderboardRow';
import toast from 'react-hot-toast';
import { Trophy, RefreshCw, ChevronDown } from 'lucide-react';

const GAMES = [
  { id: '', name: 'Global XP' },
  { id: 'codetype', name: 'CodeType' },
  { id: 'bugspotter', name: 'Bug Spotter' },
  { id: 'terminalmaster', name: 'Terminal Master' },
  { id: 'outputpredictor', name: 'Output Predictor' },
  { id: 'regexmatcher', name: 'Regex Matcher' },
  { id: 'httpstatus', name: 'HTTP Status' },
  { id: 'bigochallenge', name: 'Big O Challenge' },
  { id: 'gitcommands', name: 'Git Commands' },
  { id: 'codeblocks', name: 'Code Blocks' },
  { id: 'sqlbuilder', name: 'SQL Builder' },
  { id: 'flexbox', name: 'Flexbox Froggy' },
  { id: 'datastructure', name: 'Data Structure' },
  { id: 'colormatcher', name: 'Color Matcher' },
  { id: 'cssselector', name: 'CSS Selector' },
  { id: 'binary', name: 'Binary Challenge' },
  { id: 'jsonpath', name: 'JSON Path' },
  { id: 'debugrace', name: 'Debug Race' },
  { id: 'apiendpoint', name: 'API Endpoint' },
  { id: 'codewarriors', name: 'Code Warriors' }
];

const Leaderboard = () => {
  const [selectedGame, setSelectedGame] = useState('');
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [offset, setOffset] = useState(0);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const observerRef = useRef();
  const loadMoreRef = useRef();

  const limit = 50;

  // Fetch leaderboard data
  const fetchLeaderboard = async (isLoadMore = false) => {
    try {
      setLoading(true);
      const currentOffset = isLoadMore ? offset : 0;

      let response;
      if (selectedGame === '') {
        response = await leaderboardAPI.getGlobal({ limit, offset: currentOffset });
      } else {
        response = await leaderboardAPI.getGame(selectedGame, { limit, offset: currentOffset });
      }

      const newData = response.data.data || [];

      if (isLoadMore) {
        setLeaderboardData(prev => [...prev, ...newData]);
      } else {
        setLeaderboardData(newData);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }

      setHasMore(response.data.hasMore);
      setOffset(currentOffset + limit);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      toast.error('Failed to load leaderboard');
    } finally {
      setLoading(false);
    }
  };

  // Reset and fetch when game changes
  useEffect(() => {
    setOffset(0);
    setLeaderboardData([]);
    setHasMore(true);
    fetchLeaderboard(false);
  }, [selectedGame]);

  // Infinite scroll observer
  const lastElementRef = useCallback(node => {
    if (loading) return;
    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        fetchLeaderboard(true);
      }
    });

    if (node) observerRef.current.observe(node);
  }, [loading, hasMore]);

  // Get top 3 and rest
  const top3 = leaderboardData.slice(0, 3);
  const rest = leaderboardData.slice(3);

  const handleRefresh = () => {
    setOffset(0);
    setLeaderboardData([]);
    setHasMore(true);
    fetchLeaderboard(false);
    toast.success('Leaderboard refreshed!');
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 flex items-center justify-center gap-3">
            <Trophy size={40} className="text-yellow-400" />
            Leaderboards
          </h1>
          <p className="text-gray-400 text-lg">
            Compete with players worldwide and climb the ranks!
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between mb-8">
          {/* Game Selector */}
          <div className="relative w-full sm:w-auto">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="w-full sm:w-64 flex items-center justify-between gap-2 px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg hover:bg-gray-700 transition-colors"
            >
              <span className="text-white font-medium truncate">
                {GAMES.find(g => g.id === selectedGame)?.name || 'Global XP'}
              </span>
              <ChevronDown size={20} className={`text-gray-400 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {dropdownOpen && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-gray-800 border border-gray-700 rounded-lg shadow-xl max-h-96 overflow-y-auto z-50">
                {GAMES.map(game => (
                  <button
                    key={game.id}
                    onClick={() => {
                      setSelectedGame(game.id);
                      setDropdownOpen(false);
                    }}
                    className={`
                      w-full text-left px-4 py-3 hover:bg-gray-700 transition-colors
                      ${selectedGame === game.id ? 'bg-cyan-500/20 text-cyan-400' : 'text-gray-300'}
                    `}
                  >
                    {game.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Refresh Button */}
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-3 bg-cyan-500 hover:bg-cyan-600 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors"
          >
            <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
            <span>Refresh</span>
          </button>
        </div>

        {/* Loading State */}
        {loading && leaderboardData.length === 0 && (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-cyan-500 mx-auto mb-4"></div>
            <p className="text-gray-400">Loading leaderboard...</p>
          </div>
        )}

        {/* Podium - Top 3 */}
        {!loading && top3.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-center mb-6 text-white">🏆 Top 3 🏆</h2>
            <div className="flex items-end justify-center gap-4 flex-wrap md:flex-nowrap">
              {top3.length >= 2 && <PodiumCard player={top3[1]} position={2} />}
              {top3.length >= 1 && <PodiumCard player={top3[0]} position={1} />}
              {top3.length >= 3 && <PodiumCard player={top3[2]} position={3} />}
            </div>
          </div>
        )}

        {/* Rest of Leaderboard */}
        {rest.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-xl font-bold text-white mb-4">All Rankings</h2>
            {rest.map((player, index) => {
              const rank = index + 4;
              const isLast = index === rest.length - 1;

              return (
                <div
                  key={player._id}
                  ref={isLast ? lastElementRef : null}
                >
                  <LeaderboardRow player={player} rank={rank} />
                </div>
              );
            })}
          </div>
        )}

        {/* Loading More Indicator */}
        {loading && leaderboardData.length > 0 && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-cyan-500 mx-auto"></div>
            <p className="text-gray-400 mt-2 text-sm">Loading more...</p>
          </div>
        )}

        {/* No More Data */}
        {!hasMore && leaderboardData.length > 0 && (
          <div className="text-center py-8 text-gray-400">
            🎉 You've reached the end of the leaderboard!
          </div>
        )}

        {/* Empty State */}
        {!loading && leaderboardData.length === 0 && (
          <div className="text-center py-20">
            <Trophy size={64} className="text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 text-lg">No scores yet for this game.</p>
            <p className="text-gray-500 text-sm mt-2">Be the first to play and set a record!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;
