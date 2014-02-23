const inherits = require('util').inherits;
const EE = require('events').EventEmitter;
const spawn = require('child_process').spawn;
const Orchestrator = require('orchestrator');
const parseCommands = require('../../runner/lib/parse_commands');
const indexCommands = require('../../runner/lib/index_commands');
const buildTaskList = require('../../runner/lib/build_task_list');

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

// TODO: This could probably just use grunt.run the orchestrator instance is exposed
Runner.prototype.nospawn = function (request, options, cb) {
  var self = this;
  this.grunt.emit('run.request', request);

  // remove invalid requests / resolve aliases / expand multi tasks
  var commands = parseCommands(this.grunt.config, this.grunt.tasks, request);
  this.grunt.emit('run.parseCommands', commands);

  // group commands by their root task
  var indexedCommands = indexCommands(commands);
  this.grunt.emit('run.indexCommands', indexedCommands);

  // build a listing of tasks to put into orchestrator
  var taskList = buildTaskList(this.grunt.config, this.grunt.tasks, indexedCommands);
  this.grunt.emit('run.buildTaskList', taskList);

  // build an orchestration
  this.runner = new Orchestrator();
  taskList.forEach(function (task) {
    self.runner.add(task.name, task.method);
  });

  // emit some stuff (this.grunt will be cleaned up in the next v of orchestrator)
  this.runner.on('task_start', function (e) {
    // this.grunt will not be reliable when running tasks concurrently!
    self.grunt.task.current = self.runner.tasks[e.task].fn.context;
    self.grunt.emit('task_start', e);
  });
  this.runner.on('task_stop', function (e) {
    self.grunt.task.current = null;
    self.grunt.emit('task_stop', e);
  });

  // run it!
  this.runner.start(commands, cb);
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
