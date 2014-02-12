// This handles the different forms of registerTask and registerMultiTask.
// The result is a normalized object which can be used to construct a
// grunt task.

module.exports = function (config) {
  var arity = config.length;
  var name = config[0];
  var desc = 'Custom Task';
  var fn = null;
  var deps = null;

  // support registerTask('name', 'desc', function () { ... });
  if (arity === 3) {
    desc = config[1];
    fn = config[2];
  } else if (arity === 2) {
    // support registerTask('name', function () { ... });
    if (typeof config[1] === 'function') {
      fn = config[1];
    } else {
      // support registerTask('name', ['task', task', 'task']);
      if(!Array.isArray(config[1])) {
        deps = [config[1]];
      } else {
        deps = config[1];
      }
      desc = 'Alias for "'+deps.join('", "')+'" task'+(deps.length=== 1?'':'s')+'.';
    }
  } else {
    throw new Error('Unable to register task.');
  }

  return {
    name: name,
    desc: desc,
    deps: deps,
    fn: fn
  };
};
