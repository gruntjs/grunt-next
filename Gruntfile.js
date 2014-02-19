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
  grunt.registerTask('series0', function () {
    var done = this.async();
    setTimeout(function () {
      console.log('series0');
      done();
    }, 1000);
  });
  grunt.registerTask('series1', function () {
    var done = this.async();
    setTimeout(function () {
      console.log('series1');
      done();
    }, 400);
  });
  grunt.registerTask('series2', function () {
    console.log('series2');
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.registerTask('nestedAlias', 'jshint')
  grunt.registerTask('default', ['nestedAlias', 'series0']);
  grunt.registerTask('series', ['series0', 'series1', 'series2']);
};
