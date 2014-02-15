const _ = require('lodash');
const bindMany = require('./lib/utils/bind_many');
const util = require('util');
const EventEmitter = require('events').EventEmitter;
const expander = require('expander');
const Orchestrator = require('orchestrator');
const parseCommands = require('./lib/parse_commands');
const findTargets = require('./lib/find_targets');
const logEvents = require('./lib/log_events');

function Grunt (env) {
  this.env = env;
  _.extend(this, this.task);
  this.task.run = this.run;
  bindMany([
    'run',
    'loadTasks',
    'loadNpmTasks'
  ], this);

};
util.inherits(Grunt, EventEmitter);

Grunt.prototype.util = {};
Grunt.prototype.util._ = _;
Grunt.prototype.option = function (name) { return this.env.argv[name]; };
Grunt.prototype.log = require('../legacy/lib/grunt').log;
Grunt.prototype.file = require('../legacy/lib/grunt').file;
Grunt.prototype.warn = require('../legacy/lib/grunt').warn;
Grunt.prototype.verbose = require('../legacy/lib/grunt').verbose;
Grunt.prototype.fail = require('../legacy/lib/grunt').fail;
Grunt.prototype.task = require('./lib/task');

Grunt.prototype.initConfig = function (data) {
  this.config = expander.interface(data);
};

Grunt.prototype.run = function (request) {
  var runner = new Orchestrator();
  var args = parseCommands(request);
  Object.keys(args).map(function (taskName) {
    var task = this.tasks[taskName];
    var config = this.config.get(taskName);
    var commands = args[taskName];
    commands.forEach(function (command) {
      if (!runner.hasTask(command)) {
        runner.add(command, task.build(config, command));
      }
    });
  }, this);

  logEvents(runner);
  runner.start(request);
};

module.exports = Grunt;
