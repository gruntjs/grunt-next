const _ = require('lodash');
const findTargets = require('./find_targets');

var hasTarget = function (command) {
  return command.indexOf(':') !== -1;
};

var getTarget = function (command) {
  return command.split(':')[1];
};

var buildTasks = function (task, config, commands) {
  var taskName = task.name;
  var isMulti = task.type === 'multi';

  console.log('Building tasks for "'+taskName+'": ', commands);

  return _.flatten(commands.map(function (command) {
    if (isMulti) {

      // if we are calling a multi task without a target, we need to
      // create entries for all targets and then create an alias that
      // runs them.
      if(!hasTarget(command)) {
        console.log('Calling multi task "'+taskName+'" without target, generating alias...');
        var targets = findTargets(config);
        var subCommands = targets.map(function (target) {
          return taskName+':'+target;
        });
        var commands = buildTasks(task, config, subCommands);
        commands.push({
          name: command,
          method: subCommands
        });
        return commands;
      }

      // if the requested target doesn't exist, create a dummy task
      // to log this.  there is probably a better way to go about
      // this.
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

  }));
};

module.exports = buildTasks;
