module.exports = function () {
  var arity = arguments.length;
  var name = arguments[0];
  var desc = 'Task';
  var fn = null;
  var deps = null;
  if(arity === 2) {
    // if the second argument is a function, it's a task method
    if(typeof arguments[1] === 'function') {
      name = arguments[0];
      fn = arguments[1];
    } else {
      // if the second argument is not an array, we can safely assume
      // it is a string, and coerce it to an array, as an alias
      if(!Array.isArray(arguments[1])) {
        deps = [arguments[1]];
      } else {
        deps = arguments[1];
      }
      desc = 'Alias for "'+deps.join('", "')+'" task'+(deps.length=== 1?'':'s')+'.';
    }
  }

  if(arity === 3) {
    name = arguments[0];
    desc = arguments[1];
    fn = arguments[2];
  }

  return {
    name: name,
    desc: desc,
    deps: deps,
    fn: fn
  };
};
