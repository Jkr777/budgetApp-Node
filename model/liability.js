const mongoose = require("mongoose"),
      Float = require("mongoose-float").loadType(mongoose),
      Joi = require("joi");

const liabilitySchema = new mongoose.Schema({
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
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User" 
  },
  amount: {
    type: Float,
    required: true
  }
});

const Liability = mongoose.model("Liability", liabilitySchema);

function Liability_joiValidation(data) {
  const schema = {
    title: Joi.string().min(2).max(15).trim(),
    description: Joi.string().min(2).max(25).trim(),
    amount: Joi.number().positive().precision(2).required()
  }
  return Joi.validate(data, schema);
};

module.exports = { Liability, Liability_joiValidation };