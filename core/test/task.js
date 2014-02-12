const mocha = require('mocha');
const expect = require('chai').expect;
var task = require('../lib/task');

describe('grunt.task', function () {

  describe('loadTasks', function () {

    it('should take an array of folders and load the tasks within to an internal registry.', function () {
      task.loadTasks([__dirname+'/fixtures/tasks']);
      // this is a bullshit assertion.  at some point it might be
      // nice to test this more thoroughly.
      expect(Object.keys(task.tasks)).to.have.length(2);
    });

  });

});
