const path = require('path');
const loadTasks = require('./load_tasks');

const loadNpmTasks = function (module) {
  if(Array.isArray(module)) {
    module.forEach(loadNpmTasks, this);
  } else {
    loadTasks.call(this, path.join('node_modules', module, 'tasks'));
  }
  return this;
};

module.exports = loadNpmTasks;
