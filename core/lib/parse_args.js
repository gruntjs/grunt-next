module.exports = function (args) {
  return Array.isArray(args[0]) ? args[0] : [].slice.call(args);
};
