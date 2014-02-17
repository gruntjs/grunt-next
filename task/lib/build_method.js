// Return a grunt task function that is compatible with Orchestrator.

module.exports = function (method, context) {
  context = context||{};

  return function () {
    // clear promise for each run.
    context.deferred = false;

    // Execute task method from registerTask or registerMultiTask.
    var ret = method.call(context);

    // If a task calls `this.async()`, it will create a promise on
    // the deferred property of its context and return a "callback"
    // method that resolves or rejects it.
    //
    // If a task is flagged as being async in this manner, the promise
    // will be returned.  Tasks which are not flagged async in this
    // manner will return sync.
    //
    // Conditionally returning a promise in this manner is a very bad
    // practice but we need a way to properly hint to Orchestrator when
    // an async task is complete.  Typically this is performed by taking
    // in a callback, but we can't do that for historical reasons--there
    // are several thousand grunt plugins in the wild.
    //
    // This hack is the solution.
    if (!context.deferred) {
      return ret;
    } else {
      return context.deferred.promise;
    }
  };
};
