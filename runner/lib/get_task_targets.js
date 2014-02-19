/*
  Find all valid target names for a task configuration.
  TODO: do something about _target names.

  e.g.
  task: {
    options: {},
    targetOne: ['test/fixtures/files/*.js'],
    targetTwo: {
      src: ['test/fixtures/files/*.js']
    }
  };
  =
  ['task:targetOne', 'task:targetTwo']
*/

module.exports = function (config, taskName) {
  return Object.keys(config).reduce(function (result, key) {
    if (key != 'options') {
      result.push(taskName+':'+key);
    }
    return result;
  }, []);
};
