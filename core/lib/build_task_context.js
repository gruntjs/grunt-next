const Promise = require('bluebird');
const _ = require('lodash');
const configFiles = require('configFiles');

module.exports = function (config, task, target)  {

  var lookup = [task.name];
  if (target) {
    lookup.push(target);
  }
  var context = {};

  // This is a total hack to make grunt's `this.async()` method work
  // with Orchestrator.  It returns a "callback" that will reject or
  // resolve an internal promise.  It is being used this way so that
  // we can correctly hint to Orchestrator when the task is complete.
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

  // Lazily extract src/dest pairs from a valid grunt config.
  Object.defineProperty(context, 'files', {
    get: function () {
      return configFiles(config.get(lookup.join('.')));
    }
  });

  // Lazily extract source files alone from a valid grunt config.
  Object.defineProperty(context, 'filesSrc', {
    get: function () {
      return _.uniq(_.flatten(_.pluck(this.files, 'src')));
    }
  });

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

  return context;
};
