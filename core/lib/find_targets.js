// Given a task configuration object, this will return an array of all
// valid target names.  The example configuration below (for jshint)
//
// would return: ['tests','lib']
// {
//   options: {
//        jshintrc: '.jshintrc'
//   },
//   tests: {
//     src: ['test/**/*.js']
//   },
//   lib: ['lib/**/*.js']
// }
// TODO: do something about _target names.
//
module.exports = function (config) {
  var targets = [];
  Object.keys(config).forEach(function (key) {
    if (key != 'options') {
      targets.push(key);
    }
  });
  return targets;
};
