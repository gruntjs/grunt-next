const findTasks = require('../lib/find_tasks');
const glob = require('glob');
const path = require('path');

describe('findTasks', function () {

  it('should take an array of folder names and find all task files within', function () {
    var taskFiles = findTasks(['fixtures/tasks']);
    var expectedTaskFiles = glob.sync('fixtures/tasks/*.js');
    expect(taskFiles).to.deep.equal(expectedTaskFiles);
  });

  it('should take an array of module names and find all task files within their locally installed node_module', function () {
    var taskFiles = findTasks(['grunt-contrib-jshint'], true);
    var expectedTaskFiles = [path.resolve(glob.sync('node_modules/grunt-contrib-jshint/tasks/*.js')[0])];
    expect(taskFiles).to.deep.equal(expectedTaskFiles);
  });

});
