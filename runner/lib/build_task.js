const _ = require('lodash');

module.exports = function (config, task, command) {

  // This hack makes it possible for <%= grunt.task.current.X %> type
  // configuration strings to function correctly when running tasks
  // concurrently.  In older versions of grunt, `grunt.task.current`
  // was pulled off the master grunt instance.  It is now retrieved
  // using a mocked context at the time the task is constructed.
  var context = task.commandData(command);
  var taskConfig = config.get(task.name, {
    imports: {
      grunt: {
        task: {
          current: context
        }
      }
    }
  });

  if(task.isMulti()) {
    var options = taskConfig.options||{};
    // find the target for this multitask
    taskConfig = taskConfig[context.target]||{};
    // merge top level options with target level
    taskConfig.options = _.extend(options, taskConfig.options||{});
  }

  return task.build(taskConfig, command);
};
