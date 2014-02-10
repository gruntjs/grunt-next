const _ = require('lodash');
const Promise = require('bluebird');
const configFiles = require('configfiles');

function Task (opts) {
  _.extend(this, opts);
}

Task.createMulti = function (opts) {
  opts.multiTask = true;
  return new Task(opts);
};

Task.create = function (opts) {
  return new Task(opts);
};

Task.prototype.build = function (config) {
  return function () {
    var ret = true;
    var context = this.context(config);
    if(this.fn) {
      ret = this.fn.call(context);
    }

    // we use orchestrator to instrument our tasks.  optionally returning
    // a promise is a total hack, but it allows us to effectively introspect
    // a grunt task to find out if it was meant to be async, and handle things
    // accordingly
    if (!context.deferred) {
      return ret;
    } else {
      return context.deferred.promise;
    }
  }.bind(this);
};

Task.prototype.run = function (config) {
  return this.build(config)();
};

Task.prototype.context = function (config) {
  var name = this.name;
  var context = {};
  context.deferred = false;

  // this is a hack to allow grunt's `this.async()` helper to be used
  // like a promise so that orchestrator can know when the task has
  // completed.
  context.async = function () {
    this.deferred = Promise.defer();
    return function (msg) {
      if (msg) {
        this.deferred.reject(msg);
      } else {
        this.deferred.resolve();
      }
    }.bind(this);
  };

  context.options = function (defaults) {
    var path = [];
    var options = [config.get('options')];
    var segments = name.split('.');
    segments.forEach(function (node) {
      path.push(node);
      options.push(config.get(path.concat('options').join('.')));
    });
    options.unshift(defaults);
    return _.merge.apply(null, options);
  };

  Object.defineProperty(context, 'files', {
    get: function () {
      return configFiles(config.get(name));
    }
  });

  Object.defineProperty(context, 'filesSrc', {
    get: function () {
      return _.uniq(_.flatten(_.pluck(this.files, 'src')));
    }
  });

  return context;
};

module.exports = Task;
