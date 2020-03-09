const { User } = require("../model/user");

module.exports = async function flow_expiration(req, res, next) {
  let current_time = new Date();
  current_time = current_time.getMonth();

  if(current_time > req.user.date) {
    const user = await User.findOne({_id: req.user._id});
    if(!user) return res.status(401).send("Invalid user");

    const updates = await user.new_cash_flow();
    if(!updates) return res.status(500).send("Something failed");
  };

  next();
};