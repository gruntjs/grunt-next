const util = require('util');
const pkg = require('../package');
const Task = require('../task');
const legacy = require('../legacy');
const expander = require('expander');
const bindMany = require('./lib/utils/bind_many');
const parseRegister = require('./lib/parse_register');
const findTaskFiles = require('./lib/find_task_files');
const loadTaskFiles = require('./lib/load_task_files');
const parseCommands = require('./lib/parse_commands');
const indexCommands = require('./lib/index_commands');
const buildTaskList = require('./lib/build_task_list');
const EventEmitter2 = require('eventemitter2').EventEmitter2;
const Orchestrator = require('orchestrator');

function Grunt (env) {
  this.env = env;
  this.events = this;
  this.tasks = [];
  EventEmitter2.call(this, {wildcard:true});
  bindMany(['loadTasks', 'loadNpmTasks'], this);
}
util.inherits(Grunt, EventEmitter2);

Grunt.prototype.init =  function (data) {
  this.config = expander.interface(data);
  legacy(this);
};
Grunt.prototype.initConfig = Grunt.prototype.init;
Grunt.prototype.package = pkg;
Grunt.prototype.version = pkg.version;

Grunt.prototype.register = function (task, constructor) {
  this.tasks[task.name] = new constructor(task);
};
Grunt.prototype.registerTask = function () {
  this.register(parseRegister(arguments, 'single'), Task);
};
Grunt.prototype.registerMultiTask = function () {
  this.register(parseRegister(arguments, 'multi'), Task);
};
Grunt.prototype.loadTasks = function (input) {
  loadTaskFiles(findTaskFiles(input), this);
};
Grunt.prototype.loadNpmTasks = function (input) {
  loadTaskFiles(findTaskFiles(input, true), this);
};
Grunt.prototype.renameTask = function (oldName, newName) {
  console.log(oldName, newName);
};

Grunt.prototype.run = function (request) {
  console.log('run:', request);
  var commands = parseCommands(this.config, this.tasks, request);
  console.log('parseCommands:', commands);
  var indexedCommands = indexCommands(commands);
  console.log('indexCommands:', indexedCommands);
  var taskList = buildTaskList(this.config, this.tasks, indexedCommands);
  console.log('buildTaskList', taskList);
  var runner = new Orchestrator();
  taskList.forEach(function (task) {
    runner.add(task.name, task.method);
  });
  runner.on('task_start', function (e) {
    // this will not be reliable when running tasks concurrently
    this.task.current = runner.tasks[e.task].fn.context;
  }.bind(this));
  runner.on('task_end', function () {
    this.task.current = null;
  });
  console.log('running', commands);
  runner.start(commands);
};

module.exports = Grunt;
