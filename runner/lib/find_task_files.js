/*
  Given an array of folders or module names, this finds and returns a
  flattened array of paths to all task files found within.
*/

const path = require('path');
const glob = require('glob');
const _ = require('lodash');

module.exports = function (input, node_module) {
  var taskDir;
  if (!Array.isArray(input)) {
    input = [input];
  }
  return _.flatten(input.map(function (task) {
    if (node_module) {
      taskDir = path.resolve('node_modules', task, 'tasks');
    } else {
      taskDir = path.resolve(task);
    }
    return glob.sync(taskDir+'/*.js');
  }));
};
