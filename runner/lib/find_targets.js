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
  ['targetOne', 'targetTwo']
*/

module.exports = function (config) {
  var targets = [];
  Object.keys(config).forEach(function (key) {
    if (key != 'options') {
      targets.push(key);
    }
  });
  return targets;
};
