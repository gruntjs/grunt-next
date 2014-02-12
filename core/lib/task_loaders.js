// These loaders are responsible for generating entries in an orchestrator
// instance for the various classification of grunt tasks.

const findTargets = require('./find_targets');
const taskGenerate = require('./task_generate');
const taskContext = require('./task_context');

exports.alias = function (runner, opts) {
  var taskName = opts.taskName;
  var deps = opts.task.fn;
  runner.add(taskName, deps, function () {
    console.log(taskName+' alias iteration complete');
  });
};

exports.multi = function (runner, opts) {
  var config = opts.config;
  var taskName = opts.taskName;
  var task = opts.task;
  var targets = findTargets(config.get(taskName));
  var all = targets.map(function (target) {
    var name = taskName+':'+target;
    opts.target = target;
    runner.add(name, taskGenerate(task, taskContext(opts)));
    return name;
  });
  runner.add(taskName, all, function () {
    console.log(taskName+' multi-task iteration complete');
  });
};

exports.single = function (runner, opts) {
  var task = opts.task;
  runner.add(opts.taskName, taskGenerate(task, taskContext(opts)));
};
