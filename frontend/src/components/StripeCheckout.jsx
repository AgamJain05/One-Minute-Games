import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { motion } from 'framer-motion';
import { Loader2, CreditCard } from 'lucide-react';
import { useAuthStore } from '@store/authStore';
import api from '@/utils/api';

// Initialize Stripe
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

export default function StripeCheckout() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { user } = useAuthStore();

  const handleCheckout = async () => {
    if (!user) {
      setError('Please login to purchase');
      return;
    }

    if (user.isPremium) {
      setError('You already have premium access');
      return;
    }

    try {
      setLoading(true);
      setError('');

      // Create checkout session
      const response = await api.post('/payment/create-checkout-session');
      const { url } = response.data;

      // Redirect to Stripe checkout
      if (url) {
        window.location.href = url;
      }
    } catch (err) {
      console.error('Checkout error:', err);
      setError(err.response?.data?.message || 'Failed to initialize checkout. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-danger bg-opacity-20 border border-danger text-danger p-3 rounded-lg text-sm"
        >
          {error}
        </motion.div>
      )}

      <button
        onClick={handleCheckout}
        disabled={loading || !user || user?.isPremium}
        className={`w-full flex items-center justify-center gap-2 py-3 px-6 rounded-lg font-bold transition-all ${
          loading || !user || user?.isPremium
            ? 'bg-gray-600 cursor-not-allowed opacity-50'
            : 'bg-gradient-to-r from-warning to-danger text-white hover:shadow-lg hover:shadow-warning/30'
        }`}
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Processing...</span>
          </>
        ) : (
          <>
            <CreditCard className="w-5 h-5" />
            <span>Checkout - $1.99</span>
          </>
        )}
      </button>

      <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
        <span>🔒 Secure payment powered by</span>
        <span className="font-bold text-primary">Stripe</span>
      </div>
    </div>
  );
}





