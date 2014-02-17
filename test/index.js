require('mocha');
global.expect = require('chai').expect;

describe('Runner', function () {
  require('./runner/build_runner');
  require('./runner/build_task_entries');
  require('./runner/find_targets');
  require('./runner/find_tasks');
  require('./runner/index_commands');
  require('./runner/load_tasks');
  require('./runner/parse_register');
});

describe('Task', function () {
  require('./task/build_context');
  require('./task/build_method');
});

