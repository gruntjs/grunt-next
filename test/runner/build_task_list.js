const buildTaskList = require('../../runner/lib/build_task_list');
const expander = require('expander');
const Task = require('../../task');

describe('buildTaskList', function () {

  it('should convert an indexed set of commands to a hash for use by orchestrator', function () {

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
      })
    };

    var indexedCommands = {
      multi: ['multi:target', 'multi:targetTwo'],
      single: ['single:arg', 'single']
    };
    var taskList = buildTaskList(config, tasks, indexedCommands);
    expect(taskList).to.have.length(4);
  });

});
