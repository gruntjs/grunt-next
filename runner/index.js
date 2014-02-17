const _ = require('lodash');
const pkg = require('../package');
const bindMany = require('./lib/utils/bind_many');
const util = require('util');
const EventEmitter2 = require('eventemitter2').EventEmitter2;
const expander = require('expander');
const buildRunner = require('./lib/build_runner');
const requestTasks = require('./lib/request_tasks');

function Grunt (env) {
  this.env = env;
  bindMany([
    'run',
    'loadTasks',
    'loadNpmTasks'
  ], this);
  EventEmitter2.call(this, {wildcard:true});
  this.events = this;
  this.tasks = this.task.registry;
}
util.inherits(Grunt, EventEmitter2);

Grunt.prototype.util = require('../legacy/lib/grunt/util');
Grunt.prototype.util.async = require('async');
Grunt.prototype.package = pkg;
Grunt.prototype.version = pkg.version;

Grunt.prototype.option = function (name) { return this.env.argv[name]; };
Grunt.prototype.log = require('../legacy/lib/grunt').log;
Grunt.prototype.file = require('../legacy/lib/grunt').file;
Grunt.prototype.warn = require('../legacy/lib/grunt').warn;
Grunt.prototype.verbose = require('../legacy/lib/grunt').verbose;
Grunt.prototype.fail = require('../legacy/lib/grunt').fail;

Grunt.prototype.task = require('./lib/task');
_.extend(Grunt.prototype, Grunt.prototype.task);

Grunt.prototype.template = require('./lib/utils/template');

Grunt.prototype.initConfig = function (data) {
  var config = expander.interface(data);
  this.config = config;
  // hook grunt.template.process into expander
  this.template.process = function (data) {
    return config.process(data);
  };
};
Grunt.prototype.init = Grunt.prototype.initConfig;

Grunt.prototype.run = function (request) {
  var tasks = requestTasks(this.config, this.tasks, request);
  console.log('Registering tasks with Orchestrator:\n', tasks);
  var runner = buildRunner(tasks);
  runner.on('task_start', function (e) {
    // this will not be reliable when running tasks concurrently
    this.task.current = runner.tasks[e.task].fn.context;
  }.bind(this));
  runner.on('task_end', function () {
    this.task.current = null;
  });
  runner.start(request);
};

module.exports = Grunt;
