module.exports = function (grunt) {
  grunt.loaded++;
  if (grunt.registerMultiTask) {
    grunt.registerMultiTask('two', 'task two', function () {
      console.log('running task two with context', this);
    });
  }
};
