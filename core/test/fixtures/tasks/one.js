module.exports = function (grunt) {
  grunt.loaded++;
  if(grunt.registerTask) {
    grunt.registerTask('one', 'task one', function () {
      console.log('running task one with context', this);
    });
  }
};
