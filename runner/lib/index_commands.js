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
module.exports = function (commands) {
  return commands.reduce(function (tasks, command) {
    var taskName = command.split(':')[0];
    var task = tasks[taskName];
    if(!task) {
      tasks[taskName] = [];
      task = tasks[taskName];
    }
    task.push(command);
    return tasks;
  }, {});
};
