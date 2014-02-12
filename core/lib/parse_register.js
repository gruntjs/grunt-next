// This normalizes the different forms of registerTask and registerMultiTask.

module.exports = function (config, type) {
  var arity = config.length;
  var name = config[0];
  var desc = 'Custom Task';
  var fn = null;

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
      if (!Array.isArray(config[1])) {
        fn = [config[1]];
      } else {
        fn = config[1];
      }
      type = 'alias';
      desc = 'Alias for "'+fn.join('", "')+'" task'+(fn.length=== 1?'':'s')+'.';
    }
  } else {
    throw new Error('Unable to register task.');
  }

  return {
    name: name,
    desc: desc,
    type: type,
    fn: fn
  };
};
