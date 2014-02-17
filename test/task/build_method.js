const buildMethod = require('../../task/lib/build_method');
const Promise = require('bluebird');

describe('buildMethod', function () {

  it('should return a function that will call the supplied method with a provided context', function (done) {
    var context = {property:true};
    var method = buildMethod(function () {
      expect(this).to.deep.equal(context);
      done();
    }, context);
    method();
  });

  it('should expose the provided context as a property of the generated method', function () {
    var context = {property:true};
    var method = buildMethod(function () {}, context);
    expect(method.context).to.deep.equal(context);
  });

  it('if the provided method does not create an internal promise, the generated method should return sync', function () {
    var method = buildMethod(function () {
      return "sync";
    }, {});
    expect(method()).to.equal("sync");
  });

  it('if the provided method internally creates a promise, the generated method return it', function (done) {
    var method = buildMethod(function () {
      var deferred = Promise.defer();
      deferred.resolve("async");
      this.deferred = deferred;
      return deferred.promise;
    }, {});
    method().then(function (val) {
      expect(val).to.equal("async");
      done();
    });
  });

});
