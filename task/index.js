const _ = require('lodash');
const buildContext = require('./lib/build_context');
const buildMethod = require('./lib/build_method');

function Task (opts) {
  _.extend(this, opts);
}

Task.prototype.isMulti = function () {
  return this.type === 'multi';
};

Task.prototype.isSingle = function () {
  return this.type === 'single';
};

Task.prototype.isAlias = function () {
  return this.type === 'alias';
};

Task.prototype.build = function (config, command) {
  var context = buildContext(config, command.split(':'), this.isMulti());
  return buildMethod(this.fn, context);
};

module.exports = Task;
