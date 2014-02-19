module.exports = function (config, tasks, commands) {
  var taskList = [];
  Object.keys(commands).forEach(function (taskName) {
    var task = tasks[taskName];
    var taskConfig = config.get(taskName);
    var toRun = commands[taskName];
    toRun.forEach(function (command) {
      taskList.push({
        name: command,
        method: task.build(taskConfig, command)
      });
    });
  });
  return taskList;
};
