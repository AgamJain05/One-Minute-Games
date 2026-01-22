import express from 'express';
const router = express.Router();
import AnalyticsEvent from '../models/AnalyticsEvent.js';
import User from '../models/User.js';
import auth from '../middleware/auth.js';

// Public: Track pageviews (no auth required)
router.post('/track', async (req, res) => {
  try {
    const { type, path, referrer } = req.body || {};
    if (!type) return res.status(400).json({ message: 'type is required' });

    await AnalyticsEvent.create({
      type,
      path,
      referrer,
      userAgent: req.headers['user-agent'],
      ip: req.ip,
      userId: req.userId || undefined,
    });

    res.status(204).send();
  } catch (err) {
    console.error('Analytics track error:', err);
    res.status(500).json({ message: 'Failed to track event' });
  }
});

// Auth: Track signup (or rely on register route to call directly)
router.post('/signup', auth, async (req, res) => {
  try {
    await AnalyticsEvent.create({
      type: 'signup',
      userId: req.userId,
      userAgent: req.headers['user-agent'],
      ip: req.ip,
    });
    res.status(204).send();
  } catch (err) {
    console.error('Analytics signup error:', err);
    res.status(500).json({ message: 'Failed to track signup' });
  }
});

// Summary metrics (auth optional; tighten later if needed)
router.get('/summary', auth, async (req, res) => {
  try {
    const me = await User.findById(req.userId).select('isAdmin');
    if (!me || !me.isAdmin) return res.status(403).json({ message: 'Admins only' });

    const [totalUsers, totalPageviews, totalSignups] = await Promise.all([
      User.countDocuments(),
      AnalyticsEvent.countDocuments({ type: 'pageview' }),
      AnalyticsEvent.countDocuments({ type: 'signup' }),
    ]);

    // Last 7 days by day
    const since = new Date();
    since.setDate(since.getDate() - 6);
    since.setHours(0, 0, 0, 0);

    const pipeline = (type) => ([
      { $match: { type, createdAt: { $gte: since } } },
      { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]);

    const [pvSeries, suSeries] = await Promise.all([
      AnalyticsEvent.aggregate(pipeline('pageview')),
      AnalyticsEvent.aggregate(pipeline('signup')),
    ]);

    res.json({
      totals: { users: totalUsers, pageviews: totalPageviews, signups: totalSignups },
      series: { pageviews: pvSeries, signups: suSeries },
      since: since.toISOString(),
    });
  } catch (err) {
    console.error('Analytics summary error:', err);
    res.status(500).json({ message: 'Failed to load analytics summary' });
  }
});

export default router;


