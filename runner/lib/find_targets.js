// Given a task configuration object, this will return an array of all
// valid target names.
//
// TODO: do something about _target names.
module.exports = function (config) {
  var targets = [];
  Object.keys(config).forEach(function (key) {
    if (key != 'options') {
      targets.push(key);
    }
  });
  return targets;
};
