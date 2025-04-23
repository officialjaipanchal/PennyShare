const mongoose = require("mongoose");

// Define the schema for users
const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String },
    emailId: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    username: { type: String, unique: true },
    phoneNumber: { type: String },
    dateOfBirth: { type: Date },
    gender: { type: String, enum: ["Male", "Female", "Other"] },
    profilePicture: { type: String },
    bio: { type: String },
    address: {
      street: String,
      city: String,
      state: String,
      country: String,
      zipCode: String,
    },
    isActive: { type: Boolean, default: true },
    isVerified: { type: Boolean, default: false },
    lastLogin: { type: Date },
    role: {
      type: String,
      enum: ["user", "admin", "moderator"],
      default: "user",
    },
    permissions: [String],
    socialMedia: {
      facebook: String,
      twitter: String,
      instagram: String,
      linkedIn: String,
    },
    preferences: {
      theme: { type: String, default: "light" },
      language: { type: String, default: "en" },
      notifications: {
        email: { type: Boolean, default: true },
        sms: { type: Boolean, default: false },
        push: { type: Boolean, default: true },
      },
    },
    twoFactorAuth: { type: Boolean, default: false },
    passwordResetToken: String,
    passwordResetExpires: Date,
    loginAttempts: { type: Number, default: 0 },
    lockUntil: Date,
    referralCode: { type: String, unique: true },
    referredBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    referrals: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    favoriteCategories: [String],
    lastSeen: { type: Date },
  },
  { timestamps: true } // Adds createdAt and updatedAt fields automatically
);

// Create the model based on the schema
const User = mongoose.model("User", userSchema);

module.exports = User;
