const util = require('util');
const EventEmitter = require('events').EventEmitter;
const expander = require('expander');
const orchestrate = require('./lib/orchestrate');
const logEvents = require('./lib/log_events');
const bindMany = require('./lib/utils/bind_many');
const _ = require('lodash');

function Grunt (env) {
  // save liftoff environment
  this.env = env;
  // extend task namespace into this for convenience
  _.extend(this, this.task);
  // ensure some methods always execute with the right context
  bindMany(this, ['run', 'loadTasks','loadNpmTasks']);
  // backwards compat
  this.task.run = this.run;
}
util.inherits(Grunt, EventEmitter);

Grunt.prototype.task = require('./lib/task');
Grunt.prototype.util = {};
Grunt.prototype.util._ = _;

Grunt.prototype.initConfig = function (data) {
  this.config = expander.interface(data);
};

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
