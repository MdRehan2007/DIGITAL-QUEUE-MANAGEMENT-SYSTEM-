// ===================================================
// models/QueueAnalytics.js — Mongoose schema for
// system-wide queue performance metrics.
// A single document is kept and updated over time.
// ===================================================

const mongoose = require('mongoose');

const QueueAnalyticsSchema = new mongoose.Schema(
  {
    // Total number of customers who have ever joined the queue
    totalCustomers: {
      type:    Number,
      default: 0,
    },

    // Cumulative service time in minutes (used to compute avg)
    totalServiceTime: {
      type:    Number,
      default: 0,
    },

    // Average time (minutes) to serve one customer
    // Computed as totalServiceTime / completedCount
    averageServiceTime: {
      type:    Number,
      default: 0,
    },

    // Number of tokens that have reached "completed" status
    completedCount: {
      type:    Number,
      default: 0,
    },

    // Number of tokens skipped by admin
    skippedCount: {
      type:    Number,
      default: 0,
    },

    // Qualitative queue performance label
    // Calculated from averageServiceTime thresholds
    queuePerformance: {
      type:    String,
      enum:    ['Excellent', 'Good', 'Average', 'Poor'],
      default: 'Good',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('QueueAnalytics', QueueAnalyticsSchema);
