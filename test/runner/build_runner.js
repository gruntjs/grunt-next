/*jshint expr: true*/

var buildRunner = require('../../runner/lib/build_runner');
var Orchestrator = require('orchestrator');

describe('buildRunner', function () {

  it('should return an orchestrator instance', function () {
    expect(buildRunner([])).to.be.an.instanceOf(Orchestrator);
  });

  it('should load provided tasks into orchestrator', function () {
    var tasks = [
      { name: 'one', method: function() {} },
      { name: 'two', method: function() {} },
      { name: 'three', method: ['one, two'] }
    ];
    var runner = buildRunner(tasks);
    expect(runner.hasTask(tasks[0].name)).to.be.true;
    expect(runner.hasTask(tasks[1].name)).to.be.true;
    expect(runner.hasTask(tasks[2].name)).to.be.true;
  });

});
