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
  this.option = expander.interface(this.env.argv);
  legacy(this);
  EventEmitter2.call(this, {wildcard:true});
  bindMany(['loadTasks', 'loadNpmTasks'], this);
}
util.inherits(Grunt, EventEmitter2);

Grunt.prototype.init =  function (data) {
  this.config = expander.interface(data, {
    imports: {
      grunt: {
        template: this.template,
        option: this.option
      }
    }
  });
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
  this.emit('run.request', request);

  // remove invalid requests / resolve aliases / expand multi tasks
  var commands = parseCommands(this.config, this.tasks, request);
  this.emit('run.parseCommands', commands);

  // group commands by their root task
  var indexedCommands = indexCommands(commands);
  this.emit('run.indexCommands', indexedCommands);

  // build a listing of tasks to put into orchestrator
  var taskList = buildTaskList(this.config, this.tasks, indexedCommands);
  this.emit('run.buildTaskList', taskList);

  // build an orchestration
  var runner = new Orchestrator();
  taskList.forEach(function (task) {
    runner.add(task.name, task.method);
  });

  // emit some stuff (this will be cleaned up in the next v of orchestrator)
  runner.on('task_start', function (e) {
    // this will not be reliable when running tasks concurrently!
    this.task.current = runner.tasks[e.task].fn.context;
    this.emit('task_start', e);
  }.bind(this));
  runner.on('task_stop', function (e) {
    this.task.current = null;
    this.emit('task_stop', e);
  }.bind(this));

  // run it!
  runner.start(commands);
};

module.exports = Grunt;
