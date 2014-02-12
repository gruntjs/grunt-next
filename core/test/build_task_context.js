const expander = require('expander');
const mocha = require('mocha');
const buildTaskContext = require('../lib/build_task_context');
global.expect = require('chai').expect;

var rawConfig = {
  options: {
    global: true
  },
  task: {
    options: {
      setting: true,
      someKey: true
    },
    src: ['test/fixtures/files/*.js'],

    target: {
      src: ['test/fixtures/files/*.js'],
      options: {
        setting: false
      }
    }
  }
};

var config = expander.interface(rawConfig);
var task = {
  name: 'task',
  desc: 'testing',
  deps: null,
  fn: function () {
    console.log('hi');
  }
};
var context = buildTaskContext(config, task, 'target');

describe('Task Context', function () {

  describe('async', function () {
    it('should be a function', function () {
      expect(context.async).to.be.a('function');
    });

    it('should resolve an internal promise if called with no arguments', function (done) {
      var cb = context.async();
      context.deferred.promise.then(function () {
        done();
      });
      cb();
    });

    it('should reject the internal promise if called with no arguments', function (done) {
      var cb = context.async();
      context.deferred.promise.catch(function (e) {
        expect(e).to.equal('error');
        done();
      });
      cb('error');
    });
  });

  describe('options', function () {
    it('should be a function', function () {
      expect(context.options).to.be.a('function');
    });

    it('should return the merged task options if no defaults are provided', function () {
      expect(context.options({})).to.deep.equal({
        global: true,
        setting: false,
        someKey: true
      });
    });

    it('should return the merged task options, with defaults supplied', function () {
      expect(context.options({defaultKey:true})).to.deep.equal({
        global: true,
        setting: false,
        someKey: true,
        defaultKey: true
      });
    });
  });

  describe('files', function () {

    it('should contain an array src/dest pairs', function () {
      expect(context.files).to.deep.equal([
        { src: ['test/fixtures/files/bar.js',
                'test/fixtures/files/baz.js',
                'test/fixtures/files/foo.js'] }
      ]);
    });

  });

  describe('filesSrc', function () {

    it('should contain an array of sources', function () {
      expect(context.filesSrc).to.deep.equal([
        'test/fixtures/files/bar.js',
        'test/fixtures/files/baz.js',
        'test/fixtures/files/foo.js'
      ]);
    });

  });
});
