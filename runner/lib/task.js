const findTasks = require('./find_tasks');
const loadTasks = require('./load_tasks');
const parseRegister = require('./parse_register');
const Task = require('../../task');

exports.tasks = {};

exports.register = function (task) {
  exports.tasks[task.name] = new Task(task);
};

exports.registerTask = function () {
  exports.register(parseRegister(arguments, 'single'));
};

exports.registerMultiTask = function () {
  exports.register(parseRegister(arguments, 'multi'));
};

exports.loadTasks = function (input) {
  loadTasks(findTasks(input), this);
};

exports.loadNpmTasks = function (input) {
  loadTasks(findTasks(input, true), this);
};

exports.renameTask = function (oldName, newName) {
  console.log(oldName, newName);
};