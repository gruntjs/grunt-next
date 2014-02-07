const buildTask = require('./build_task');

module.exports = function (config) {
  var name = config.name;
  var method = buildTask.call(this, config);
  if (config.deps) {
    this.add(name, config.deps, method);
  } else {
    this.add(name, method);
  }
};
