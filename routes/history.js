const express = require("express"),
      auth = require("../middleware/auth"),
      { Old_Flow } = require("../model/old_cash_flow"),
      router = express.Router();

router.get("/", auth, async(req, res) => {
  const history = await Old_Flow.find({user: req.user._id});
  if(!history) return res.status(401).send("Invalid User");

  res.status(200).send(history);
}); 

module.exports = router;