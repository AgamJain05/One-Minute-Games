import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Check, X, Crown, Zap } from 'lucide-react';
import { useAuthStore } from '@store/authStore';
import StripeCheckout from '@components/StripeCheckout';

const FREE_GAMES = [
  'CodeType',
  'Bug Spotter',
  'Terminal Master',
  'Output Predictor',
  'Regex Matcher'
];

const PREMIUM_ONLY_GAMES = [
  'HTTP Status Quiz',
  'Big-O Challenge',
  'Git Command Rush',
  'Code Block Arranger',
  'SQL Query Builder',
  'Flexbox Frenzy',
  'Data Structure Builder',
  'Color Code Matcher',
  'CSS Selector Ninja',
  'Binary Blitz',
  'JSON Path Finder',
  'Debug Race',
  'API Endpoint Rush',
  'Code Warriors'
];

export default function Pricing() {
  const { user } = useAuthStore();
  
  const plans = [
    {
      name: 'Free',
      price: '$0',
      period: 'forever',
      description: 'Perfect for getting started',
      icon: Zap,
      color: 'text-primary',
      bgColor: 'bg-primary',
      features: [
        { text: '5 Games Access', included: true },
        { text: 'Score Tracking', included: true },
        { text: 'Personal Best Records', included: true },
        { text: 'Basic Profile', included: true },
        { text: 'All 19 Games', included: false },
        { text: 'Code Warriors Battle', included: false },
        { text: 'Advanced Games', included: false },
        { text: 'Priority Support', included: false }
      ],
      cta: 'Get Started Free',
      link: '/register',
      popular: false
    },
    {
      name: 'Full Access',
      price: '$1.99',
      period: 'one-time',
      description: 'Unlock all games forever!',
      icon: Crown,
      color: 'text-warning',
      bgColor: 'bg-warning',
      features: [
        { text: 'All 19 Games Unlocked', included: true },
        { text: 'Code Warriors Battle', included: true },
        { text: 'Score Tracking', included: true },
        { text: 'Personal Best Records', included: true },
        { text: 'Full Profile Access', included: true },
        { text: 'Global Leaderboards', included: true },
        { text: 'Future Game Updates', included: true },
        { text: 'Priority Support', included: true }
      ],
      cta: 'Unlock Full Access',
      link: '/register',
      popular: true
    }
  ];

  return (
    <div className="space-y-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <h1 className="text-5xl font-bold text-gradient">
          Choose Your Plan
        </h1>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
          Start free or unlock all 19 games with a one-time payment of just $1.99!
        </p>
      </motion.div>

      {/* Pricing Cards */}
      <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {plans.map((plan, index) => (
          <motion.div
            key={plan.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`card relative ${
              plan.popular 
                ? 'border-2 border-warning shadow-lg shadow-warning/20' 
                : ''
            }`}
          >
            {/* Popular Badge */}
            {plan.popular && (
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-gradient-to-r from-warning to-danger text-white px-4 py-1 rounded-full text-sm font-bold">
                  🔥 BEST VALUE
                </span>
              </div>
            )}

            <div className="text-center mb-6">
              {/* Icon */}
              <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${plan.bgColor} bg-opacity-20 mb-4`}>
                <plan.icon className={`w-8 h-8 ${plan.color}`} />
              </div>

              {/* Plan Name */}
              <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
              
              {/* Price */}
              <div className="flex items-baseline justify-center gap-2 mb-2">
                <span className="text-5xl font-bold text-gradient">{plan.price}</span>
                <span className="text-gray-400">/ {plan.period}</span>
              </div>

              {/* Description */}
              <p className="text-gray-400">{plan.description}</p>
            </div>

            {/* Features */}
            <div className="space-y-3 mb-8">
              {plan.features.map((feature, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  {feature.included ? (
                    <Check className="w-5 h-5 text-success flex-shrink-0" />
                  ) : (
                    <X className="w-5 h-5 text-gray-600 flex-shrink-0" />
                  )}
                  <span className={feature.included ? 'text-gray-300' : 'text-gray-600'}>
                    {feature.text}
                  </span>
                </div>
              ))}
            </div>

            {/* CTA Button */}
            {plan.popular ? (
              // Premium plan with Stripe checkout
              user?.isPremium ? (
                <div className="text-center py-3 px-6 rounded-lg font-bold bg-success bg-opacity-20 border-2 border-success text-success">
                  ✓ Already Unlocked
                </div>
              ) : (
                <StripeCheckout />
              )
            ) : (
              // Free plan with link
              <Link 
                to={plan.link}
                className="block text-center py-3 px-6 rounded-lg font-bold transition-all btn-secondary"
              >
                {plan.cta}
              </Link>
            )}
          </motion.div>
        ))}
      </div>

      {/* Games Breakdown */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="max-w-5xl mx-auto"
      >
        <h2 className="text-3xl font-bold text-center mb-8">What Games Are Included?</h2>
        
        <div className="grid md:grid-cols-2 gap-8">
          {/* Free Games */}
          <div className="card">
            <div className="flex items-center gap-3 mb-6">
              <Zap className="w-6 h-6 text-primary" />
              <h3 className="text-xl font-bold">Free Games ({FREE_GAMES.length})</h3>
            </div>
            <div className="space-y-2">
              {FREE_GAMES.map((game, idx) => (
                <div key={idx} className="flex items-center gap-3 text-gray-300">
                  <Check className="w-4 h-4 text-success" />
                  <span>{game}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Premium Games */}
          <div className="card border-2 border-warning">
            <div className="flex items-center gap-3 mb-6">
              <Crown className="w-6 h-6 text-warning" />
              <h3 className="text-xl font-bold">Premium Games ({PREMIUM_ONLY_GAMES.length})</h3>
              <span className="text-xs bg-warning text-white px-2 py-1 rounded-full">$1.99</span>
            </div>
            <div className="space-y-2">
              {PREMIUM_ONLY_GAMES.map((game, idx) => (
                <div key={idx} className="flex items-center gap-3 text-gray-300">
                  <Crown className="w-4 h-4 text-warning" />
                  <span>{game}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* FAQ Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="max-w-3xl mx-auto"
      >
        <h2 className="text-3xl font-bold text-center mb-8">Frequently Asked Questions</h2>
        
        <div className="space-y-4">
          <div className="card">
            <h3 className="text-lg font-bold mb-2">Is the free plan really free forever?</h3>
            <p className="text-gray-400">
              Yes! The free plan gives you access to 5 great games with no time limits or hidden fees.
            </p>
          </div>

          <div className="card">
            <h3 className="text-lg font-bold mb-2">Is the $1.99 payment one-time or recurring?</h3>
            <p className="text-gray-400">
              It's a <strong className="text-success">one-time payment</strong>! Pay once and unlock all 19 games forever, including future updates.
            </p>
          </div>

          <div className="card">
            <h3 className="text-lg font-bold mb-2">Can I upgrade from Free to Full Access later?</h3>
            <p className="text-gray-400">
              Absolutely! You can upgrade anytime from your profile page. Your progress and scores will be preserved.
            </p>
          </div>

          <div className="card">
            <h3 className="text-lg font-bold mb-2">Do I need to create an account?</h3>
            <p className="text-gray-400">
              You can play without an account, but creating one (free!) lets you save scores, track progress, and unlock achievements.
            </p>
          </div>

          <div className="card">
            <h3 className="text-lg font-bold mb-2">What payment methods do you accept?</h3>
            <p className="text-gray-400">
              We accept all major credit cards, PayPal, and various other payment methods through our secure payment processor.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Final CTA */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5 }}
        className="card bg-gradient-to-r from-primary to-secondary text-center max-w-3xl mx-auto"
      >
        <h2 className="text-3xl font-bold mb-4">Ready to Level Up Your Skills?</h2>
        <p className="text-xl text-gray-200 mb-6">
          Join thousands of developers improving their coding skills one minute at a time!
        </p>
        <div className="flex gap-4 justify-center">
          <Link to="/register" className="bg-white text-primary px-8 py-3 rounded-lg font-bold hover:shadow-lg transition-all">
            Start Free
          </Link>
          <Link to="/register" className="bg-warning text-white px-8 py-3 rounded-lg font-bold hover:shadow-lg transition-all">
            Get Full Access - $1.99
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

