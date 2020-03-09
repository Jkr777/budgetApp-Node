const mongoose = require("mongoose"),
      Joi = require("joi"),
      bcrypt = require("bcrypt"),
      { Old_Flow } = require("./old_cash_flow"),
      { Asset } = require("./asset"),
      { Liability } = require("./liability"),
      { cashSchema } = require("./cash_flow"),
      jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    minlength: 3,
    maxlength: 255,
    trim: true,
    lowercase: true,
    unique: true,
    required: true
  },
  email: {
    type: String,
    minlength: 3,
    maxlength: 255,
    trim: true,
    lowercase: true,
    unique: true,
    required: true
  },
  password: {
    type: String,
    minlength: 3,
    maxlength: 255,
    trim: true,
    required: true
  },
  reset_Token: String,
  reset_Token_Expiration_Time: Date,
  cash_flow: cashSchema
});

userSchema.pre("save", async function(next) {
  if(!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  return next();
});

userSchema.pre("remove", async function() {
    await Old_Flow.deleteMany({user: this._id});
    await Asset.deleteMany({user_id: this._id});
    await Liability.deleteMany({user_id: this._id});
});

userSchema.methods.generateToken = async function() {
  const token = jwt.sign({_id: this._id, date: this.cash_flow.date.getMonth()}, process.env.BUDGET_APP_KEY, {expiresIn: "15h"});
  return token;
};

userSchema.methods.password_validator = async function(pass) {
  const compare = await bcrypt.compare(pass, this.password);
  return compare;
};

userSchema.methods.new_cash_flow = async function() {
  const old_cash_flow = new Old_Flow({
    total: this.cash_flow.total,
    date: this.cash_flow.date,
    user: this._id,
  });

  await this.cash_flow.set({
    total: this.cash_flow.future_flow,
    earnings_total: 0,
    spendings_total: 0,
    earnings: [],
    spendings: [],
    date: Date.now()
  });

  await this.save();
  await old_cash_flow.save();
  return old_cash_flow;
};

const User = mongoose.model("User", userSchema);

function joiValidator(data) {
  const schema = {
    username: Joi.string().min(3).max(255).trim().required(),
    email: Joi.string().min(3).max(255).trim().email().required(),
    password: Joi.string().min(3).max(255).trim().required()
  }
  return Joi.validate(data, schema);
};

module.exports = { User, joiValidator };