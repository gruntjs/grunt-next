module.exports = function (grunt) {
  grunt.initConfig({
    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      runner: ['runner/**/*.js'],
      task: ['task/**/*.js'],
      tests: ['test/**/*.js']
    },
  });
  grunt.registerTask('test', function () {
    console.log(this);
  });
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.registerTask('nestedAlias', 'jshint')
  grunt.registerTask('default', 'nestedAlias');

};
