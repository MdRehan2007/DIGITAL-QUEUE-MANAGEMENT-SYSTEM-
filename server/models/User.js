// ===================================================
// models/User.js — Mongoose schema for Users
// Stores customer, admin, and superadmin accounts.
// Passwords are hashed using bcryptjs before saving.
// ===================================================

const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');

const UserSchema = new mongoose.Schema(
  {
    // Full name of the user
    name: {
      type:     String,
      required: [true, 'Name is required'],
      trim:     true,
    },

    // Unique email address used for login
    email: {
      type:     String,
      required: [true, 'Email is required'],
      unique:   true,
      lowercase: true,
      trim:     true,
    },

    // Hashed password (plain-text never stored)
    password: {
      type:     String,
      required: [true, 'Password is required'],
      minlength: 6,
    },

    // Role controls what the user can do
    // customer  → join queue, view status
    // admin     → manage queue at a counter
    // superadmin→ view analytics & all activity
    role: {
      type:    String,
      enum:    ['customer', 'admin', 'superadmin'],
      default: 'customer',
    },
  },
  { timestamps: true }   // adds createdAt and updatedAt automatically
);

// ─── Pre-save hook: hash password before storing ──
UserSchema.pre('save', async function (next) {
  // Only hash if the password field has been modified
  if (!this.isModified('password')) return next();
  const salt    = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// ─── Instance method: compare password ────────────
// Used in authController during login
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
