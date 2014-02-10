const expander = require('expander');
const mocha = require('mocha');
const Task = require('../')
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
    src: ['test/fixtures/*.js'],

    target: {
      src: ['test/fixtures/*.js'],
      options: {
        setting: false
      }
    }
  }
};
var config = expander.interface(rawConfig);

describe('Task', function () {

  beforeEach(function () {
    var task = Task.create({
      name: 'task.target',
      desc: 'testing',
      deps: null,
      fn: function () {
        console.log('hi');
      }
    });
    this.task = task;
    this.context = task.context(config);
  });

  describe('context(options)', function () {

    it('should create a context object with a provided config', function () {
      expect(this.context).to.be.an('object');
    });

    it('should have an "async" method', function () {
      expect(this.context.async).to.be.a('function');
    });

    describe('the provided async method', function () {
      it('should resolve the internal promise if called with no arguments', function (done) {
        var cb = this.context.async();
        this.context.deferred.promise.then(function () {
          done();
        });
        cb();
      });

      it('should reject the internal promise if called with no arguments', function (done) {
        var cb = this.context.async();
        this.context.deferred.promise.catch(function (e) {
          expect(e).to.equal('error');
          done();
        });
        cb('error');
      });
    });

    it('should have an "options" method', function () {
      expect(this.context.options).to.be.a('function');
    });

    describe('the provided options method', function () {
      it('should return the merged task options if no defaults are provided', function () {
        expect(this.context.options({})).to.deep.equal({
          global: true,
          setting: false,
          someKey: true
        });
      });

      it('should return the merged task options, with defaults supplied', function () {
        expect(this.context.options({defaultKey:true})).to.deep.equal({
          global: true,
          setting: false,
          someKey: true,
          defaultKey: true
        });
      });
    });

    it('should have a "files" property', function () {
      expect(this.context.files).to.exist;
    });

    describe('the provided files property', function () {
      it('should be an array', function () {
        expect(this.context.files).to.be.an('array');
      });

      it('should contain a list of src/dest pairs', function () {
        expect(this.context.files).to.deep.equal([
          { src: [ 'test/fixtures/bar.js',
                   'test/fixtures/baz.js',
                   'test/fixtures/foo.js' ] }
        ]);
      });
    });
  });
});
