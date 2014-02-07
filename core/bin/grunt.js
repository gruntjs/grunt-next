#!/usr/bin/env node
'use strict';
var Liftoff = require('liftoff');
var prettyTime = require('pretty-hrtime');
var chalk = require('chalk');

var GruntCLI = new Liftoff({
  name: 'gruntnext',
  cwdFlag: 'base'
}).on('require', function (name, module) {
  if (name === 'coffee-script') {
    module.register();
  }
}).on('requireFail', function (name, err) {
  console.log('Unable to load:', name, err);
});

GruntCLI.launch(function () {
  var argv = this.argv;
  var tasks = argv._;
  var toRun = tasks.length ? tasks : [];

  if(!this.configPath) {
    console.log('No Gruntfile found.');
    process.exit(1);
  }
  if(!this.modulePath) {
    console.log('No local installation of Grunt found.');
    process.exit(1);
  }

  process.chdir(this.configBase);
  var Grunt = require(this.modulePath);
  var grunt = new Grunt(this);
  // attach logging
  logEvents(grunt);

  require(this.configPath)(grunt);
  grunt.start.apply(grunt, toRun);
});

function formatError (e) {
  if (!e.err) return e.message;
  if (e.err.message) return e.err.message;
  return JSON.stringify(e.err);
}

function logEvents (emitter) {

  emitter.on('task_start', function(e){
    console.log('Running', "'"+chalk.cyan(e.task)+"'...");
  });

  emitter.on('task_stop', function(e){
    var time = prettyTime(e.hrDuration);
    console.log('Finished', "'"+chalk.cyan(e.task)+"'", 'in', chalk.magenta(time));
  });

  emitter.on('task_err', function(e){
    var msg = formatError(e);
    var time = prettyTime(e.hrDuration);
    console.log('Errored', "'"+chalk.cyan(e.task)+"'", 'in', chalk.magenta(time), chalk.red(msg));
  });

  emitter.on('task_not_found', function(err){
    console.log(chalk.red("Task '"+err.task+"' was not defined in your Gruntfile but you tried to run it."));
    console.log('Please check the documentation for proper Gruntfile formatting.');
    process.exit(1);
  });

}
