// This builds the context object (`this`) that will be used during
// the execution of a task.

const Promise = require('bluebird');
const _ = require('lodash');
const configFiles = require('configFiles');

module.exports = function (opts)  {
  var config = opts.config;
  var task = opts.task;
  var target = opts.target;
  var args = opts.args;

  var lookup = [opts.taskName];
  if (target) {
    lookup.push(target);
  }

  var context = {};

  // Store a reference to the task object
  context.task = task;

  // Store the currently running target.
  context.target = target;

  // Store the arguments passed to the task in string form.
  context.nameArgs = args.join(':');

  // Store the arguments array passed to the task
  context.args = args;

  // Store flags for each argument passed to the task.
  context.flags = args.reduce(function (flags, item) {
    flags[item] = true;
    return flags;
  }, {});

  // This is a total hack to make grunt's `this.async()` method work
  // with Orchestrator.  It returns a "callback" that will reject or
  // resolve an internal promise when invoked.  It is being used this
  // way so that we can correctly hint to Orchestrator when a task
  // is complete.
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

  // Start at the top of the grunt config and traverse downward,
  // collecting the `options` key at each node.  Then, take the
  // provided defaults and perform a shallow merge to produce
  // the actual desired options for the task.
  context.options = function (defaults) {
    var path = [];
    var options = [config.get('options')];
    lookup.forEach(function (node) {
      path.push(node);
      options.push(config.get(path.concat('options')));
    });
    options.unshift(defaults);
    return _.merge.apply(null, options);
  };


  // Lazily extract config for this task/target.
  Object.defineProperty(context, 'data', {
    get: function () {
      return config.get(lookup);
    }
  });

  // Lazily extract src/dest pairs from a valid grunt config.
  Object.defineProperty(context, 'files', {
    get: function () {
      return configFiles(this.data);
    }
  });

  // Lazily extract source files alone from a valid grunt config.
  Object.defineProperty(context, 'filesSrc', {
    get: function () {
      return _.uniq(_.flatten(_.pluck(this.files, 'src')));
    }
  });


  return context;
};
