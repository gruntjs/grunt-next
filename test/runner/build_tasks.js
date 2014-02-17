const Task = require('../../task');
const buildTasks = require('../../runner/lib/build_tasks');

describe('buildTasks', function () {
  /*
  var singleTask = new Task({
    name: 'single',
    desc: 'Fake single task.',
    type: 'single',
    fn: function () {}
  });
*/
  var multiTask = new Task({
    name: 'multi',
    desc: 'Fake multi task.',
    type: 'multi',
    fn: function () {}
  });

  var config = {
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
  it('should generate a task for each multi-task target, and an alias to run them all if no target is supplied', function () {
    var tasks = buildTasks(multiTask, config.multi, ['multi']);
    expect(tasks).length.to.be(3);
  });

});
