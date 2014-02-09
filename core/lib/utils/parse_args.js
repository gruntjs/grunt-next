// Argument parsing helper. Supports these signatures:
//  fn('foo')                 // ['foo']
//  fn('foo', 'bar', 'baz')   // ['foo', 'bar', 'baz']
//  fn(['foo', 'bar', 'baz']) // ['foo', 'bar', 'baz']

module.exports = function (args) {
  return Array.isArray(args[0]) ? args[0] : [].slice.call(args);
};
