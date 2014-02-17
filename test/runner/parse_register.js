const parseRegister = require('../../runner/lib/parse_register');

describe('parseRegister', function () {

  it('should support two arguments with a function', function () {
    var fn = function () {};
    var task = parseRegister(['test', fn], 'single');

    expect(task).to.deep.equal({
      name: 'test',
      desc: 'Custom Task',
      fn: fn,
      type: 'single'
    });
  });

  it('should support two arguments with a deps string', function () {
    var task = parseRegister(['test', 'default']);

    expect(task).to.deep.equal({
      name: 'test',
      desc: 'Alias for "default" task.',
      fn: ['default'],
      type: 'alias'
    });
  });

  it('should support two arguments with a deps array', function () {
    var task = parseRegister(['test', ['dep1', 'dep2']]);

    expect(task).to.deep.equal({
      name: 'test',
      desc: 'Alias for "dep1", "dep2" tasks.',
      fn: ['dep1', 'dep2'],
      type: 'alias'
    });
  });

  it('should support three arguments with a description', function () {
    var fn = function () {};
    var task = parseRegister(['test', 'test task', fn], 'single');

    expect(task).to.deep.equal({
      name: 'test',
      desc: 'test task',
      fn: fn,
      type: 'single'
    });
  });


});
