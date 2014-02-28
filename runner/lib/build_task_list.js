const buildTask = require('./build_task');

module.exports = function (config, tasks, commands) {
  var taskList = [];
  Object.keys(commands).forEach(function (taskName) {
    var task = tasks[taskName];
    var toRun = commands[taskName];
    toRun.forEach(function (command) {
      taskList.push({
        name: command,
        method: buildTask(config, task, command.split(':'))
      });
    });
  });
  return taskList;
};
