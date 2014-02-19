/*
  Parse an array of grunt commands doing the following:

  1. Remove commands for tasks that do not exist.
  2. Recursively trace aliases to their actual task.
  3. Expand multi task commands without targets to run all targets.
*/

const _ = require('lodash');
const getCommandTask = require('./get_command_task');
const getCommandTarget = require('./get_command_target');
const getTaskTargets = require('./get_task_targets');

const parseCommands = function (config, tasks, commands) {
  var results = [];
  commands.forEach(function (run) {
    var taskName = getCommandTask(run);
    var task = tasks[taskName];
    if (!task) {
      console.log('Task "'+taskName+'" is not found.');
      return;
    }
    var taskConfig = config.get(taskName);
    var target = getCommandTarget(run);

    if (task.isMulti()) {
      if(target && !taskConfig[target]) {
        console.log('Task "'+taskName+':'+target+'" not found.');
        return;
      }
      if(!target) {
        var targets = getTaskTargets(taskConfig, taskName);
        results.push(parseCommands(config, tasks, targets));
        return;
      }
    }
    if (task.isAlias()) {
      results.push(parseCommands(config, tasks, task.fn));
      return;
    }
    results.push(run);
  });
  return _.flatten(results);
};

module.exports = parseCommands;
