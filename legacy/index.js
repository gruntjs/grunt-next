module.exports = function (grunt) {
  grunt.template = require('./lib/template');
  grunt.template.process = function (str) { return str };
  grunt.util = require('./lib/util');
  grunt.log = require('./lib/log');
  grunt.verbose = grunt.log.verbose;
  grunt.file = require('./lib/file');
  grunt.fail = require('./lib/fail');
  grunt.warn = grunt.log.warn;
  grunt.task = {};
};
