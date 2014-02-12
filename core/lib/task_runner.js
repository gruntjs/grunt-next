const Orchestrator = require('orchestrator');
const findArguments = require('./find_arguments');
const taskLoaders = require('./task_loaders');

module.exports = function (config, tasks, commands) {
  var runner = new Orchestrator();

  var args = findArguments(tasks, commands);

  Object.keys(tasks).forEach(function (taskKey) {
    var parts = taskKey.split(':');
    var taskName = parts[0];
    var task = tasks[taskName];
    if (!task) {
      return;
    }
    var load = taskLoaders[task.type];
    if (!load) {
      throw new Error('Unable to orchestrate task type:', task.type);
    }
    var opts = {
      config: config,
      args: args[taskKey]||[],
      taskName: taskName,
      task: task,
      data: config.get(parts.slice(0,2))
    };
    load(runner, opts);
  });

  return runner;
};
