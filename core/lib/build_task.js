const Promise = require('bluebird');
const _ = require('lodash');

module.exports = function (opts) {
  var config = this.config;
  var name = opts.name;
  var method = opts.fn;

  return function () {
    var deferred = false;
    var context = {};
    // hack to provide 'async' helper that resolves or rejects a promise
    context.async = function () {
      deferred = Promise.defer();
      return function (msg) {
        if (msg) {
          deferred.reject(msg);
        } else {
          deferred.resolve();
        }
      };
    };
    context.options = function (defaults) {
      return defaults;
    };

    var task = config.pipeline.get(name);
    var files = task.files;
    context.files = files;
    context.filesSrc = _.uniq(_.flatten(_.pluck(files, 'src')));

    var ret = method.call(context);
    // we use orchestrator to instrument our tasks.  optionally returning
    // a promise is a total hack, but it allows us to effectively introspect
    // a grunt task to find out if it was meant to be async, and handle things
    // accordingly
    if (!deferred) {
      return ret;
    } else {
      return deferred.promise;
    }
  };
};
