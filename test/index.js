global.expect = require('chai').expect;

describe('Runner', function () {
  require('./runner/build_task_list');
  require('./runner/find_task_files');
  require('./runner/get_command_target');
  require('./runner/get_command_task');
  require('./runner/get_task_targets');
  require('./runner/index_commands');
  require('./runner/load_task_files');
  require('./runner/parse_commands');
  require('./runner/parse_register');
});
/*
describe('Task', function () {
  require('./task/build_context');
  require('./task/build_method');
  require('./task/command_data');
});
*/
