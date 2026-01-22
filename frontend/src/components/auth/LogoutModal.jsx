import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, X, Shield } from 'lucide-react';
import { AuthButton } from './AuthComponents';

export default function LogoutModal({ isOpen, onClose, onConfirm, loading }) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative w-full max-w-sm"
            >
              {/* Outer glow */}
              <div
                className="absolute -inset-1 rounded-3xl opacity-50 blur-xl"
                style={{
                  background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.3), rgba(139, 92, 246, 0.2))',
                }}
              />

              {/* Card */}
              <div
                className="relative rounded-2xl overflow-hidden"
                style={{
                  background: 'rgba(15, 15, 35, 0.9)',
                  backdropFilter: 'blur(20px)',
                  boxShadow: `
                    0 25px 50px -12px rgba(0, 0, 0, 0.5),
                    0 0 0 1px rgba(255, 255, 255, 0.05),
                    inset 0 1px 1px rgba(255, 255, 255, 0.05)
                  `,
                }}
              >
                {/* Top gradient line */}
                <div
                  className="absolute top-0 left-0 right-0 h-px"
                  style={{
                    background: 'linear-gradient(90deg, transparent, rgba(239, 68, 68, 0.5), rgba(139, 92, 246, 0.5), transparent)',
                  }}
                />

                {/* Close button */}
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-gray-400 hover:text-white"
                >
                  <X size={18} />
                </button>

                {/* Content */}
                <div className="p-8 text-center">
                  {/* Icon */}
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', delay: 0.1 }}
                    className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center"
                    style={{
                      background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.2), rgba(239, 68, 68, 0.05))',
                      border: '1px solid rgba(239, 68, 68, 0.3)',
                    }}
                  >
                    <Shield className="w-10 h-10 text-red-400" />
                  </motion.div>

                  {/* Title */}
                  <motion.h2
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                    className="text-2xl font-bold text-white mb-2"
                    style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                  >
                    Leaving So Soon?
                  </motion.h2>

                  {/* Description */}
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-gray-400 text-sm mb-8"
                  >
                    Are you sure you want to log out? Your progress is saved, but you'll need to sign in again to continue.
                  </motion.p>

                  {/* Streak warning */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25 }}
                    className="mb-6 p-3 rounded-xl bg-orange-500/10 border border-orange-500/30"
                  >
                    <p className="text-orange-400 text-xs font-mono flex items-center justify-center gap-2">
                      <span>🔥</span>
                      Don't break your streak! Come back tomorrow.
                    </p>
                  </motion.div>

                  {/* Buttons */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="space-y-3"
                  >
                    <AuthButton
                      variant="primary"
                      type="button"
                      onClick={onClose}
                      loading={false}
                    >
                      <Shield size={18} />
                      <span>Stay Logged In</span>
                    </AuthButton>

                    <button
                      onClick={onConfirm}
                      disabled={loading}
                      className="w-full py-3 px-6 rounded-xl font-medium text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-all border border-white/10 flex items-center justify-center gap-2"
                    >
                      {loading ? (
                        <motion.span
                          className="w-4 h-4 border-2 border-gray-500 border-t-gray-300 rounded-full"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        />
                      ) : (
                        <LogOut size={16} />
                      )}
                      <span>{loading ? 'Signing out...' : 'Yes, Log Out'}</span>
                    </button>
                  </motion.div>
                </div>

                {/* Bottom gradient line */}
                <div
                  className="absolute bottom-0 left-0 right-0 h-px"
                  style={{
                    background: 'linear-gradient(90deg, transparent, rgba(139, 92, 246, 0.3), rgba(239, 68, 68, 0.3), transparent)',
                  }}
                />
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
