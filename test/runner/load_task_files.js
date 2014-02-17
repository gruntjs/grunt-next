const loadTaskFiles = require('../../runner/lib/load_task_files');

describe('loadTaskFiles', function () {

  it('should take an array of module paths, require them, and inject grunt into each.', function () {
    var tasks = [
      __dirname+'/../fixtures/tasks/one',
      __dirname+'/../fixtures/tasks/two'
    ];
    var grunt = {loaded:0};
    loadTaskFiles(tasks, grunt);
    expect(grunt.loaded).to.equal(2);
  });

});
