const Orchestrator = require('orchestrator');
const buildTaskContext = require('./build_task_context');
const buildTask = require('./build_task');

var findTargets = function (task) {
  var targets = [];
  Object.keys(task).forEach(function (key) {
    if(key != 'options') {
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
      runner.add(name, buildTask(buildTaskContext(config, task)));
    }
    if(task.type === 'multi') {
      var targets = findTargets(config.get(parts[0]));
      var dep;
      targets.forEach(function (target) {
        var taskName = name+':'+target;
        if (dep) {
          runner.add(taskName, [dep], buildTask(buildTaskContext(config, task, target)));
        } else {
          runner.add(taskName, buildTask(buildTaskContext(config, task, target)));
        }
        dep = taskName;
      });
      runner.add(name, [dep]);
    }
  });
  return runner;
};
