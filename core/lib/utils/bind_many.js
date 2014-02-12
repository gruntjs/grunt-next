module.exports = function (object, methods, context) {
  if (!context) {
    context = object;
  }
  methods.forEach(function (method) {
    object[method] = object[method].bind(context);
  });
};
