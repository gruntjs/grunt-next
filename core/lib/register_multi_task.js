const parseTask = require('./parse_task');
const register = require('./register');

module.exports = function () {
  var config = parseTask.apply(this, arguments);
  config.multiTask = true;
  return register.call(this, config);
};
