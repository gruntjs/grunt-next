const mocha = require('mocha');
const expect = require('chai').expect;
const buildContext = require('../../task/lib/build_context');

var methodSuccess = function () {
  var done = this.async();
  done();
}

var methodError = function () {
  var done = this.async();
  done(false);
};

describe('Task', function () {



});
