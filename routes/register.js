const express = require("express"),
      { User, joiValidator } = require("../model/user"),
      _ = require("lodash"),
      router = express.Router();

router.post('/', async(req, res) => {
  const {error} = joiValidator(req.body);
  if(error) return res.status(400).send(error.details[0].message);
  
  let user = await User.findOne({
    $or: [
      { email: req.body.email },
      { username: req.body.username }
    ]
  });
  if(user) return res.status(401).send("Invalid Email or Username");

  user = new User({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
    cash_flow: {}
  });
  await user.save();
  
  const token = await user.generateToken();
  res.status(201).header("x-auth", token).send(_.pick(user, ["username", "cash_flow"]));
});      

module.exports = router;      