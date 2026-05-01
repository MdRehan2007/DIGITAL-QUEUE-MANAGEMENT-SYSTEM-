// ===================================================
// controllers/queueController.js
// Business logic for queue management:
//   joinQueue        → customer joins the queue
//   getQueueStatus   → customer polls their token status
//   getAllTokens      → admin sees all waiting tokens
//   callNextToken    → admin calls the next FIFO token
//   skipToken        → admin skips a specific token
//   getCounters      → list all service counters
//   getAnalytics     → superadmin views statistics
// ===================================================

const QueueToken      = require('../models/QueueToken');
const ServiceCounter  = require('../models/ServiceCounter');
const QueueAnalytics  = require('../models/QueueAnalytics');

// Assumed average service time per customer (minutes)
const AVG_SERVICE_MINUTES = 5;

// ─── Helper: recalculate queue positions ──────────
// Called after any status change to keep positions accurate.
const recalculatePositions = async () => {
  const waiting = await QueueToken.find({ status: 'waiting' }).sort('createdAt');
  for (let i = 0; i < waiting.length; i++) {
    waiting[i].queuePosition    = i + 1;
    waiting[i].estimatedWaitTime = (i + 1) * AVG_SERVICE_MINUTES;
    await waiting[i].save();
  }
};

// ─── Helper: get or create analytics doc ──────────
const getAnalyticsDoc = async () => {
  let doc = await QueueAnalytics.findOne();
  if (!doc) doc = await QueueAnalytics.create({});
  return doc;
};

// ─── Helper: seed default counters if none exist ──
const seedCountersIfEmpty = async () => {
  const count = await ServiceCounter.countDocuments();
  if (count === 0) {
    await ServiceCounter.insertMany([
      { counterName: 'Counter A', status: 'open' },
      { counterName: 'Counter B', status: 'open' },
      { counterName: 'Counter C', status: 'closed' },
    ]);
  }
};

// ═══════════════════════════════════════════════════
// POST /api/queue/join  [protected: customer]
// ═══════════════════════════════════════════════════
const joinQueue = async (req, res) => {
  try {
    // A customer can only have ONE active (waiting/called) token
    const existing = await QueueToken.findOne({
      userId: req.user._id,
      status: { $in: ['waiting', 'called'] },
    });

    if (existing) {
      return res.status(400).json({
        message: 'You already have an active token in the queue',
        token: existing,
      });
    }

    // Generate next token number by looking at the highest existing one
    const last = await QueueToken.findOne().sort({ tokenNumber: -1 });
    const tokenNumber = last ? last.tokenNumber + 1 : 1;

    // Count how many are currently waiting to set position
    const waitingCount = await QueueToken.countDocuments({ status: 'waiting' });

    // Create the token
    const token = await QueueToken.create({
      userId:            req.user._id,
      tokenNumber,
      queuePosition:     waitingCount + 1,
      estimatedWaitTime: (waitingCount + 1) * AVG_SERVICE_MINUTES,
      status:            'waiting',
    });

    // Update analytics
    const analytics = await getAnalyticsDoc();
    analytics.totalCustomers += 1;
    await analytics.save();

    res.status(201).json({
      message:       'You have joined the queue successfully!',
      token,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ═══════════════════════════════════════════════════
// GET /api/queue/status  [protected: customer]
// Returns the logged-in customer's current token.
// ═══════════════════════════════════════════════════
const getQueueStatus = async (req, res) => {
  try {
    // Find the most recent active token for this user
    const token = await QueueToken.findOne({
      userId: req.user._id,
      status: { $in: ['waiting', 'called'] },
    });

    if (!token) {
      return res.status(404).json({ message: 'No active token found. Please join the queue.' });
    }

    // Also return the token currently being served (for display)
    const calledToken = await QueueToken.findOne({ status: 'called' }).sort('-updatedAt');

    res.json({
      token,
      currentlyServing: calledToken ? calledToken.tokenNumber : null,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ═══════════════════════════════════════════════════
// GET /api/queue/all  [protected: admin, superadmin]
// Returns all tokens (grouped by status) for the
// admin dashboard.
// ═══════════════════════════════════════════════════
const getAllTokens = async (req, res) => {
  try {
    // Fetch all tokens, newest first, with user info
    const tokens = await QueueToken.find()
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });

    // Count by status for summary cards
    const waiting   = tokens.filter(t => t.status === 'waiting').length;
    const called    = tokens.filter(t => t.status === 'called').length;
    const completed = tokens.filter(t => t.status === 'completed').length;
    const skipped   = tokens.filter(t => t.status === 'skipped').length;

    // The token currently being served
    const calledToken = await QueueToken.findOne({ status: 'called' })
      .populate('userId', 'name email')
      .sort('-updatedAt');

    res.json({
      tokens,
      summary: { waiting, called, completed, skipped, total: tokens.length },
      currentlyServing: calledToken || null,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ═══════════════════════════════════════════════════
// POST /api/queue/next  [protected: admin]
// Calls the next waiting token (FIFO order).
// Marks any previously 'called' token as 'completed'.
// ═══════════════════════════════════════════════════
const callNextToken = async (req, res) => {
  try {
    // Complete any currently called token first
    const alreadyCalled = await QueueToken.findOne({ status: 'called' });
    if (alreadyCalled) {
      alreadyCalled.status = 'completed';
      await alreadyCalled.save();

      // Update analytics: completed count and average service time
      const analytics = await getAnalyticsDoc();
      analytics.completedCount   += 1;
      analytics.totalServiceTime += AVG_SERVICE_MINUTES;
      analytics.averageServiceTime =
        analytics.totalServiceTime / analytics.completedCount;

      // Set performance label based on average service time
      if (analytics.averageServiceTime <= 3)      analytics.queuePerformance = 'Excellent';
      else if (analytics.averageServiceTime <= 7) analytics.queuePerformance = 'Good';
      else if (analytics.averageServiceTime <= 12) analytics.queuePerformance = 'Average';
      else                                         analytics.queuePerformance = 'Poor';

      await analytics.save();
    }

    // Find next waiting token in FIFO order (oldest createdAt first)
    const nextToken = await QueueToken.findOne({ status: 'waiting' })
      .sort('createdAt')
      .populate('userId', 'name email');

    if (!nextToken) {
      return res.status(404).json({ message: 'No more tokens in the queue' });
    }

    nextToken.status = 'called';
    await nextToken.save();

    // Recalculate positions for remaining waiting tokens
    await recalculatePositions();

    res.json({
      message: `Token #${nextToken.tokenNumber} has been called`,
      token:   nextToken,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ═══════════════════════════════════════════════════
// POST /api/queue/skip  [protected: admin]
// Body: { tokenId }
// Marks a specific waiting token as 'skipped'.
// ═══════════════════════════════════════════════════
const skipToken = async (req, res) => {
  try {
    const { tokenId } = req.body;

    if (!tokenId) {
      return res.status(400).json({ message: 'tokenId is required' });
    }

    const token = await QueueToken.findById(tokenId);
    if (!token) {
      return res.status(404).json({ message: 'Token not found' });
    }

    if (token.status !== 'waiting' && token.status !== 'called') {
      return res.status(400).json({ message: 'Token cannot be skipped in its current state' });
    }

    token.status = 'skipped';
    await token.save();

    // Update analytics
    const analytics = await getAnalyticsDoc();
    analytics.skippedCount += 1;
    await analytics.save();

    // Recalculate positions for remaining waiting tokens
    await recalculatePositions();

    res.json({
      message: `Token #${token.tokenNumber} has been skipped`,
      token,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ═══════════════════════════════════════════════════
// GET /api/queue/counters  [protected: admin, superadmin]
// Lists all service counters.
// ═══════════════════════════════════════════════════
const getCounters = async (req, res) => {
  try {
    await seedCountersIfEmpty();   // ensure at least 3 counters exist
    const counters = await ServiceCounter.find().populate('assignedAgent', 'name email');
    res.json(counters);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ═══════════════════════════════════════════════════
// GET /api/queue/analytics  [protected: superadmin]
// Returns system-wide queue statistics.
// ═══════════════════════════════════════════════════
const getAnalytics = async (req, res) => {
  try {
    const analytics = await getAnalyticsDoc();

    // Live counts
    const waitingNow   = await QueueToken.countDocuments({ status: 'waiting' });
    const calledNow    = await QueueToken.countDocuments({ status: 'called' });
    const completedAll = await QueueToken.countDocuments({ status: 'completed' });
    const skippedAll   = await QueueToken.countDocuments({ status: 'skipped' });
    const totalAll     = await QueueToken.countDocuments();

    res.json({
      analytics,
      live: {
        waitingNow,
        calledNow,
        completedAll,
        skippedAll,
        totalAll,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ═══════════════════════════════════════════════════
// POST /api/queue/reset  [protected: superadmin]
// Resets all queue data (useful for new day / testing).
// ═══════════════════════════════════════════════════
const resetQueue = async (req, res) => {
  try {
    await QueueToken.deleteMany({});
    await QueueAnalytics.deleteMany({});
    await QueueAnalytics.create({});  // fresh analytics doc
    res.json({ message: 'Queue has been reset successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  joinQueue,
  getQueueStatus,
  getAllTokens,
  callNextToken,
  skipToken,
  getCounters,
  getAnalytics,
  resetQueue,
};
