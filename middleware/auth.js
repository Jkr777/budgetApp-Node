const jwt = require("jsonwebtoken");

module.exports = function auth(req, res, next) {
  const token = req.header("x-auth");
  if(!token) return res.status(401).send("Acess denied. No token provided.");

  try {
    const token_config = jwt.verify(token, process.env.BUDGET_APP_KEY);
    req.user = token_config;
    next();
  } catch (error) {
    res.status(400).send("Invalid Token");
  }
};
