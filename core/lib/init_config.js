const GruntConfig = require('../../config');

module.exports = function (config) {
  this.config = new GruntConfig(config);
  return this.config;
};
