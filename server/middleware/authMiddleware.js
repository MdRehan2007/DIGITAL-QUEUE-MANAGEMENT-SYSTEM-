// ===================================================
// middleware/authMiddleware.js
// Provides two middleware functions:
//   protect    → verifies JWT, attaches req.user
//   authorise  → restricts route to specific roles
// ===================================================

const jwt  = require('jsonwebtoken');
const User = require('../models/User');

// ─── protect ─────────────────────────────────────
// Reads the Bearer token from the Authorization header,
// verifies it with JWT_SECRET, and populates req.user.
// If the token is missing or invalid, returns 401.
const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer ')
  ) {
    try {
      // Extract token from "Bearer <token>"
      token = req.headers.authorization.split(' ')[1];

      // Decode payload — throws if expired or invalid
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Fetch fresh user from DB (minus password field)
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return res.status(401).json({ message: 'User not found' });
      }

      return next();
    } catch (error) {
      return res.status(401).json({ message: 'Not authorised, token failed' });
    }
  }

  return res.status(401).json({ message: 'Not authorised, no token' });
};

// ─── authorise ────────────────────────────────────
// Factory function — returns middleware that checks
// whether req.user.role is in the allowed roles array.
// Usage:  authorise('admin', 'superadmin')
const authorise = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Role '${req.user.role}' is not authorised to access this route`,
      });
    }
    next();
  };
};

module.exports = { protect, authorise };
