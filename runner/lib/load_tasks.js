/*
  Given an array of files, this requires each, expecting to get a function.
  If one is found, it will be invoked with the provided context.  This is
  how grunt is passed into
  module.exports = function (grunt) { ... }

  If you are building a tool that will have an ecosystem of plugins, please
  do NOT do this.  Tightly coupling plugins with the modules that consume
  them makes it a giant pain in the ass to change the plugin consumer (in
  this case grunt) without breaking the entire ecosystem.
*/
module.exports = function (tasks, context) {
  tasks.forEach(function (taskFile) {
    var task = require(taskFile);
    if (typeof task === 'function') {
      task.call(null, context);
    }
  });
};
