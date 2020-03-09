const express = require("express"),
      { User } = require("../model/user"),
      _ = require("lodash"),
      Joi = require("joi"),
      crypto = require('crypto'),
      sgMail = require('@sendgrid/mail'),
      router = express.Router();

router.post("/", async(req, res) => {
  let user = await User.findOne({email: req.body.email});
  if(!user) return res.status(401).send("Invalid email");

  let resetToken = await crypto.randomBytes(32);
  resetToken = resetToken.toString('hex');
  user.reset_Token = resetToken;
  user.reset_Token_Expiration_Time = Date.now() + 3600000;
  await user.save();

  sgMail.setApiKey(process.env.SENDGRID_API_KEY);

  const msg = {
    to: user.email,
    from: 'test@example.com',
    subject: 'Password reset',
    html: `
    <p>You requested a password reset</p>
    <p>Click here <a href="https://reset/${resetToken}">link</a> to set a new password.</p>`,
    };

  sgMail.send(msg);
  res.status(200).send("Check your email");
}); 

router.patch("/:token_reset", async(req, res) => {
  const {error} = joiValidator(req.body);
  if(error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({
    reset_Token: req.params.token_reset,
    reset_Token_Expiration_Time: { $gt: Date.now() }
  });
  if(!user) return res.status(401).send("Token expired, try again");
  
  user.set({
    password: req.body.password,
    reset_Token: null,
    reset_Token_Expiration_Time: null
  });
  await user.save();

  res.status(200).send("Your password has been changed");
});

function joiValidator(data) {
  const schema = {
    email: Joi.string().min(3).max(255).trim().email(),
    password: Joi.string().min(3).max(255).trim()
  }
  return Joi.validate(data, schema); 
};

module.exports = router;      