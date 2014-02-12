const Orchestrator = require('orchestrator');
const _ = require('lodash');
const buildTask = require('./build_task');

var findTargets = function (task) {
  var targets = [];
  Object.keys(task).forEach(function (key) {
    var target = task[key];
    if(_.isPlainObject(target) && key != 'options') {
      targets.push(key);
    }
  });
  return targets;
};


module.exports = function (config, tasks, toRun) {
  var runner = new Orchestrator();
  toRun.forEach(function (name) {
    var parts = name.split(':');
    var task = tasks[parts[0]];
    if (!task) {
      console.log(task+' not found.');
      return;
    }
    if (task.type === 'single') {
      runner.add(name, buildTask(config, task));
    }
  });
  return runner;
};
