const path = require('path');
const loadTasks = require('./load_tasks');
const parseArgs = require('./utils/parse_args');

const loadNpmTasks = function () {
  var input = parseArgs(arguments);
  if(Array.isArray(input)) {
    module.forEach(loadNpmTasks, this);
  } else {
    loadTasks.call(this, path.join('node_modules', input, 'tasks'));
  }
  return this;
};

module.exports = loadNpmTasks;
