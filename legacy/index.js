module.exports = function (grunt) {
  grunt.template = require('./lib/template');
  grunt.template.process = function (str) { return grunt.config.process(str); };
  grunt.util = require('./lib/util');
  grunt.option = function (name) { return this.env.argv[name]; };
  grunt.log = require('./lib/log');
  grunt.verbose = grunt.log.verbose;
  grunt.file = require('./lib/file');
  grunt.fail = require('./lib/fail');
  grunt.warn = grunt.log.warn;
  grunt.task = {};
};
