const mongoose = require("mongoose");

const SettlementSchema = new mongoose.Schema({
  groupId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Group",
    required: true,
  },
  settleTo: { type: String, required: true },
  settleFrom: { type: String, required: true },
  settleDate: { type: Date, default: Date.now },
  settleAmount: { type: Number, required: true },
});

module.exports = mongoose.model("Settlement", SettlementSchema);

// const mongoose = require("mongoose");

// const settlementSchema = new mongoose.Schema(
//   {
//     groupId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Group",
//       required: true,
//     },
//     settleTo: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//     },
//     settleFrom: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//     },
//     settleDate: {
//       type: Date,
//       required: true,
//     },
//     settleAmount: {
//       type: Number,
//       required: true,
//     },
//   },
//   { timestamps: true }
// );

// const Settlement = mongoose.model("Settlement", settlementSchema);

// module.exports = Settlement;
