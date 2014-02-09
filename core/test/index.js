require('mocha');
global.expect = require('chai').expect;

describe('Core', function () {
  require('./build_task');
  require('./init_config');
  require('./load_npm_tasks');
  require('./parse_task');
  require('./register');
  require('./register_multi_task');
  require('./register_task');

  describe('Utils', function () {
    require('./utils/parse_args');
  });
});
