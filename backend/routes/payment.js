const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { protect } = require('../middleware/auth');
const User = require('../models/User');

// @desc    Create Stripe checkout session
// @route   POST /api/payment/create-checkout-session
// @access  Private
router.post('/create-checkout-session', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (user.isPremium) {
      return res.status(400).json({ message: 'You already have premium access' });
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'DevMinute - Full Access',
              description: 'Unlock all 19 games with lifetime access',
              images: ['https://via.placeholder.com/300x300.png?text=DevMinute'],
            },
            unit_amount: 199, // $1.99 in cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/pricing`,
      client_reference_id: user._id.toString(),
      customer_email: user.email,
      metadata: {
        userId: user._id.toString(),
      },
    });

    res.json({ sessionId: session.id, url: session.url });
  } catch (error) {
    console.error('Stripe checkout error:', error);
    res.status(500).json({ message: 'Error creating checkout session', error: error.message });
  }
});

// @desc    Verify payment and update user
// @route   POST /api/payment/verify-session
// @access  Private
router.post('/verify-session', protect, async (req, res) => {
  try {
    const { sessionId } = req.body;

    if (!sessionId) {
      return res.status(400).json({ message: 'Session ID is required' });
    }

    // Retrieve the session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status === 'paid') {
      // Update user to premium
      const user = await User.findById(req.user.id);
      
      if (!user.isPremium) {
        user.isPremium = true;
        user.premiumPurchasedAt = new Date();
        user.stripeCustomerId = session.customer;
        user.stripePaymentId = session.payment_intent;
        await user.save();
      }

      res.json({ 
        success: true, 
        message: 'Premium access activated!',
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          isPremium: user.isPremium,
          premiumPurchasedAt: user.premiumPurchasedAt
        }
      });
    } else {
      res.status(400).json({ message: 'Payment not completed' });
    }
  } catch (error) {
    console.error('Payment verification error:', error);
    res.status(500).json({ message: 'Error verifying payment', error: error.message });
  }
});

// @desc    Stripe webhook handler
// @route   POST /api/payment/webhook
// @access  Public (Stripe webhook)
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object;
      
      // Update user to premium
      if (session.metadata.userId) {
        try {
          const user = await User.findById(session.metadata.userId);
          if (user && !user.isPremium) {
            user.isPremium = true;
            user.premiumPurchasedAt = new Date();
            user.stripeCustomerId = session.customer;
            user.stripePaymentId = session.payment_intent;
            await user.save();
            console.log(`User ${user.username} upgraded to premium`);
          }
        } catch (error) {
          console.error('Error updating user after payment:', error);
        }
      }
      break;

    case 'payment_intent.succeeded':
      console.log('Payment intent succeeded:', event.data.object.id);
      break;

    case 'payment_intent.payment_failed':
      console.log('Payment intent failed:', event.data.object.id);
      break;

    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
});

// @desc    Get user premium status
// @route   GET /api/payment/status
// @access  Private
router.get('/status', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    res.json({
      isPremium: user.isPremium,
      premiumPurchasedAt: user.premiumPurchasedAt,
    });
  } catch (error) {
    console.error('Error fetching premium status:', error);
    res.status(500).json({ message: 'Error fetching premium status' });
  }
});

module.exports = router;





