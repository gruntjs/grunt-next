module.exports = function (grunt) {
  grunt.initConfig({
    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      target1: ['lib/**/*.js'],
      target2: ['test/**/*.js'],
      target3: ['Gruntnextfile.js']
    },
  });
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.registerTask('default', 'jshint');
};
