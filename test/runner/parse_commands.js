const Task = require('../../task');
const expander = require('expander');
const parseCommands = require('../../runner/lib/parse_commands');

describe('parseCommands', function () {

  var config = expander.interface({
    single: {
      src: ['text/fixtures/files/*.js']
    },
    multi: {
      options: {},
      target: ['test/fixtures/files/*.js'],
      targetTwo: {
        src: ['test/fixtures/files/*.js']
      }
    }
  });

  var tasks = {
    single: new Task({
      name: 'single',
      desc: 'Single task.',
      type: 'single',
      fn: function () {}
    }),
    multi: new Task({
      name: 'multi',
      desc: 'Multi task.',
      type: 'multi',
      fn: function () {}
    }),
    alias: new Task({
      name: 'alias',
      desc: 'Alias task.',
      type: 'alias',
      fn: ['multi:targetTwo']
    }),
    nested_alias: new Task({
      name: 'nested_alias',
      desc: 'Nested alias task.',
      type: 'alias',
      fn: ['alias']
    }),
    multi_alias: new Task({
      name: 'multi_alias',
      desc: 'Alias task to multi task.',
      type: 'alias',
      fn: ['multi']
    })
  };

  it('should remove invalid task requests', function () {
    var commands = parseCommands(config, tasks, ['empty']);
    expect(commands).to.deep.equal([]);

    commands = parseCommands(config, tasks, ['invalid_alias']);
    expect(commands).to.deep.equal([]);
  });

  it('should expand multi task commands without targets', function () {
    var commands = parseCommands(config, tasks, ['multi']);
    expect(commands).to.deep.equal(['multi:target','multi:targetTwo']);

    commands = parseCommands(config, tasks, ['multi_alias']);
    expect(commands).to.deep.equal(['multi:target','multi:targetTwo']);
  });

  it('should recursively resolve aliases', function () {
    var commands = parseCommands(config, tasks, ['nested_alias']);
    expect(commands).to.deep.equal(['multi:targetTwo']);
  });

});
