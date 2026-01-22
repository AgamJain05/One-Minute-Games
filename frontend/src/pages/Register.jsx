import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { authAPI, analyticsAPI } from '@services/api';
import { useAuthStore } from '@store/authStore';
import AuthBackground from '@components/auth/AuthBackground';
import { AuthCard, AuthInput, AuthButton, AuthDivider } from '@components/auth/AuthComponents';
import { User, Lock, ArrowRight, LogIn, CheckCircle } from 'lucide-react';

export default function Register() {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [shake, setShake] = useState(false);

  // Password strength indicator
  const getPasswordStrength = (password) => {
    if (!password) return { strength: 0, label: '', color: '' };
    let strength = 0;
    if (password.length >= 6) strength++;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;

    const levels = [
      { label: 'Too weak', color: 'bg-red-500' },
      { label: 'Weak', color: 'bg-orange-500' },
      { label: 'Fair', color: 'bg-yellow-500' },
      { label: 'Good', color: 'bg-blue-500' },
      { label: 'Strong', color: 'bg-green-500' },
    ];

    return { strength, ...levels[Math.min(strength, 4)] };
  };

  const passwordStrength = getPasswordStrength(formData.password);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      const { data } = await authAPI.register(formData);
      setAuth(data.user, data.token);
      analyticsAPI.signup();
      toast.success('Account created successfully!');
      navigate('/games');
    } catch (error) {
      setShake(true);
      setTimeout(() => setShake(false), 500);
      const message = error.response?.data?.message || 'Registration failed';
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
          title="Create Account"
          subtitle="Start your DevMinute journey today"
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
              placeholder="Choose a unique username"
              required
              minLength={3}
              maxLength={20}
              icon={<User size={18} />}
              helperText="3-20 characters"
              error={errors.username}
            />

            <div className="space-y-2">
              <AuthInput
                label="Password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Create a strong password"
                required
                minLength={6}
                icon={<Lock size={18} />}
                helperText="Minimum 6 characters"
                error={errors.password}
              />
              
              {/* Password strength meter */}
              {formData.password && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="space-y-2"
                >
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <motion.div
                        key={i}
                        className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
                          i < passwordStrength.strength ? passwordStrength.color : 'bg-white/10'
                        }`}
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ delay: i * 0.1 }}
                      />
                    ))}
                  </div>
                  <p className={`text-xs font-mono ${
                    passwordStrength.strength < 2 ? 'text-red-400' :
                    passwordStrength.strength < 4 ? 'text-yellow-400' : 'text-green-400'
                  }`}>
                    {passwordStrength.label}
                  </p>
                </motion.div>
              )}
            </div>

            {/* Benefits list */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="space-y-2 py-4"
            >
              {[
                'Access to 19+ coding games',
                'Track your progress & streaks',
                'Compete on global leaderboards',
              ].map((benefit, i) => (
                <motion.div
                  key={benefit}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + i * 0.1 }}
                  className="flex items-center gap-2 text-sm text-gray-400"
                >
                  <CheckCircle size={14} className="text-violet-400" />
                  <span>{benefit}</span>
                </motion.div>
              ))}
            </motion.div>

            <AuthButton loading={loading}>
              <span>Create Account</span>
              <ArrowRight size={18} />
            </AuthButton>
          </form>

          <AuthDivider text="already a member?" />

          {/* Login link */}
          <Link to="/login">
            <AuthButton variant="secondary" type="button">
              <LogIn size={18} />
              <span>Sign In</span>
            </AuthButton>
          </Link>

          {/* Footer text */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center mt-8 text-xs text-gray-500 font-mono"
          >
            By creating an account, you agree to our{' '}
            <a href="#" className="text-violet-400 hover:underline">Terms</a>
            {' '}&{' '}
            <a href="#" className="text-violet-400 hover:underline">Privacy Policy</a>
          </motion.p>
        </AuthCard>

        {/* Progress hint */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-8 text-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10">
            <motion.div
              className="w-2 h-2 rounded-full bg-green-400"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <span className="text-xs text-gray-400 font-mono">
              Join 10,000+ developers leveling up daily
            </span>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}



