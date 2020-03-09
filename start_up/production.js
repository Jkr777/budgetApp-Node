const helment = require('helmet'),
      compression = require('compression');

module.exports = (app) => {
  app.use(helment()); 
  app.use(compression()); 
};      