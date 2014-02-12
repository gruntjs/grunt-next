const mocha = require('mocha');
const expect = require('chai').expect;
const parseRegister = require('../lib/parse_register');

describe('parseRegister', function () {

  it('should support two arguments with a function', function () {
    var noop = function () {};
    var task = parseRegister(['test', noop]);

    expect(task).to.deep.equal({
      name: 'test',
      desc: 'Custom Task',
      fn: noop,
      deps: null
    });
  });

  it('should support two arguments with a deps string', function () {
    var task = parseRegister(['test', 'default']);

    expect(task).to.deep.equal({
      name: 'test',
      desc: 'Alias for "default" task.',
      fn: null,
      deps: ['default']
    });
  });

  it('should support two arguments with a deps array', function () {
    var task = parseRegister(['test', ['dep1', 'dep2']]);

    expect(task).to.deep.equal({
      name: 'test',
      desc: 'Alias for "dep1", "dep2" tasks.',
      fn: null,
      deps: ['dep1', 'dep2']
    });
  });

  it('should support three arguments with a description', function () {
    var noop = function () {};
    var task = parseRegister(['test', 'test task', noop]);

    expect(task).to.deep.equal({
      name: 'test',
      desc: 'test task',
      fn: noop,
      deps: null
    });
  });


});
