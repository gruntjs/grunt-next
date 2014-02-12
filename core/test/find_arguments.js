const mocha = require('mocha');
const expect = require('chai').expect;
const findArguments = require('../lib/find_arguments');

describe('findArguments', function () {

  it('should extract arguments from a series of commands', function () {
    var tasks = {
      alias: {name:'alias',type:'alias'},
      single: {name:'single',type:'single'},
      multi: {name:'multi',type:'multi'}
    };
    var commands = [
      'alias:arg1:arg2',
      'single:arg1:arg2',
      'multi:target:arg1:arg2'
    ];
    var args = {
      'alias:arg1:arg2': [],
      'single:arg1:arg2': ['arg1', 'arg2'],
      'multi:target:arg1:arg2': ['arg1', 'arg2']
    };
    expect(findArguments(tasks, commands)).to.deep.equal(args);
  });

});
