require('mocha');
global.expect = require('chai').expect;

describe('Core', function () {
  require('./find_tasks');
  require('./load_tasks');
  require('./parse_register');

  describe('Utils', function () {
    require('./utils/parse_args');
  });
});
