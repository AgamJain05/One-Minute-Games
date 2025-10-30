import { Link } from 'react-router-dom';
import { useAuthStore } from '@store/authStore';
import { User, LogOut, Trophy, Home } from 'lucide-react';
// import { DollarSign } from 'lucide-react'; // DISABLED - Uncomment when re-enabling pricing

export default function Navbar() {
  const { user, logout } = useAuthStore();

  return (
    <nav className="bg-dark-card border-b border-gray-700 sticky top-0 z-50 backdrop-blur-sm bg-opacity-80">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold text-gradient">🧪 OneMinuteLab</span>
          </Link>

          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-2 hover:text-primary transition-colors">
              <Home size={20} />
              <span>Home</span>
            </Link>
            
            {/* <Link to="/leaderboard" className="flex items-center gap-2 hover:text-primary transition-colors">
              <Trophy size={20} />
              <span>Leaderboard</span>
            </Link> */}

            {/* PRICING DISABLED - Uncomment below to re-enable */}
            {/* <Link to="/pricing" className="flex items-center gap-2 hover:text-warning transition-colors font-semibold">
              <DollarSign size={20} />
              <span>Pricing</span>
            </Link> */}

            {user ? (
              <>
                <Link to="/profile" className="flex items-center gap-2 hover:text-primary transition-colors">
                  <User size={20} />
                  <span>{user.username}</span>
                  <span className="text-xs bg-primary px-2 py-1 rounded">Lv.{user.level}</span>
                </Link>
                <button
                  onClick={logout}
                  className="flex items-center gap-2 text-danger hover:text-red-400 transition-colors"
                >
                  <LogOut size={20} />
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn-secondary py-2 px-4 text-sm">
                  Login
                </Link>
                <Link to="/register" className="btn-primary py-2 px-4 text-sm">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

