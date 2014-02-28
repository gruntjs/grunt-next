#!/usr/bin/env node

// temporarily make coffee-script configs work automatically
require('coffee-script/register');

const prettyTime = require('pretty-hrtime');
const chalk = require('chalk');
const Liftoff = require('liftoff');

const cli = new Liftoff({
  moduleName: 'grunt-next',
  configName: 'Gruntfile',
  processTitle: 'grunt-next',
  cwdFlag: 'base',
  searchHome: true
})

cli.on('require', function (name, module) {
  if (name === 'coffee-script') {
    module.register();
  }
  console.log('Requiring external module:', name);
});

cli.on('requireFail', function (name, err) {
  console.log('Unable to require external module:', name, err);
});

cli.launch(handler);

function handler (env) {
  var argv = env.argv;
  var tasks = argv._;
  var commands = tasks.length ? tasks : ['default'];

  if (!env.configPath) {
    console.log('No Gruntfile found.');
    process.exit(1);
  }
  if (!env.modulePath) {
    console.log('No local installation of grunt-next found.');
    process.exit(1);
  }

  var Grunt = require(env.modulePath);
  if(process.cwd != env.cwd) {
    process.chdir(env.cwd);
  }

  var grunt = new Grunt(env);
  logEvents(grunt);

  if (grunt.option('debug')) {
    grunt.on('run.*', function (msg) {
      console.log(this.event, msg);
    });
    grunt.on('register', function (msg) {
      console.log(this.event, msg);
    });
  }

  require(env.configPath)(grunt);
  grunt.run(commands);
};

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
  emitter.on('task_not_found', function (err) {
    console.log(chalk.red("Task '"+err.task+"' was not defined in your Gruntfile but you tried to run it."));
    console.log('Please check the documentation for proper Gruntfile formatting.');
    process.exit(1);
  });

};
