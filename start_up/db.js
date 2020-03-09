const mongoose = require('mongoose'),
      logger = require('../start_up/loggin')(__filename);
      
module.exports = () => {
  mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useCreateIndex: true })
    .then(() => logger.info('mongoDb'))
    .catch(err => logger.error(err));
};