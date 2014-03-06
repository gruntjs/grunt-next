module.exports = function (grunt) {
  grunt.template = require('./lib/template');
  grunt.template.process = function (str) { return str };
  grunt.log = require('./lib/log');
  grunt.verbose = grunt.log.verbose;
  grunt.file = require('./lib/file');
  grunt.fail = require('./lib/fail');
  grunt.warn = grunt.log.warn;
  grunt.task = {};
  var taskMethods = ['register', 'registerTask', 'registerMultiTask',
                     'loadTasks', 'loadNpmTasks', 'renameTask'];
  taskMethods.forEach(function (method) {
    grunt.task[method] = grunt[method];
  });
  Object.defineProperty(grunt, 'util', {
    get: function () {
      console.log('Grunt util is deprecated.  Please see http://github.com/gruntjs/grunt-legacy-util for instructions.');
      return require('grunt-legacy-util');
    }
  });
  Object.defineProperty(grunt.task, 'current', {
    get: function () {
      console.log('grunt.task.current is only available from the grunt\n'+
                  'configuration.  If you are a task author trying to use\n'+
                  'this from within a task, you can access the same values\n'+
                  'from `this`.');
      return null;
    }
  });
};
