const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema(
  {
    groupId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Group",
      required: true,
    },
    expenseName: {
      type: String,
      required: true,
    },
    expenseDescription: {
      type: String,
    },
    expenseAmount: {
      type: Number,
      required: true,
    },
    expenseCategory: {
      type: String,
      enum: [
        "Food",
        "Transportation",
        "Entertainment",
        "Utilities",
        "Groceries",
        "Others",
      ],
      default: "Others",
    },
    expenseTags: {
      type: [String],
      default: [],
    },
    expenseNotes: {
      type: String,
      default: "",
    },
    expenseCurrency: {
      type: String,
      default: "USD",
    },
    currencyConversion: {
      type: Number,
      default: 1,
    },
    expenseDate: {
      type: Date,
      default: Date.now,
    },
    expenseOwner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    expenseMembers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
    expensePerMember: [
      {
        memberId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        amountOwed: {
          type: Number,
          required: true,
        },
        paid: {
          type: Boolean,
          default: false,
        },
      },
    ],
    splitType: {
      type: String,
      enum: ["Equal", "Percentage", "Custom"],
      default: "Equal",
    },
    expenseType: {
      type: String,
      default: "Cash",
    },
  },
  { timestamps: true }
);

const Expense = mongoose.model("Expense", expenseSchema);

module.exports = Expense;
//
