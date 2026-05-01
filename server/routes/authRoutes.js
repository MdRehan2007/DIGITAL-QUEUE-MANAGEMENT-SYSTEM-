// ===================================================
// routes/authRoutes.js
// Maps HTTP verbs + paths to authController functions.
// ===================================================

const express = require('express');
const router  = express.Router();

const { registerUser, loginUser, getMe } = require('../controllers/authController');
const { protect }                         = require('../middleware/authMiddleware');

// Public routes
router.post('/register', registerUser);  // POST /api/auth/register
router.post('/login',    loginUser);      // POST /api/auth/login

// Protected route — requires valid JWT
router.get('/me', protect, getMe);        // GET  /api/auth/me

module.exports = router;
