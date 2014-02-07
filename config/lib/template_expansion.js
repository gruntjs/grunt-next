const expander = require('expander');

module.exports = function (input, data) {
  return expander.process(data, input);
};
