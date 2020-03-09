const mongoose = require("mongoose"),
      Float = require("mongoose-float").loadType(mongoose),
      Joi = require("joi");

const earningSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    lowercase: true,
    minlength: 2,
    maxlength: 15,
  },
  description: {
    type: String,
    trim: true,
    lowercase: true,
    minlength: 2,
    maxlength: 25,
  },
  amount: {
    type: Float,
    required: true
  },
  date: {
    type: Date,
    default: Date.now()
  }
});

const Earning = mongoose.model("Earning", earningSchema);

function Earning_joiValidation(data) {
  const state = {
    title: Joi.string().min(2).max(15).trim(),
    description: Joi.string().min(2).max(25).trim(),
    amount: Joi.number().positive().precision(2).required()
  }
  return Joi.validate(data, state);
};

module.exports = { earningSchema, Earning, Earning_joiValidation };