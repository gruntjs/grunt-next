const inherits = require('util').inherits;
const EE = require('events').EventEmitter;
const spawn = require('child_process').spawn;
const Orchestrator = require('orchestrator');

function Runner (grunt) {
  if (!(this instanceof Runner)) { return new Runner(grunt); }
  EE.call(this);
  this.grunt = grunt;
  this.running = false;
  this.runner = null;
  this.spawner = null;
}
module.exports = Runner;
inherits(Runner, EE);

Runner.prototype.run = function (request, options, cb) {
  var self = this;

  // Interrupt current tasks
  if (this.running && options.interrupt === true) {
    return this.interrupt(function() {
      self.run(request, options, cb);
    });
  }

  this.running = true;
  var start = Date.now();
  this[options.spawn ? 'spawn' : 'nospawn'](request, options, function() {
    self.running = false;
    cb(Date.now() - start);
  });
};

Runner.prototype.nospawn = function (request, options, cb) {
  var grunt = this.grunt;
  var runner = this.runner;
  var commands = grunt.parseCommands(request);
  var taskList = grunt.buildTasks(commands);
  runner = grunt.buildRunner(taskList);
  runner.start(commands, cb);
};

Runner.prototype.spawn = function (request, options, cb) {
  if (!Array.isArray(request)) { request = [request]; }
  // TODO: Use wait-grunt instead here
  // TODO: Use mtime to write a manifest so changed files are available to spawn'd tasks
  this.spawner = this.grunt.util.spawn({
    grunt: true,
    opts: {
      stdio: 'inherit',
      cwd: options.cwd,
    },
    args: request.concat(options.cliArgs || []),
  }, cb);
};

// Interrupt the current running tasks
Runner.prototype.interrupt = function (cb) {
  this.running = false;
  this.runner = null;
  this.spawner = null;
  this.emit('interrupt');
  if (this.runner) {
    this.runner.stop();
    cb();
  } else if (this.spawner) {
    this.spawner.on('close', cb);
    this.spawner.kill();
  }
};
