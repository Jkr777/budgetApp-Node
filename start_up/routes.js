const express = require("express"),
      register = require("../routes/register"),
      sign_in = require("../routes/sign_in"),
      user = require("../routes/user"),
      cash_flow = require("../routes/cash_flow"),
      history = require("../routes/history"),
      reset = require("../routes/reset"),
      cors = require('cors'),
      corsOptions = {
        exposedHeaders: 'X-Auth',
      },
      errorHandler = require("../middleware/error");

module.exports = (app) => {
  app.use(cors(corsOptions));
  app.use(express.json());
  app.use("/register", register);
  app.use("/login", sign_in);
  app.use("/cash_flow", cash_flow);
  app.use("/profile", user); 
  app.use("/reset", reset); 
  app.use("/history", history);
  app.use(function(req, res) {
    res.status(404).send("Page Not Found");
  });
  app.use(errorHandler);
}      