const mongoose =  require("mongoose"),
      { earningSchema } = require("./earning"),
      { spendingSchema } = require("./spending");

const cashSchema = new mongoose.Schema({
  total: {
    type: Number,
    default: 0
  },
  future_flow: {
    type: Number
  },
  assets_total: {
    type: Number,
    default: 0
  },
  liabilities_total: {
    type: Number,
    default: 0
  },
  earnings_total: {
    type: Number,
    default: 0
  },
  spendings_total: {
    type: Number,
    default: 0
  },
  assets: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Asset'
    }
  ],  
  liabilities: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Liability'
    }
  ],
  earnings: [earningSchema],
  spendings: [spendingSchema],
  date: {
    type: Date,
    default: Date.now(),
  }
});

exports.cashSchema = cashSchema;