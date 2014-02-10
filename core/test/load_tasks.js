const loadTasks = require('../lib/load_tasks');

describe('loadTasks', function () {

  it('should take an array of module paths, require them, and inject grunt into each.', function () {
    var tasks = [
      __dirname+'/fixtures/task_one',
      __dirname+'/fixtures/task_two'
    ];
    var grunt = {loaded:0};
    loadTasks(tasks, grunt);
    expect(grunt.loaded).to.equal(2);
  });

});
