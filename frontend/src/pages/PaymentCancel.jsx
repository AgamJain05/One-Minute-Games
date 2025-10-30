import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { XCircle, ArrowLeft, CreditCard } from 'lucide-react';

export default function PaymentCancel() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="card text-center max-w-md"
      >
        {/* Cancel Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="w-20 h-20 bg-warning bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-6"
        >
          <XCircle className="w-12 h-12 text-warning" />
        </motion.div>

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h1 className="text-3xl font-bold mb-4">Payment Cancelled</h1>
          <p className="text-gray-400 mb-8">
            Your payment was cancelled. No charges were made to your account.
          </p>
        </motion.div>

        {/* Info Box */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-dark-bg rounded-lg p-6 mb-8 text-left"
        >
          <h3 className="font-bold mb-3">What happened?</h3>
          <ul className="space-y-2 text-sm text-gray-400">
            <li>✓ You closed the checkout page</li>
            <li>✓ No payment was processed</li>
            <li>✓ You can try again anytime</li>
            <li>✓ Your account is unchanged</li>
          </ul>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col gap-4"
        >
          <button
            onClick={() => navigate('/pricing')}
            className="btn-primary flex items-center justify-center gap-2"
          >
            <CreditCard className="w-5 h-5" />
            <span>Try Again</span>
          </button>
          
          <button
            onClick={() => navigate('/')}
            className="btn-secondary flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Home</span>
          </button>
        </motion.div>

        {/* Support */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-8 pt-6 border-t border-gray-700"
        >
          <p className="text-sm text-gray-400">
            Still want premium? The offer is still available!
          </p>
          <p className="text-xs text-gray-500 mt-2">
            Questions? <a href="mailto:support@devminute.com" className="text-primary hover:underline">Contact support</a>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}





