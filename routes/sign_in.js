const express = require("express"),
      { User } = require("../model/user"),
      Joi = require("joi"),
      _ = require("lodash"),
      router = express.Router();

router.post("/", async(req, res) => {
  const {error} = joiValidator(req.body);
  if(error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({email: req.body.email});
  if(!user) return res.status(401).send("Invalid Email or Username");

  const pass_compare = await user.password_validator(req.body.password);
  if(!pass_compare) return res.status(401).send("Invalid Email or Password");

  let current_time = new Date();
  current_time = current_time.getMonth();
  if(current_time > user.cash_flow.date.getMonth()) {
    const updates = await user.new_cash_flow();
    if(!updates) return res.status(500).send("Something failed");
  };

  const token = await user.generateToken();
  res.header("x-auth", token).send(_.pick(user, ['username', 'cash_flow']));
});

function joiValidator(data) {
  const schema = {
    email: Joi.string().min(3).max(255).trim().email().required(),
    password: Joi.string().min(3).max(255).trim().required()
  }
  return Joi.validate(data, schema);
};

module.exports = router;      