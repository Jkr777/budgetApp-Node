const logger = require('../start_up/loggin')(__filename);

module.exports = function errorHandler (err, req, res, next) {
  logger.error(err.message + " - " + err);

  res.status(500).send("Something failed");
};