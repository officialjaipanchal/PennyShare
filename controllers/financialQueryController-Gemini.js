require("dotenv").config();
const OpenAI = require("openai");
const moment = require("moment");
const Expense = require("../models/expenseModel");
const User = require("../models/userModel");
const Group = require("../models/groupModel");
const Settlement = require("../models/settlementModel");
const logger = require("../helper/logger");

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const DEFAULT_MESSAGE = `Hello! I am your financial assistant. I can help with:
- Checking your total expenses
- Viewing last month's expenses
- Getting a category-wise breakdown
- Checking group expenses
- Tracking how much you owe or have settled
How can I assist you today?`;

const ERROR_MESSAGE =
  "Sorry, I couldn't understand that. Please ask about expenses or finance-related queries.";

const getUserFinancialContext = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) throw new Error("User not found.");

    const userEmail = user.emailId;

    const [
      totalExpenses,
      expensesByCategory,
      lastMonthExpenses,
      groupExpenses,
      owedAmountResult,
      settledUpAmountResult,
      totalGroups,
      totalMembers,
    ] = await Promise.all([
      Expense.aggregate([
        { $match: { expenseOwner: userEmail } },
        { $group: { _id: null, totalSpent: { $sum: "$expenseAmount" } } },
      ]),
      Expense.aggregate([
        { $match: { expenseOwner: userEmail } },
        {
          $group: {
            _id: "$expenseCategory",
            totalSpent: { $sum: "$expenseAmount" },
          },
        },
      ]),
      Expense.aggregate([
        {
          $match: {
            expenseOwner: userEmail,
            expenseDate: {
              $gte: moment().subtract(1, "month").startOf("month").toDate(),
              $lt: moment().subtract(1, "month").endOf("month").toDate(),
            },
          },
        },
        { $group: { _id: null, totalSpent: { $sum: "$expenseAmount" } } },
      ]),
      Expense.aggregate([
        { $match: { expenseMembers: userEmail } },
        { $group: { _id: "$groupId", totalSpent: { $sum: "$expenseAmount" } } },
      ]),
      Expense.aggregate([
        {
          $match: {
            expenseMembers: userEmail,
            expenseOwner: { $ne: userEmail },
          },
        },
        { $group: { _id: null, totalOwed: { $sum: "$expensePerMember" } } },
      ]),
      Settlement.aggregate([
        { $match: { settleFrom: userEmail } },
        { $group: { _id: null, totalSettled: { $sum: "$settleAmount" } } },
      ]),
      Group.countDocuments({ groupMembers: userEmail }),
      Group.aggregate([
        { $match: { groupMembers: userEmail } },
        { $unwind: "$groupMembers" },
        { $group: { _id: null, totalMembers: { $sum: 1 } } },
      ]),
    ]);

    return {
      userName: `${user.firstName} ${user.lastName}`,
      totalExpenses: totalExpenses.length > 0 ? totalExpenses[0].totalSpent : 0,
      categoryExpenses:
        expensesByCategory
          .map((cat) => `${cat._id}: ₹${cat.totalSpent}`)
          .join(", ") || "No categorized expenses.",
      lastMonthExpenses:
        lastMonthExpenses.length > 0 ? lastMonthExpenses[0].totalSpent : 0,
      groupExpenses:
        groupExpenses
          .map((g) => `Group ${g._id}: ₹${g.totalSpent}`)
          .join(", ") || "No group expenses recorded.",
      totalGroups,
      totalMembers: totalMembers.length > 0 ? totalMembers[0].totalMembers : 0,
      owedAmount:
        owedAmountResult.length > 0 ? owedAmountResult[0].totalOwed : 0,
      settledUpAmount:
        settledUpAmountResult.length > 0
          ? settledUpAmountResult[0].totalSettled
          : 0,
    };
  } catch (error) {
    logger.error(`Error fetching financial data: ${error.message}`);
    return null;
  }
};

const processFinancialQuery = async (query, userId) => {
  try {
    if (!query || typeof query !== "string" || query.trim().length === 0) {
      return DEFAULT_MESSAGE;
    }

    const financialData = await getUserFinancialContext(userId);
    if (!financialData) {
      return "Sorry, I couldn't retrieve your financial data. Please try again later.";
    }

    const prompt = `User Query: ${query}\n\nUser Financial Data:\n- Name: ${financialData.userName}\n- Total Expenses: ₹${financialData.totalExpenses}\n- Last Month's Expenses: ₹${financialData.lastMonthExpenses}\n- Category-wise Expenses: ${financialData.categoryExpenses}\n- Group Count: ${financialData.totalGroups}\n- Total Group Members: ${financialData.totalMembers}\n- Amount Owed: ₹${financialData.owedAmount}\n- Settled Amount: ₹${financialData.settledUpAmount}\n\nBased on the provided financial data, respond naturally as a financial assistant.`;

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are a financial assistant helping users manage expenses.",
        },
        { role: "user", content: prompt },
      ],
      max_tokens: 150,
    });

    return response.choices[0]?.message?.content || ERROR_MESSAGE;
  } catch (error) {
    logger.error(`Error processing query: ${error.message}`);
    return ERROR_MESSAGE;
  }
};

module.exports = { processFinancialQuery };
