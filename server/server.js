// ===================================================
// server.js — Entry point for Digital Queue API
// Connects to MongoDB, sets up Express middleware,
// and mounts all API routes.
// ===================================================

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

const app = express();

// ─── Middleware ───────────────────────────────────
app.use(cors());                        // Allow cross-origin requests from React dev server
app.use(express.json());                // Parse incoming JSON request bodies

// ─── Routes ──────────────────────────────────────
const authRoutes  = require('./routes/authRoutes');
const queueRoutes = require('./routes/queueRoutes');

app.use('/api/auth',  authRoutes);      // /api/auth/register, /api/auth/login
app.use('/api/queue', queueRoutes);     // /api/queue/join, /api/queue/all, etc.

// ─── Default health-check route ──────────────────
app.get('/', (req, res) => {
  res.json({ message: 'Digital Queue Management API is running 🚀' });
});

// ─── MongoDB Connection ───────────────────────────
const PORT     = process.env.PORT     || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/digitalqueue';

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected successfully');
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  });
