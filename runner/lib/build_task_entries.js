const findTargets = require('./find_targets');

var hasTarget = function (command) {
  return command.indexOf(':') !== -1;
};

var getTarget = function (command) {
  return command.split(':')[1];
};

var buildTaskEntries = function (task, config, commands) {
  var taskName = task.name;
  var isMulti = task.type === 'multi';

  return commands.map(function (command) {
    if (isMulti) {

      // if we are calling a multi task without a target, we need to
      // create entries for all targets and then create an alias that
      // runs all of them.
      if(!hasTarget(command)) {
        var targets = findTargets(config);
        var subCommands = targets.map(function (target) {
          return taskName+':'+target;
        });
        var commands = buildTaskEntries(task, config, subCommands);
        commands.push({
          name: command,
          method: subCommands
        });
        return commands;
      }

      var target = getTarget(command);
      if (!config[target]) {
        return {
          name: command,
          method: function() {
            console.log('Task "'+taskName+'" has no target "'+target+'".');
          }
        };
      }
    }

    return {
      name: command,
      method: task.build(config, command)
    };

  });
};

module.exports = buildTaskEntries;
