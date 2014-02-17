const indexCommands = require('../../runner/lib/index_commands');

describe('indexCommands', function () {

  it('index commands by their root task name', function () {
    var commands = [
      'single:arg1:arg2',
      'multi',
      'multi:target:arg1:arg2',
      'multi:target:arg1',
      'alias:arg1:arg2'
    ];
    var result = {
      single: ['single:arg1:arg2'],
      multi: ['multi','multi:target:arg1:arg2','multi:target:arg1'],
      alias: ['alias:arg1:arg2']
    };
    expect(indexCommands(commands)).to.deep.equal(result);
  });

});
