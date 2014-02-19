const getCommandTarget = require('../../runner/lib/get_command_target');

describe('getCommandTarget', function () {

  it('should extract the target from a grunt command', function () {
    expect(getCommandTarget('task:target')).to.equal('target');
  });

});
