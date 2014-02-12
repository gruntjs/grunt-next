#!/usr/bin/env node

const Liftoff = require('liftoff');
const logEvents = require('../lib/log_events');

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
  grunt.run(toRun);
});
