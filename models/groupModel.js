const mongoose = require("mongoose");

const groupSchema = new mongoose.Schema(
  {
    groupName: { type: String, required: true },
    groupDescription: { type: String },
    groupCurrency: { type: String, default: "USD" },
    groupCurrencySymbol: { type: String, default: "$" },
    groupOwner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    groupMembers: [
      {
        // type: mongoose.Schema.Types.ObjectId,
        type: String,
        ref: "User",
        required: true,
      },
    ],
    groupCategory: { type: String, default: "Others" },
    groupType: {
      type: String,
      enum: [
        "Trip",
        "Household",
        "Project",
        "Event",
        "Party",
        "Shopping",
        "Entertainment",
        "Others",
      ], // Add "Others"
      default: "Others",
    },
    groupIcon: { type: String },
    groupStartDate: { type: Date },
    groupEndDate: { type: Date },
    groupTotal: { type: Number, default: 0 },
    totalExpenses: { type: Number, default: 0 },
    settlements: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Settlement",
      },
    ],
    balances: {
      type: Map,
      of: Number,
    },
    isSettled: { type: Boolean, default: false },
    memberRoles: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        role: { type: String, enum: ["Admin", "Member"], default: "Member" },
      },
    ],
    invitations: [
      {
        email: { type: String, required: true },
        status: {
          type: String,
          enum: ["Pending", "Accepted", "Rejected"],
          default: "Pending",
        },
        invitedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        invitedAt: { type: Date, default: Date.now },
      },
    ],
    activityLog: [
      {
        action: { type: String, required: true },
        performedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        details: { type: String },
        timestamp: { type: Date, default: Date.now },
      },
    ],
    customCategories: [String],
    isPublic: { type: Boolean, default: false },
    password: { type: String },
    notifications: [
      {
        message: { type: String, required: true },
        readBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

const Group = mongoose.model("Group", groupSchema);

module.exports = Group;
