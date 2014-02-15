const _ = require('lodash');
const Promise = require('bluebird');
const configFiles = require('configFiles');

module.exports = function (config, command, type) {

  var context = {};

  if(type === 'multi') {
    if(command.length < 2) {
      throw new Error('Unable to generate multi-task context without target.');
    }
    context.target = command[1];
    context.data = config[command[1]];
    args = command.slice(2);
  } else {
    context.data = config;
    args = command.slice(1);
  }

  if(!context.data) {
    context.data = {};
  }

  // Store the arguments passed to the task in string form.
  context.nameArgs = args.join(':');

  // Store the arguments array passed to the task
  context.args = args;

  // Store flags for each argument passed to the task.
  context.flags = args.reduce(function (flags, item) {
    flags[item] = true;
    return flags;
  }, {});

  // This is a hack to make grunt's `this.async()` method work with
  // Orchestrator. It returns a "callback" function that will reject
  // or resolve and internal promise.
  // It is being used this way so that we can correctly hint to
  // Orchestrator when a task is complete.
  context.async = function () {
    context.deferred = Promise.defer();
    return function (msg) {
      if (msg) {
        context.deferred.reject(msg);
      } else {
        context.deferred.resolve();
      }
    };
  };

  // Shallow merge task and target options over provided defaults.
  context.options = function (defaults) {
    var merge = [defaults, config.options];
    if(context.target) {
      merge.push(context.data.options);
    }
    return _.merge.apply(null, merge);
  };

  // Lazily extract src/dest pairs for this task/target.
  Object.defineProperty(context, 'files', {
    get: function () {
      return configFiles(this.data);
    }.bind(context)
  });

  // Lazily extract source files for this task/target.
  Object.defineProperty(context, 'filesSrc', {
    get: function () {
      return _.uniq(_.flatten(_.pluck(this.files, 'src')));
    }
  });

  return context;
};
