const getTaskTargets = require('../../runner/lib/get_task_targets');

describe('getTaskTargets', function () {

  it('should extract valid targets from a task config', function () {
    var config = {
      options: {},
      targetOne: ['test/fixtures/files/*.js'],
      targetTwo: {
        src: ['test/fixtures/files/*.js']
      }
    };
    expect(getTaskTargets(config, 'task')).to.deep.equal(['task:targetOne','task:targetTwo']);
  });

});
