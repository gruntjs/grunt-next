const _ = require('lodash');
const bindMany = require('./lib/utils/bind_many');
const util = require('util');
const EventEmitter = require('events').EventEmitter;
const expander = require('expander');
const indexCommands = require('./lib/index_commands');
const buildRunner = require('./lib/build_runner');
const buildTaskEntries = require('./lib/build_task_entries');

function Grunt (env) {
  this.env = env;
  _.extend(this, this.task);
  this.task.run = this.run;
  bindMany([
    'run',
    'loadTasks',
    'loadNpmTasks'
  ], this);
}
util.inherits(Grunt, EventEmitter);

Grunt.prototype.util = {};
Grunt.prototype.util._ = _;
Grunt.prototype.util.async = require('async');
Grunt.prototype.option = function (name) { return this.env.argv[name]; };
Grunt.prototype.log = require('../legacy/lib/grunt').log;
Grunt.prototype.file = require('../legacy/lib/grunt').file;
Grunt.prototype.warn = require('../legacy/lib/grunt').warn;
Grunt.prototype.verbose = require('../legacy/lib/grunt').verbose;
Grunt.prototype.fail = require('../legacy/lib/grunt').fail;
Grunt.prototype.template = require('../legacy/lib/grunt/template');
Grunt.prototype.task = require('./lib/task');

Grunt.prototype.initConfig = function (data) {
  this.config = expander.interface(data);
};

Grunt.prototype.run = function (request) {
  var tasks = this.requestTasks(request);
  var runner = buildRunner(tasks);
  runner.start(request);
};

Grunt.prototype.requestTasks = function (request) {
  var methods = [];
  var commands = indexCommands(request);
  Object.keys(commands).map(function (taskName) {
    var config = this.config.get(taskName);
    var run = commands[taskName];
    var task = this.tasks[taskName];
    if(!task) {
      console.log('Task "'+taskName+'" is not found.');
      return;
    }
    if (task.type === 'alias') {
      methods.push(this.requestTasks(task.fn));
    } else {
      methods.push(buildTaskEntries(task, config, run));
    }
  }, this);

  return _.flatten(methods);
};

module.exports = Grunt;
