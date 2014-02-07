const Adjunct = require('adjunct');
const expander = require('expander');

module.exports = function (data) {
  data = data||{};

  var config = new Adjunct(data, [
    require('./lib/template_expansion')
  ]);

  config.pipeline = new Adjunct(data, [
    require('./lib/template_expansion'),
    require('./lib/globbing')
  ]);

  // Expand a config value recursively. Used for post-processing raw values
  // already retrieved from the config.
  config.process = function (prop) {
    return expander.process(config.data, prop);
  };

  // Escape any . in name with \. so dot-based namespacing works properly.
  // TODO: upstream into getobject
  config.escape = function (str) {
    return str.replace(/\./g, '\\.');
  };

  // Return property as a string.
  // TODO: upstream into getobject
  config.getPropString = function (prop) {
    return Array.isArray(prop) ? prop.map(config.escape).join('.') : prop;
  };

  return config;
};
