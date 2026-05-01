// ===================================================
// routes/queueRoutes.js
// Maps HTTP verbs + paths to queueController functions.
// All routes require a valid JWT (protect middleware).
// Role-specific routes also use authorise middleware.
// ===================================================

const express = require('express');
const router  = express.Router();

const {
  joinQueue,
  getQueueStatus,
  getAllTokens,
  callNextToken,
  skipToken,
  getCounters,
  getAnalytics,
  resetQueue,
} = require('../controllers/queueController');

const { protect, authorise } = require('../middleware/authMiddleware');

// ─── Customer routes ──────────────────────────────
// POST /api/queue/join    → join the queue
router.post('/join',   protect, authorise('customer'), joinQueue);

// GET  /api/queue/status  → check own token status
router.get('/status',  protect, authorise('customer'), getQueueStatus);

// ─── Admin routes ─────────────────────────────────
// GET  /api/queue/all     → view all tokens
router.get('/all',     protect, authorise('admin', 'superadmin'), getAllTokens);

// POST /api/queue/next    → call next token (FIFO)
router.post('/next',   protect, authorise('admin', 'superadmin'), callNextToken);

// POST /api/queue/skip    → skip a specific token
router.post('/skip',   protect, authorise('admin', 'superadmin'), skipToken);

// GET  /api/queue/counters → list service counters
router.get('/counters', protect, authorise('admin', 'superadmin'), getCounters);

// ─── Super-admin routes ───────────────────────────
// GET  /api/queue/analytics → system-wide stats
router.get('/analytics', protect, authorise('superadmin'), getAnalytics);

// POST /api/queue/reset     → reset entire queue
router.post('/reset',    protect, authorise('superadmin'), resetQueue);

module.exports = router;
