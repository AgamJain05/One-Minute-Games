import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { authAPI } from '@services/api';
import { useAuthStore } from '@store/authStore';
import AuthBackground from '@components/auth/AuthBackground';
import { AuthCard, AuthInput, AuthButton, AuthDivider } from '@components/auth/AuthComponents';
import { User, Lock, ArrowRight, Zap } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [shake, setShake] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      const { data } = await authAPI.login(formData);
      setAuth(data.user, data.token);
      toast.success('Welcome back!');
      navigate('/games');
    } catch (error) {
      setShake(true);
      setTimeout(() => setShake(false), 500);
      const message = error.response?.data?.message || 'Login failed';
      setErrors({ general: message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      <AuthBackground />
      
      {/* Main content */}
      <motion.div
        className="relative z-10 w-full max-w-md"
        animate={shake ? { x: [-10, 10, -10, 10, 0] } : {}}
        transition={{ duration: 0.4 }}
      >
        <AuthCard
          title="Welcome Back"
          subtitle="Sign in to continue your coding journey"
        >
          {/* Error message */}
          <AnimatePresence>
            {errors.general && (
              <motion.div
                initial={{ opacity: 0, y: -10, height: 0 }}
                animate={{ opacity: 1, y: 0, height: 'auto' }}
                exit={{ opacity: 0, y: -10, height: 0 }}
                className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30"
              >
                <p className="text-red-400 text-sm text-center font-mono">{errors.general}</p>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-5">
            <AuthInput
              label="Username"
              type="text"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              placeholder="Enter your username"
              required
              icon={<User size={18} />}
              error={errors.username}
            />

            <AuthInput
              label="Password"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="Enter your password"
              required
              icon={<Lock size={18} />}
              error={errors.password}
            />

            {/* Forgot password link */}
            <div className="text-right">
              <button
                type="button"
                className="text-xs text-gray-500 hover:text-violet-400 transition-colors font-mono"
              >
                Forgot password?
              </button>
            </div>

            <AuthButton loading={loading}>
              <span>Sign In</span>
              <ArrowRight size={18} />
            </AuthButton>
          </form>

          <AuthDivider text="new here?" />

          {/* Register link */}
          <Link to="/register">
            <AuthButton variant="secondary" type="button">
              <Zap size={18} />
              <span>Create Account</span>
            </AuthButton>
          </Link>

          {/* Footer text */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center mt-8 text-xs text-gray-500 font-mono"
          >
            By signing in, you agree to our{' '}
            <a href="#" className="text-violet-400 hover:underline">Terms</a>
            {' '}&{' '}
            <a href="#" className="text-violet-400 hover:underline">Privacy Policy</a>
          </motion.p>
        </AuthCard>

        {/* Stats or social proof */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-8 flex justify-center items-center gap-8 text-center"
        >
          <div>
            <div className="text-2xl font-bold text-white">10K+</div>
            <div className="text-xs text-gray-500">Developers</div>
          </div>
          <div className="w-px h-8 bg-white/10" />
          <div>
            <div className="text-2xl font-bold text-white">50K+</div>
            <div className="text-xs text-gray-500">Challenges</div>
          </div>
          <div className="w-px h-8 bg-white/10" />
          <div>
            <div className="text-2xl font-bold text-white">99%</div>
            <div className="text-xs text-gray-500">Uptime</div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}



