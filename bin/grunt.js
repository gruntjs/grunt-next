#!/usr/bin/env node

const Liftoff = require('liftoff');
const logEvents = require('../runner/lib/log_events');

const GruntCLI = new Liftoff({
  name: 'grunt',
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
