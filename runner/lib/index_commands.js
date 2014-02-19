/*
  Index an array of grunt commands by their task name.

  e.g.
  grunt nodeunit jshint:lib jshint:test
  =
  {
    nodeunit: ['nodeunit'],
    jshint: ['jshint:lib','jshint:test']
  }
*/
var getCommandTask = require('./get_command_task');

module.exports = function (commands) {
  return commands.reduce(function (tasks, command) {
    var taskName = getCommandTask(command);
    var task = tasks[taskName];
    if(!task) {
      tasks[taskName] = [];
      task = tasks[taskName];
    }
    task.push(command);
    return tasks;
  }, {});
};
