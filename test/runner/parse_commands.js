const mocha = require('mocha');
const expect = require('chai').expect;
const parseCommands = require('../../runner/lib/parse_commands');

describe('parseCommands', function () {

  it('should extract all permutations for each task', function () {
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
    expect(parseCommands(commands)).to.deep.equal(result);
  });

});
