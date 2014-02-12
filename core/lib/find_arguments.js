// This takes an array of grunt commands and extracts which parts
// of them should be passed into each methods as an argument.
//
// Users can send arguments into a "single" task by invoking grunt like so:
// grunt task:argument1:argument2
//
// For "multi" tasks, the first argument is not passed in because it is used
// to specify the "target" to execute.
// grunt task:target:argument1.

module.exports = function (tasks, commands) {
  return commands.reduce(function (result, command) {
    var args = command.split(':');
    var taskName = args[0];
    var task = tasks[taskName];
    if (!task) {
      return;
    }
    if (task.type === 'single') {
      result[command] = args.slice(1);
    } else if (task.type === 'multi') {
      result[command] = args.slice(2);
    } else {
      result[command] = [];
    }
    return result;
  }, {});
};
