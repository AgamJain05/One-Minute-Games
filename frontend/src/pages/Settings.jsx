import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Settings() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold mb-2">Settings</h1>
        <p className="text-gray-400">Manage your account and preferences.</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="card"
      >
        <h2 className="text-xl font-semibold mb-4">Account</h2>
        <p className="text-gray-400 text-sm">Update your profile, email, or password from your Account page.</p>
        <Link to="/profile" className="text-primary hover:underline text-sm mt-2 inline-block">Go to Account</Link>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="card"
      >
        <h2 className="text-xl font-semibold mb-4">Preferences</h2>
        <p className="text-gray-400 text-sm">Theme, notifications, and other options will appear here.</p>
      </motion.div>
    </div>
  );
}
