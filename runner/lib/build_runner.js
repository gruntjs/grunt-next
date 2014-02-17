const Orchestrator = require('orchestrator');
const logEvents = require('./log_events');

module.exports = function (tasks) {
  var runner = new Orchestrator();
  tasks.forEach(function (task) {
    if (task.name && task.method) {
      runner.add(task.name, task.method);
    }
  });
  logEvents(runner);
  return runner;
};
