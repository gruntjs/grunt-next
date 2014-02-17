const findTaskFiles = require('./find_task_files');
const loadTaskFiles = require('./load_task_files');
const parseRegister = require('./parse_register');
const Task = require('../../task');

exports.registry = {};

exports.register = function (task) {
  exports.registry[task.name] = new Task(task);
};

exports.registerTask = function () {
  exports.register(parseRegister(arguments, 'single'));
};

exports.registerMultiTask = function () {
  exports.register(parseRegister(arguments, 'multi'));
};

exports.loadTasks = function (input) {
  loadTaskFiles(findTaskFiles(input), this);
};

exports.loadNpmTasks = function (input) {
  loadTaskFiles(findTaskFiles(input, true), this);
};

exports.renameTask = function (oldName, newName) {
  console.log(oldName, newName);
};
