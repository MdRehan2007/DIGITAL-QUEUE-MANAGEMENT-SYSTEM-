// ===================================================
// controllers/authController.js
// Handles user registration and login.
// Returns a JWT token on success.
// ===================================================

const jwt  = require('jsonwebtoken');
const User = require('../models/User');

// ─── Helper: generate JWT ─────────────────────────
// Payload: user id; expires in 30 days
const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });

// ─── POST /api/auth/register ──────────────────────
// Body: { name, email, password, role? }
// Creates a new user. Role defaults to 'customer'.
const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = r6eq.body;

    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide name, email, and password' });
    }

    // Check for duplicate email
    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    // Create user — password is hashed in the pre-save hook
    const user = await User.create({ name, email, password, role: role || 'customer' });

    res.status(201).json({
      _id:   user._id,
      name:  user.name,
      email: user.email,
      role:  user.role,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── POST /api/auth/login ─────────────────────────
// Body: { email, password }
// Verifies credentials; returns user info + token.
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Compare password using bcrypt
    const match = await user.matchPassword(password);
    if (!match) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    res.json({
      _id:   user._id,
      name:  user.name,
      email: user.email,
      role:  user.role,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── GET /api/auth/me ─────────────────────────────
// Returns the authenticated user's profile.
const getMe = async (req, res) => {
  const { _id, name, email, role, createdAt } = req.user;
  res.json({ _id, name, email, role, createdAt });
};

module.exports = { registerUser, loginUser, getMe };
