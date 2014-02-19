const getCommandTask = require('../../runner/lib/get_command_task');

describe('getCommandTask', function () {

  it('should extract the base task from a grunt command', function () {
    expect(getCommandTask('task:target')).to.equal('task');
  });

});
