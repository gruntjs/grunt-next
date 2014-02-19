const Task = require('../../task');
const expander = require('expander');
const parseCommands = require('../../runner/lib/parse_commands');

describe('parseCommands', function () {

  var rawConfig = {
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
  };
  var config = expander.interface(rawConfig);

  var taskRegistry = {
    single: new Task({
      name: 'single',
      desc: 'Fake single task.',
      type: 'single',
      fn: function () {}
    }),
    multi: new Task({
      name: 'multi',
      desc: 'Fake multi task.',
      type: 'multi',
      fn: function () {}
    }),
    alias: new Task({
      name: 'alias',
      desc: 'Fake alias task.',
      type: 'alias',
      fn: ['multi:targetTwo']
    }),
    nested_alias: new Task({
      name: 'nested_alias',
      desc: 'Fake nested alias task.',
      type: 'alias',
      fn: ['alias']
    })
  };

  var commands = ['single', 'multi', 'nested_alias', 'bad', 'multi:noTarget'];
  var expandedCommands = ['single','multi','multi:targetTwo'];

  it('should validate commands: expand aliases / remove invalid requests', function () {
    var tasks = parseCommands(config, taskRegistry, commands);
    expect(tasks).to.deep.equal(expandedCommands);
  });

});
