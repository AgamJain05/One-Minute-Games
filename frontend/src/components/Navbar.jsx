import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { useAuthStore } from '@store/authStore';
import {
  User,
  LogOut,
  Home,
  Search,
  ChevronDown,
  UserCircle,
  Settings,
  Trophy,
  Zap,
  Flame,
  Menu,
  X,
  Bell,
  Star
} from 'lucide-react';
import LogoutModal from '@components/auth/LogoutModal';

export default function Navbar() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const profileRef = useRef(null);

  const isOnGames = location.pathname === '/games';
  const qFromUrl = searchParams.get('q') || '';

  useEffect(() => {
    if (isOnGames) setSearchInput(qFromUrl);
  }, [isOnGames, qFromUrl]);

  useEffect(() => {
    function handleClickOutside(e) {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    setLoggingOut(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    logout();
    setShowLogoutModal(false);
    setLoggingOut(false);
    navigate('/');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const value = searchInput.trim();
    navigate(value ? `/games?q=${encodeURIComponent(value)}` : '/games');
    setProfileOpen(false);
    setMobileMenuOpen(false);
  };

  // Calculate XP progress to next level
  const getXPProgress = () => {
    if (!user) return 0;
    const currentLevel = user.level || 1;
    const xpForNextLevel = currentLevel * currentLevel * 100;
    const currentXP = user.totalXP || 0;
    const xpForCurrentLevel = (currentLevel - 1) * (currentLevel - 1) * 100;
    const xpInLevel = currentXP - xpForCurrentLevel;
    const xpNeededForLevel = xpForNextLevel - xpForCurrentLevel;
    return Math.min((xpInLevel / xpNeededForLevel) * 100, 100);
  };

  return (
    <>
      {/* Main Navbar */}
      {/* Main Navbar */}
      <nav className="fixed top-0 w-full z-50 backdrop-blur-sm bg-transparent transition-all duration-300">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="flex items-center justify-between h-20 gap-4">

            {/* Logo */}
            <Link
              to="/games"
              className="flex items-center gap-3 shrink-0 group"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-primary to-purple-500 rounded-xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity" />
                <div className="relative bg-gradient-to-br from-primary via-purple-500 to-pink-500 p-2.5 rounded-xl shadow-lg">
                  {/* Empty span removed as per user edit cleaning */}
                </div>
              </div>
              <div className="hidden sm:block">
                <span className="text-xl font-black bg-gradient-to-r from-primary via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  OneMinuteLab
                </span>
                <div className="text-[10px] text-gray-400 font-medium -mt-1 tracking-wider">
                  LEVEL UP YOUR SKILLS
                </div>
              </div>
            </Link>

            {/* Main Navigation - Desktop */}
            <div className="hidden lg:flex items-center gap-1 bg-black/20 p-1 rounded-full border border-white/5 backdrop-blur-sm">
              <Link
                to="/games"
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${location.pathname === '/games'
                  ? 'bg-primary/20 text-primary shadow-[0_0_15px_rgba(var(--primary-rgb),0.3)]'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
              >
                <Home size={16} />
                <span>Games</span>
              </Link>

              <Link
                to="/leaderboard"
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${location.pathname === '/leaderboard'
                  ? 'bg-primary/20 text-primary shadow-[0_0_15px_rgba(var(--primary-rgb),0.3)]'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
              >
                <Trophy size={16} />
                <span>Leaderboard</span>
              </Link>

              {user && (
                <Link
                  to="/achievements"
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${location.pathname === '/achievements'
                    ? 'bg-primary/20 text-primary shadow-[0_0_15px_rgba(var(--primary-rgb),0.3)]'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                >
                  <Star size={16} />
                  <span>Achievements</span>
                </Link>
              )}
            </div>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="flex-1 max-w-md mx-4 hidden md:block">
              <div className={`relative group transition-all duration-300 ${searchFocused ? 'scale-105' : ''}`}>
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-purple-500/20 rounded-full blur transition-opacity opacity-0 group-hover:opacity-100" />
                <div className="relative">
                  <Search
                    className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${searchFocused ? 'text-primary' : 'text-gray-400'}`}
                    size={16}
                  />
                  <input
                    type="search"
                    placeholder="Search games..."
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    onFocus={() => setSearchFocused(true)}
                    onBlur={() => setSearchFocused(false)}
                    className="w-full bg-black/20 border border-white/10 rounded-full pl-10 pr-4 py-2.5 text-sm text-gray-200 placeholder-gray-500 focus:border-primary/50 focus:bg-black/40 focus:ring-0 outline-none transition-all"
                  />
                  {searchInput && (
                    <button
                      type="button"
                      onClick={() => setSearchInput('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>
              </div>
            </form>

            {/* User Section */}
            <div className="flex items-center gap-3 shrink-0">
              {user ? (
                <>
                  {/* Quick Stats - Desktop Only */}
                  <div className="hidden xl:flex items-center gap-3 mr-2">
                    <div className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-primary/10 to-purple-500/10 rounded-lg border border-primary/20">
                      <Zap size={16} className="text-yellow-400" fill="currentColor" />
                      <span className="text-sm font-bold text-white">{user.totalXP || 0}</span>
                      <span className="text-xs text-gray-400">XP</span>
                    </div>

                    {user.currentStreak > 0 && (
                      <div className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-orange-500/10 to-red-500/10 rounded-lg border border-orange-500/20">
                        <Flame size={16} className="text-orange-400" />
                        <span className="text-sm font-bold text-white">{user.currentStreak}</span>
                        <span className="text-xs text-gray-400">days</span>
                      </div>
                    )}
                  </div>

                  {/* Notifications - Coming Soon */}
                  <button
                    className="hidden lg:flex relative p-2.5 hover:bg-gray-800/50 rounded-lg transition-colors"
                    title="Notifications"
                  >
                    <Bell size={20} className="text-gray-400" />
                    {/* <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" /> */}
                  </button>

                  {/* User Profile Dropdown */}
                  <div className="relative" ref={profileRef}>
                    <button
                      type="button"
                      onClick={() => setProfileOpen((o) => !o)}
                      className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-gray-800/50 transition-all group"
                    >
                      {/* Avatar */}
                      <div className="relative">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center font-bold text-white shadow-lg">
                          {user.username?.charAt(0).toUpperCase()}
                        </div>
                        {/* Online indicator */}
                        <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-gray-950 rounded-full" />
                      </div>

                      {/* User Info - Hidden on mobile */}
                      <div className="hidden lg:block text-left">
                        <div className="text-sm font-semibold text-white group-hover:text-primary transition-colors">
                          {user.username}
                        </div>
                        <div className="text-xs text-gray-400 flex items-center gap-1.5">
                          <span className="px-1.5 py-0.5 bg-gradient-to-r from-primary to-purple-500 text-white rounded text-[10px] font-bold">
                            LV {user.level}
                          </span>
                          <span className="text-[10px]">•</span>
                          <span className="text-[10px]">{Math.floor(getXPProgress())}% to next</span>
                        </div>
                      </div>

                      <ChevronDown
                        size={16}
                        className={`text-gray-400 transition-transform ${profileOpen ? 'rotate-180' : ''}`}
                      />
                    </button>

                    {/* Dropdown Menu */}
                    {profileOpen && (
                      <div className="absolute right-0 top-full mt-2 w-72 bg-gray-900 border border-gray-700/50 rounded-xl shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                        {/* Profile Header */}
                        <div className="p-4 bg-gradient-to-br from-primary/10 via-purple-500/10 to-pink-500/10 border-b border-gray-700/50">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center font-bold text-white text-lg shadow-lg">
                              {user.username?.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <div className="font-bold text-white">{user.username}</div>
                              <div className="text-xs text-gray-400">Level {user.level}</div>
                            </div>
                          </div>

                          {/* XP Progress Bar */}
                          <div className="space-y-1">
                            <div className="flex justify-between text-xs text-gray-400">
                              <span>Progress to Level {user.level + 1}</span>
                              <span>{Math.floor(getXPProgress())}%</span>
                            </div>
                            <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-primary to-purple-500 rounded-full transition-all duration-500"
                                style={{ width: `${getXPProgress()}%` }}
                              />
                            </div>
                          </div>

                          {/* Quick Stats Grid */}
                          <div className="grid grid-cols-3 gap-2 mt-3">
                            <div className="bg-gray-800/50 rounded-lg p-2 text-center">
                              <div className="text-xs text-gray-400">XP</div>
                              <div className="text-sm font-bold text-primary">{user.totalXP || 0}</div>
                            </div>
                            <div className="bg-gray-800/50 rounded-lg p-2 text-center">
                              <div className="text-xs text-gray-400">Streak</div>
                              <div className="text-sm font-bold text-orange-400">{user.currentStreak || 0}🔥</div>
                            </div>
                            <div className="bg-gray-800/50 rounded-lg p-2 text-center">
                              <div className="text-xs text-gray-400">Rank</div>
                              <div className="text-sm font-bold text-purple-400">#{user.rank || '—'}</div>
                            </div>
                          </div>
                        </div>

                        {/* Menu Items */}
                        <div className="py-2">
                          <Link
                            to="/profile"
                            onClick={() => setProfileOpen(false)}
                            className="flex items-center gap-3 px-4 py-2.5 text-gray-200 hover:bg-gray-800/50 hover:text-primary transition-colors"
                          >
                            <UserCircle size={18} />
                            <span>View Profile</span>
                          </Link>

                          <Link
                            to="/achievements"
                            onClick={() => setProfileOpen(false)}
                            className="flex items-center gap-3 px-4 py-2.5 text-gray-200 hover:bg-gray-800/50 hover:text-primary transition-colors"
                          >
                            <Star size={18} />
                            <span>Achievements</span>
                          </Link>

                          <Link
                            to="/settings"
                            onClick={() => setProfileOpen(false)}
                            className="flex items-center gap-3 px-4 py-2.5 text-gray-200 hover:bg-gray-800/50 hover:text-primary transition-colors"
                          >
                            <Settings size={18} />
                            <span>Settings</span>
                          </Link>
                        </div>

                        {/* Logout */}
                        <div className="border-t border-gray-700/50 p-2">
                          <button
                            onClick={() => {
                              setShowLogoutModal(true);
                              setProfileOpen(false);
                            }}
                            className="flex items-center gap-3 w-full px-4 py-2.5 text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors rounded-lg"
                          >
                            <LogOut size={18} />
                            <span>Log Out</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <>
                  {/* Guest Buttons */}
                  <Link
                    to="/login"
                    className="hidden sm:flex items-center gap-2 px-4 py-2.5 rounded-lg border border-gray-700 hover:border-gray-600 text-gray-300 hover:text-white transition-all hover:bg-gray-800/50"
                  >
                    <User size={18} />
                    <span className="font-medium">Login</span>
                  </Link>
                  <Link
                    to="/register"
                    className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-gradient-to-r from-primary to-purple-500 hover:from-primary/90 hover:to-purple-500/90 text-white font-bold transition-all shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:scale-105"
                  >
                    <Zap size={18} fill="currentColor" />
                    <span>Start Free</span>
                  </Link>
                </>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 hover:bg-gray-800/50 rounded-lg transition-colors"
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-800/50 bg-gray-950/98 backdrop-blur-xl">
            <div className="container mx-auto px-4 py-4 space-y-3">
              {/* Mobile Search */}
              <form onSubmit={handleSearch} className="md:hidden">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="search"
                    placeholder="Search games..."
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    className="w-full bg-gray-900/80 border border-gray-700/50 rounded-xl pl-10 pr-4 py-3 text-sm text-gray-200 placeholder-gray-500 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 outline-none"
                  />
                </div>
              </form>

              {/* Mobile Nav Links */}
              <Link
                to="/games"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-800/50 transition-colors"
              >
                <Home size={20} />
                <span>Games</span>
              </Link>

              <Link
                to="/leaderboard"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-800/50 transition-colors"
              >
                <Trophy size={20} />
                <span>Leaderboard</span>
              </Link>

              {user && (
                <>
                  <Link
                    to="/achievements"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-800/50 transition-colors"
                  >
                    <Star size={20} />
                    <span>Achievements</span>
                  </Link>

                  {/* Mobile Stats */}
                  <div className="grid grid-cols-3 gap-2 px-4 py-2">
                    <div className="bg-gray-800/50 rounded-lg p-3 text-center">
                      <div className="text-xs text-gray-400 mb-1">Level</div>
                      <div className="text-lg font-bold text-primary">{user.level}</div>
                    </div>
                    <div className="bg-gray-800/50 rounded-lg p-3 text-center">
                      <div className="text-xs text-gray-400 mb-1">XP</div>
                      <div className="text-lg font-bold text-purple-400">{user.totalXP || 0}</div>
                    </div>
                    <div className="bg-gray-800/50 rounded-lg p-3 text-center">
                      <div className="text-xs text-gray-400 mb-1">Streak</div>
                      <div className="text-lg font-bold text-orange-400">{user.currentStreak || 0}🔥</div>
                    </div>
                  </div>
                </>
              )}

              {!user && (
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg border border-gray-700 hover:border-gray-600 transition-colors sm:hidden"
                >
                  <User size={20} />
                  <span>Login</span>
                </Link>
              )}
            </div>
          </div>
        )}
      </nav>

      <LogoutModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleLogout}
        loading={loggingOut}
      />
    </>
  );
}