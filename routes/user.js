const express = require("express"),
      { User } = require("../model/user"),
      auth = require("../middleware/auth"),
      flow_expiration = require("../middleware/flow_expiration"),
      _ = require("lodash"),
      Joi = require("joi"),
      router = express.Router();

router.get("/", [auth, flow_expiration], async(req, res) => {
  let user = await User.findOne({_id: req.user._id});
  if(!user) return res.status(401).send("Invalid user");

  res.status(200).send(_.pick(user, ['username', 'cash_flow']));
}); 

router.patch("/", auth, async(req, res) => { 
  const {error} = joiValidator(req.body);
  if(error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ 
    $or: [
      { email: req.body.email },
      { username: req.body.username }
  ]});
  if(user) return res.status(401).send("Invalid email or username");
  
  const updated_user = _.pick(req.body, ["username", "email", "password"]);

  user = await User.findOne({_id: req.user._id});
  if(!user) return res.status(401).send("Invalid user");

  user.set(updated_user);
  await user.save();

  res.status(200).send(_.pick(user, ["username", "email"]));
});

router.delete("/", auth, async(req, res) => {
  const user = await User.findOne({_id: req.user._id});
  if(!user) return res.status(401).send("Invalid user");

  user.remove();
  res.status(200).send("done");
});

function joiValidator(data) {
  const schema = {
    username: Joi.string().min(3).max(255).trim(),
    email: Joi.string().min(3).max(255).trim().email(),
    password: Joi.string().min(3).max(255).trim(),
  }
  return Joi.validate(data, schema); 
};

module.exports = router;      