require("dotenv").config();
const OpenAI = require("openai");
const moment = require("moment");
const Expense = require("../models/expenseModel");
const User = require("../models/userModel");
const Group = require("../models/groupModel");
const Settlement = require("../models/settlementModel");
const logger = require("../helper/logger");
const Prompter = require("../helper/prompter");
const FinancialPipeline = require("../helper/financialPipeline");

if (!process.env.OPENAI_API_KEY) {
  throw new Error("Missing OpenAI API Key in .env file");
}

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const DEFAULT_MESSAGE = `Hello! I am your financial assistant. I can help you with:
- Checking your total expenses
- Viewing last month's expenses
- Getting a category-wise breakdown
- Checking expenses within groups
- Tracking how much you owe or have settled
- Comparing spending across time periods
- Providing savings advice based on your spending

Quick questions you can try:
1. What is my total expense?
2. How much did I spend last month?
3. Give me a category-wise breakdown
4. How much do I owe?
5. Show my group expenses

How can I assist you today?`;

const ERROR_MESSAGE =
  "Sorry, I couldn't understand that. Please ask about expenses or finance-related queries.";

const GREETINGS = [
  "hi",
  "hello",
  "hey",
  "greetings",
  "howdy",
  "hola",
  "good morning",
  "good afternoon",
];

const QUERY_PATTERNS = {
  GREETINGS: GREETINGS,
  IDENTITY: [/who am i/i, /what's my name/i],
  TOTAL_EXPENSES: [
    /total expen(s|d)/i,
    /how much (have|did) i spend/i,
    /overall spending/i,
  ],
  LAST_MONTH_EXPENSES: [/last month/i, /previous month/i, /month before/i],
  CATEGORY_EXPENSES: [
    /categor(y|ies)/i,
    /breakdown/i,
    /by type/i,
    /spending on (\w+)/i,
  ],
  GROUP_COUNT: [/how many groups/i, /number of groups/i, /group count/i],
  GROUP_MEMBERS: [
    /group members/i,
    /how many people in groups/i,
    /total members/i,
  ],
  GROUP_EXPENSES: [/group expen(s|d)/i, /spending in groups/i],
  OWED_AMOUNT: [
    /how much (do|does) i owe/i,
    /my debt/i,
    /who do i need to pay/i,
  ],
  SETTLED_AMOUNT: [
    /how much (have|did) i settled/i,
    /paid back/i,
    /settlement amount/i,
  ],
  TIME_COMPARISON: [
    /compare (spending|expenses)/i,
    /(more|less) than (last|previous)/i,
  ],
  TIME_PERIOD: [
    /in (january|february|march|april|may|june|july|august|september|october|november|december)/i,
    /last week/i,
    /this month/i,
    /last \d+ months/i,
  ],
  ADVICE: [/how (can|do) i reduce/i, /sav(e|ing) advice/i, /cut back/i],
  CALCULATION: [
    /percentage/i,
    /average/i,
    /per (day|month|year)/i,
    /calculate/i,
  ],
};

const matchesPattern = (query, patterns) => {
  return patterns.some((pattern) =>
    typeof pattern === "string"
      ? query.includes(pattern.toLowerCase())
      : pattern.test(query)
  );
};

const getUserFinancialContext = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) throw new Error("User not found.");

    const userEmail = user.emailId;
    const oneMonthAgo = moment().subtract(1, "month");
    const threeMonthsAgo = moment().subtract(3, "months");

    const [
      totalExpenses,
      expensesByCategory,
      lastMonthExpenses,
      lastThreeMonthsExpenses,
      groupExpenses,
      owedAmountResult,
      settledUpAmountResult,
      totalGroups,
      totalMembers,
      categoryMonthlyTrends,
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
        { $sort: { totalSpent: -1 } },
      ]),
      Expense.aggregate([
        {
          $match: {
            expenseOwner: userEmail,
            expenseDate: {
              $gte: oneMonthAgo.startOf("month").toDate(),
              $lt: oneMonthAgo.endOf("month").toDate(),
            },
          },
        },
        { $group: { _id: null, totalSpent: { $sum: "$expenseAmount" } } },
      ]),
      Expense.aggregate([
        {
          $match: {
            expenseOwner: userEmail,
            expenseDate: { $gte: threeMonthsAgo.toDate() },
          },
        },
        { $group: { _id: null, totalSpent: { $sum: "$expenseAmount" } } },
      ]),
      Expense.aggregate([
        { $match: { expenseMembers: userEmail } },
        { $group: { _id: "$groupId", totalSpent: { $sum: "$expenseAmount" } } },
        { $sort: { totalSpent: -1 } },
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
      Expense.aggregate([
        { $match: { expenseOwner: userEmail } },
        {
          $project: {
            month: { $month: "$expenseDate" },
            year: { $year: "$expenseDate" },
            category: "$expenseCategory",
            amount: "$expenseAmount",
          },
        },
        {
          $group: {
            _id: { month: "$month", year: "$year", category: "$category" },
            total: { $sum: "$amount" },
          },
        },
        { $sort: { "_id.year": 1, "_id.month": 1 } },
      ]),
    ]);

    const groupIds = groupExpenses.map((g) => g._id);
    const groupDocs = await Group.find({ _id: { $in: groupIds } }).select(
      "groupName"
    );

    const namedGroupExpenses = groupExpenses.map((g) => {
      const group = groupDocs.find(
        (doc) => doc._id.toString() === g._id.toString()
      );
      return {
        name: group?.groupName || `Group ${g._id}`,
        totalSpent: g.totalSpent,
      };
    });

    return {
      name: `${user.firstName} ${user.lastName}`,
      email: userEmail,
      total_expenses: totalExpenses[0]?.totalSpent || 0,
      categories: expensesByCategory.map((c) => ({
        name: c._id,
        amount: c.totalSpent,
      })),
      last_month_expenses: lastMonthExpenses[0]?.totalSpent || 0,
      last_three_months_expenses: lastThreeMonthsExpenses[0]?.totalSpent || 0,
      groups: {
        count: totalGroups,
        members: totalMembers[0]?.totalMembers || 0,
        expenses: namedGroupExpenses,
      },
      owed: owedAmountResult[0]?.totalOwed || 0,
      settled: settledUpAmountResult[0]?.totalSettled || 0,
      trends: categoryMonthlyTrends,
    };
  } catch (error) {
    logger.error(`Error fetching financial data: ${error.message}`);
    return null;
  }
};

const processSimpleQuery = (query, data) => {
  const lowerQuery = query.toLowerCase();

  if (matchesPattern(lowerQuery, GREETINGS)) {
    return `Hello ${data.name}! ${DEFAULT_MESSAGE}`;
  }

  if (matchesPattern(lowerQuery, QUERY_PATTERNS.IDENTITY)) {
    return `You are ${data.name}, a valued member of PennyShare.`;
  }

  if (matchesPattern(lowerQuery, QUERY_PATTERNS.TOTAL_EXPENSES)) {
    return `Your total expenses are ₹${data.total_expenses.toFixed(2)}.`;
  }

  if (matchesPattern(lowerQuery, QUERY_PATTERNS.LAST_MONTH_EXPENSES)) {
    return `Last month's expenses: ₹${data.last_month_expenses.toFixed(2)}.`;
  }

  if (matchesPattern(lowerQuery, QUERY_PATTERNS.CATEGORY_EXPENSES)) {
    const match = lowerQuery.match(/spending on (\w+)/i);
    if (match) {
      const category = match[1];
      const found = data.categories.find(
        (c) => c.name.toLowerCase() === category.toLowerCase()
      );
      return found
        ? `You've spent ₹${found.amount.toFixed(2)} on ${found.name}.`
        : `No expenses found for ${category}.`;
    }

    const breakdown = data.categories
      .map((c) => `${c.name || "Uncategorized"}: ₹${c.amount.toFixed(2)}`)
      .join("\n");
    return `Here's your category-wise spending:\n${breakdown}`;
  }

  if (matchesPattern(lowerQuery, QUERY_PATTERNS.GROUP_COUNT)) {
    return `You are part of ${data.groups.count} groups.`;
  }

  if (matchesPattern(lowerQuery, QUERY_PATTERNS.GROUP_MEMBERS)) {
    return `Your groups have ${data.groups.members} total members.`;
  }

  if (matchesPattern(lowerQuery, QUERY_PATTERNS.GROUP_EXPENSES)) {
    if (!data.groups.expenses.length) return "No group expenses found.";
    return data.groups.expenses
      .map((g) => `${g.name}: ₹${g.totalSpent.toFixed(2)}`)
      .join("\n");
  }

  if (matchesPattern(lowerQuery, QUERY_PATTERNS.OWED_AMOUNT)) {
    return `You currently owe ₹${data.owed.toFixed(2)} to others.`;
  }

  if (matchesPattern(lowerQuery, QUERY_PATTERNS.SETTLED_AMOUNT)) {
    return `You’ve settled ₹${data.settled.toFixed(2)} so far.`;
  }

  return null;
};

const processFinancialQuery = async (query, userId) => {
  try {
    if (!query || typeof query !== "string" || !query.trim()) {
      return DEFAULT_MESSAGE;
    }

    const context = await getUserFinancialContext(userId);
    if (!context) {
      return "Sorry, we couldn't retrieve your financial data.";
    }

    // 🔍 Handle specific group name detection
    const groupMatch = query.match(/group (.+)/i);
    if (groupMatch && context.groups?.expenses) {
      const groupName = groupMatch[1].trim().toLowerCase();
      context.groupQueryName = groupName;

      context.groups.expenses = context.groups.expenses.map((g) => ({
        ...g,
        isTargetGroup: g.name?.toLowerCase() === groupName,
      }));
    }

    const simpleAnswer = processSimpleQuery(query, context);
    if (simpleAnswer) return simpleAnswer;

    const prompter = new Prompter("financial_default.mustache");
    const pipeline = new FinancialPipeline(prompter, openai);
    const result = await pipeline.analyze(query, context);

    return result || ERROR_MESSAGE;
  } catch (error) {
    logger.error(`Error processing financial query: ${error.message}`);
    return ERROR_MESSAGE;
  }
};

module.exports = { processFinancialQuery };
