const mocha = require('mocha');
const expect = require('chai').expect;
const loadTasks = require('../lib/load_tasks');

describe('loadTasks', function () {

  it('should take an array of module paths, require them, and inject grunt into each.', function () {
    var tasks = [
      __dirname+'/fixtures/tasks/one',
      __dirname+'/fixtures/tasks/two'
    ];
    var grunt = {loaded:0};
    loadTasks(tasks, grunt);
    expect(grunt.loaded).to.equal(2);
  });

});
