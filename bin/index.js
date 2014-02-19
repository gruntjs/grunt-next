#!/usr/bin/env node

// make coffee-script configs available for testing
require('coffee-script/register');

const prettyTime = require('pretty-hrtime');
const chalk = require('chalk');
const Liftoff = require('liftoff');

const cli = new Liftoff({
  moduleName: 'gn',
  configName: 'Gruntfile',
  processTitle: 'grunt-next',
  cwdFlag: 'base'
}).on('require', function (name, module) {
  if (name === 'coffee-script') {
    module.register();
  }
}).on('requireFail', function (name, err) {
  console.log('Unable to load:', name, err);
});

cli.launch(function () {

  var argv = this.argv;
  var tasks = argv._;
  var commands = tasks.length ? tasks : ['default'];

  if (!this.configPath) {
    console.log('No Gruntfile found.');
    process.exit(1);
  }
  if (!this.modulePath) {
    console.log('No local installation of Grunt found.');
    process.exit(1);
  }

  var Grunt;
  // temporary hack to allow testing
  if (process.cwd() === '/Users/tkellen/Code/node/grunt-next') {
    Grunt = require(process.cwd());
  } else {
    Grunt = require(this.modulePath);
  }

  process.chdir(this.configBase);



  var grunt = new Grunt(this);

  // attach logging
  logEvents(grunt);

  require(this.configPath)(grunt);
  grunt.run(commands);
});


function formatError (e) {
  if (!e.err) return e.message;
  if (e.err.message) return e.err.message;
  return JSON.stringify(e.err);
}

function logEvents (emitter) {

  emitter.on('task_start', function (e) {
    console.log('Running', "'"+chalk.cyan(e.task)+"'...");
  });

  emitter.on('task_stop', function (e) {
    var time = prettyTime(e.hrDuration);
    console.log('Finished', "'"+chalk.cyan(e.task)+"'", 'in', chalk.magenta(time));
  });

  emitter.on('task_err', function (e) {
    var msg = formatError(e);
    var time = prettyTime(e.hrDuration);
    console.log('Errored', "'"+chalk.cyan(e.task)+"'", 'in', chalk.magenta(time), chalk.red(msg));
  });

  emitter.on('task_not_found', function (err) {
    console.log(chalk.red("Task '"+err.task+"' was not defined in your Gruntfile but you tried to run it."));
    console.log('Please check the documentation for proper Gruntfile formatting.');
    process.exit(1);
  });

};
