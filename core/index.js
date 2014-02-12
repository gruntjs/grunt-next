const util = require('util');
const EventEmitter = require('events').EventEmitter;
const expander = require('expander');
const parseArgs = require('./lib/parse_args');
const findTasks = require('./lib/find_tasks');
const loadTasks = require('./lib/load_tasks');
const parseRegister = require('./lib/parse_register');
const orchestrate = require('./lib/orchestrate');
const logEvents = require('./lib/log_events');

function Grunt (env) {
  this.env = env;
  this.tasks = {};
  this.registryDirty = false;
}
util.inherits(Grunt, EventEmitter);

Grunt.prototype.util = {};
Grunt.prototype.util._ = require('lodash');

Grunt.prototype.initConfig = function (data) {
  this.config = expander.interface(data);
};

Grunt.prototype.loadTasks = function () {
  loadTasks(findTasks(parseArgs(arguments)), this);
};

Grunt.prototype.loadNpmTasks = function () {
  loadTasks(findTasks(parseArgs(arguments), true), this);
};

Grunt.prototype.registerTask = function () {
  this.register(parseRegister(arguments), 'single');
};

Grunt.prototype.registerMultiTask = function () {
  this.register(parseRegister(arguments), 'multi');
};

Grunt.prototype.register = function (task, type) {
  task.type = type;
  this.tasks[task.name] = task;
};

//Grunt.prototype.renameTask = function (oldName, newName) {
  // sigh
//};

Grunt.prototype.run = function (toRun) {
  var runner = orchestrate(this.config, this.tasks, toRun);
  logEvents(runner);
  runner.start(toRun);
};

Grunt.prototype.option = function (name) { return this.env[name]; };
Grunt.prototype.log = require('../legacy/lib/grunt').log;
Grunt.prototype.file = require('../legacy/lib/grunt').file;
Grunt.prototype.warn = require('../legacy/lib/grunt').warn;
Grunt.prototype.verbose = require('../legacy/lib/grunt').verbose;
Grunt.prototype.fail = require('../legacy/lib/grunt').fail;

module.exports = Grunt;
