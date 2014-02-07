const configfiles = require('configfiles');

module.exports = function (input) {
  input.files = configfiles(input);
  return input;
};
