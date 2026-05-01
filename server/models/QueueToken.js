// ===================================================
// models/QueueToken.js — Mongoose schema for tokens
// Each time a customer joins the queue a token is
// created with an auto-incremented token number.
// Status lifecycle: waiting → called → completed
// ===================================================

const mongoose = require('mongoose');

const QueueTokenSchema = new mongoose.Schema(
  {
    // Reference to the User (customer) who joined
    userId: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      'User',
      required: true,
    },

    // Auto-incremented token number (e.g. 1, 2, 3 …)
    // The controller handles incrementing this value.
    tokenNumber: {
      type:     Number,
      required: true,
    },

    // Current position in the waiting queue
    // Decreases as earlier tokens get called/completed.
    queuePosition: {
      type:    Number,
      default: 0,
    },

    // Lifecycle status of this token
    status: {
      type:    String,
      enum:    ['waiting', 'called', 'completed', 'skipped'],
      default: 'waiting',
    },

    // Estimated wait time in minutes (calculated by controller)
    estimatedWaitTime: {
      type:    Number,
      default: 0,
    },
  },
  { timestamps: true }   // createdAt used for FIFO ordering
);

module.exports = mongoose.model('QueueToken', QueueTokenSchema);
