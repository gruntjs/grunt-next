const _ = require('lodash');
const buildContext = require('./lib/build_context');
const buildMethod = require('./lib/build_method');

function Task (opts) {
  _.extend(this, opts);
};

Task.prototype.build = function (config, command) {
  var context = buildContext(config, command.split(':'), this.type);
  return buildMethod(this.fn, context);
}

module.exports = Task;
