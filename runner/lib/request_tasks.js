const _ = require('lodash');
const buildTasks = require('./build_tasks');
const indexCommands = require('./index_commands');

const requestTasks = function (config, tasks, request) {
  var results = [];
  console.log('Requesting tasks:', request);
  var commands = indexCommands(request);
  console.log('Indexing request:', commands);
  Object.keys(commands).forEach(function (taskName) {
    var run = commands[taskName];
    var task = tasks[taskName];
    var taskConfig = config.get(taskName);
    if(!task) {
      console.log('Task "'+taskName+'" is not found.');
      return;
    }
    if (task.type === 'alias') {
      results.push(requestTasks(config, tasks, task.fn));
    } else {
      results.push(buildTasks(task, taskConfig, run));
    }
  });
  return _.flatten(results);
};

module.exports = requestTasks;
