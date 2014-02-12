const Orchestrator = require('orchestrator');
const _ = require('lodash');

const buildTaskContext = require('./build_task_context');
const buildTask = require('./build_task');
const logEvents = require('./log_events');

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
  logEvents(runner);
  toRun.forEach(function (name) {
    var parts = name.split(':');
    var task = tasks[parts[0]];
    if (!task) {
      console.log(task+' not found.');
      return;
    }
    if (task.type === 'single') {
      runner.add(name, buildTask(buildTaskContext(config, task)));
    }
    if(task.type === 'multi') {
      var targets = findTargets(config.get(parts[0]));
      var dep;
      targets.forEach(function (target) {
        if (dep) {
          runner.add(name+target, [dep], buildTask(buildTaskContext(config, task, target)));
        } else {
          runner.add(name+target, buildTask(buildTaskContext(config, task, target)));
        }
        dep = name+target;
      });
      runner.add(name, [dep]);
    }
  });
  return runner;
};
