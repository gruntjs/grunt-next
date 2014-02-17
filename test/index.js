require('mocha');
global.expect = require('chai').expect;

describe('Runner', function () {
  require('./runner/build_runner');
  require('./runner/build_tasks');
  require('./runner/find_targets');
  require('./runner/find_task_files');
  require('./runner/index_commands');
  require('./runner/load_task_files');
  require('./runner/parse_register');
  require('./runner/request_tasks');
});

describe('Task', function () {
  require('./task/build_context');
  require('./task/build_method');
});

