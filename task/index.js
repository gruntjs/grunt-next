const _ = require('lodash');
const Promise = require('bluebird');
const configFiles = require('configFiles');

function Task (opts) {
  _.extend(this, opts);
}

Task.prototype.isMulti = function () {
  return this.type === 'multi';
};

Task.prototype.isSingle = function () {
  return this.type === 'single';
};

Task.prototype.isAlias = function () {
  return this.type === 'alias';
};

Task.prototype.commandData = function (command) {
  var data = {};

  // Task name.
  data.name = command[0];

  // Extract target/args depending on task type.
  if(this.isMulti()) {
    data.target = command[1];
    data.args = command.slice(2);
  } else {
    data.args = command.slice(1);
  }

  // The arguments passed to the task in string form.
  data.nameArgs = data.args.join(':');

  // Store flags for each argument passed to the task.
  data.flags = data.args.reduce(function (flags, item) {
    flags[item] = true;
    return flags;
  }, {});

  return data;
};

Task.prototype.buildContext = function (config) {
  var context = {};

  context.data = config;
  context.options = config.options;
  context.files = configFiles(config);

  // Shallow merge task options over provided defaults.
  context.options = function (defaults) {
    return _.extend({}, defaults, config.options);
  };

  // Lazily extract source files for this task/target.
  Object.defineProperty(context, 'filesSrc', {
    get: function () {
      return _.uniq(_.flatten(_.pluck(context.files||[], 'src')));
    }
  });

  // This is a hack to make grunt's `this.async()` method work with
  // Orchestrator. It returns a "callback" function that will reject
  // or resolve an internal promise.
  context.async = function () {
    context.deferred = Promise.defer();
    return function (msg) {
      // this needs to be brought in line with grunt
      if (msg) {
        context.deferred.reject(msg);
      } else {
        context.deferred.resolve(true);
      }
    };
  };

  return context;
};


Task.prototype.build = function (config, command) {
  return function () {
    // build the context object for this task
    var context = _.extend(this.buildContext(config), this.commandData(command));

    // Execute the actual task method from registerTask or registerMultiTask.
    var ret = this.fn.call(context);

    // Conditionally returning a promise in this manner is a very bad
    // practice but we need a way to properly hint to Orchestrator when
    // an async task is complete.  Typically this is performed by taking
    // in a callback, but we can't do that for historical reasons--there
    // are several thousand grunt plugins in the wild.
    if (!context.deferred) {
      return ret;
    } else {
      return context.deferred.promise;
    }
  }.bind(this);
};

module.exports = Task;
