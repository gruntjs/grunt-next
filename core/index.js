const util = require('util');
const Orchestrator = require('orchestrator');
const expander = require('expander');
const parseArgs = require('./lib/utils/parse_args');
const findTasks = require('./lib/find_tasks');
const loadTasks = require('./lib/load_tasks');
const parseRegister = require('./lib/parse_register');
const Task = require('../task');

function Grunt (env) {
  this.env = env;
  Orchestrator.call(this);
}
util.inherits(Grunt, Orchestrator);

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
  var task = Task.create(parseRegister(arguments));
  this.register(task);
};

Grunt.prototype.registerMultiTask = function () {
  var task = Task.createMulti(parseRegister(arguments));
  this.register(task);
};

Grunt.prototype.register = function (task) {
  if (task.deps) {
    this.add(task.name, task.deps, task.build(this.config));
  } else {
    this.add(task.name, task.build(this.config));
  }
};

Grunt.prototype.option = function (name) { return this.env[name]; };
Grunt.prototype.log = require('../legacy/lib/grunt').log;
Grunt.prototype.file = require('../legacy/lib/grunt').file;
Grunt.prototype.warn = require('../legacy/lib/grunt').warn;
Grunt.prototype.verbose = require('../legacy/lib/grunt').verbose;
Grunt.prototype.fail = require('../legacy/lib/grunt').fail;

module.exports = Grunt;
