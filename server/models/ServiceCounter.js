// ===================================================
// models/ServiceCounter.js — Mongoose schema for
// service counters managed by admin agents.
// ===================================================

const mongoose = require('mongoose');

const ServiceCounterSchema = new mongoose.Schema(
  {
    // Human-readable name for the counter (e.g. "Counter A")
    counterName: {
      type:     String,
      required: true,
      trim:     true,
    },

    // Reference to the admin User assigned to this counter
    assignedAgent: {
      type: mongoose.Schema.Types.ObjectId,
      ref:  'User',
      default: null,
    },

    // Whether this counter is currently open or closed
    status: {
      type:    String,
      enum:    ['open', 'closed', 'busy'],
      default: 'open',
    },

    // Token currently being served at this counter
    currentToken: {
      type:    Number,
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('ServiceCounter', ServiceCounterSchema);
