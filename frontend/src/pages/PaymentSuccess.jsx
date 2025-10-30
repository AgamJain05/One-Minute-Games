import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, Loader2, Crown, ArrowRight } from 'lucide-react';
import { useAuthStore } from '@store/authStore';
import api from '@/utils/api';

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, updateUser } = useAuthStore();
  const [verifying, setVerifying] = useState(true);
  const [error, setError] = useState('');
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    const verifyPayment = async () => {
      if (!sessionId) {
        setError('No session ID found');
        setVerifying(false);
        return;
      }

      try {
        // Verify the payment session
        const response = await api.post('/payment/verify-session', { sessionId });
        
        if (response.data.success) {
          // Update user in global state
          if (updateUser) {
            updateUser({ isPremium: true });
          }
          setVerifying(false);
        }
      } catch (err) {
        console.error('Payment verification error:', err);
        setError(err.response?.data?.message || 'Failed to verify payment');
        setVerifying(false);
      }
    };

    verifyPayment();
  }, [sessionId, updateUser]);

  if (verifying) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="card text-center max-w-md"
        >
          <Loader2 className="w-16 h-16 text-primary animate-spin mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Verifying Payment...</h2>
          <p className="text-gray-400">Please wait while we confirm your purchase</p>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="card text-center max-w-md"
        >
          <div className="w-16 h-16 bg-danger bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-4xl">❌</span>
          </div>
          <h2 className="text-2xl font-bold mb-2">Verification Failed</h2>
          <p className="text-gray-400 mb-6">{error}</p>
          <div className="flex gap-4">
            <button
              onClick={() => navigate('/pricing')}
              className="flex-1 btn-secondary"
            >
              Back to Pricing
            </button>
            <button
              onClick={() => navigate('/profile')}
              className="flex-1 btn-primary"
            >
              My Profile
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="card text-center max-w-2xl"
      >
        {/* Success Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="w-20 h-20 bg-success bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-6"
        >
          <CheckCircle className="w-12 h-12 text-success" />
        </motion.div>

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h1 className="text-4xl font-bold text-gradient mb-4">
            Welcome to Premium! 🎉
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            You now have lifetime access to all 19 games!
          </p>
        </motion.div>

        {/* Premium Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-dark-bg rounded-lg p-6 mb-8"
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <Crown className="w-6 h-6 text-warning" />
            <h3 className="text-xl font-bold">Premium Access Unlocked</h3>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4 text-left">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">All 19 Games</p>
                <p className="text-sm text-gray-400">Complete access to every challenge</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Code Warriors</p>
                <p className="text-sm text-gray-400">Epic 2-player battle game</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Global Leaderboards</p>
                <p className="text-sm text-gray-400">Compete with developers worldwide</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Future Updates</p>
                <p className="text-sm text-gray-400">All new games & features</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Email Confirmation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="bg-primary bg-opacity-10 border border-primary rounded-lg p-4 mb-8"
        >
          <p className="text-sm text-gray-300">
            📧 A receipt has been sent to <strong className="text-white">{user?.email}</strong>
          </p>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <button
            onClick={() => navigate('/')}
            className="flex-1 btn-primary flex items-center justify-center gap-2"
          >
            <span>Start Playing</span>
            <ArrowRight className="w-5 h-5" />
          </button>
          
          <button
            onClick={() => navigate('/profile')}
            className="flex-1 btn-secondary"
          >
            View Profile
          </button>
        </motion.div>

        {/* Support */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mt-8 pt-6 border-t border-gray-700"
        >
          <p className="text-sm text-gray-400">
            Need help? Contact us at <a href="mailto:support@devminute.com" className="text-primary hover:underline">support@devminute.com</a>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}





