module.exports = function (grunt) {
  grunt.initConfig({
    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      files: ['Gruntfile.coffee', 'lib/**/*.js']
    },
    nodeunit: {
      files: ['test/**/*']
    }
  });
  grunt.loadNpmTasks(['grunt-contrib-jshint', 'grunt-contrib-nodeunit']);
  grunt.registerTask('default', ['jshint', 'nodeunit']);
};
