module.exports = function (grunt) {
  const _ = require('lodash');
  const runner = require('./lib/runner.js')(grunt);

  grunt.registerMultiTask('watch', function() {
    var gaze = require('gaze');
    var name = this.name || 'watch';
    var files = this.data.files;
    var tasks = this.data.tasks;
    var target = this.target;
    var options = this.options({
      spawn: false,
      cliArgs: _.without.apply(null, [[].slice.call(process.argv, 2)].concat(grunt.env.argv._)),
      atBegin: false,
      interrupt: false,
      event: ['all'],
      cwd: grunt.env.cwd,
      livereload: false, // TODO: not yet implemented
    });

    // When files are changed, call the runner
    var changedFiles = Object.create(null);
    grunt.config([name, target, 'changed'].join('.'), []);
    var changed = _.debounce(function(tasks, options, cb) {
      grunt.config([name, target, 'changed'].join('.'), Object.keys(changedFiles));
      if (typeof tasks === 'function') {
        // If tasks is a custom function, run that instead
        var start = Date.now();
        tasks([name, target].join('.'), options, function() {
          cb(Date.now() - start);
        });
      } else {
        // Otherwise use the built in runner
        runner.run(tasks, options, cb);
      }
    }, 100);

    // Start up gaze on the file patterns
    function start() {
      gaze(files, function () {
        grunt.log.writeln('Watching ' + target + '...');
        this.on('all', function(event, filepath) {

          // Skip events not specified
          if (!_.contains(options.event, 'all') && !_.contains(options.event, event)) {
            return;
          }

          // Track changed files and notify changed has occurred
          changedFiles[filepath] = event;
          changed(tasks, options, function(time) {
            grunt.log.writeln('Completed "' + target + '" tasks in ' + (time || 0 / 1000) + ' s. Waiting...');
            changedFiles = Object.create(null);
          });
        });
      });
    }

    // If we want to run tasks at the beginning
    if (options.atBegin) {
      grunt.log.writeln('Running "' + target + '" at beginning...');
      changed(tasks, options, start);
    } else {
      start();
    }
  });
};

// TODO: doesnt yet use mtime for traversing file dependencies for changed files
// TODO: fix formatting on completed time displayed
// TODO: no options.dateFormat implementation
// TODO: no advanced options.cwd implementation
// TODO: no livereload (does it still belong in the watch? - shama)
// TODO: no watch event (I want to nix it - shama)
