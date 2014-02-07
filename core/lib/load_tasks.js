const fs = require('fs');
const path = require('path');

const loadTasks = function (dir) {
  if(Array.isArray(dir)) {
    return dir.map(loadTasks);
  } else {
    if(fs.existsSync(dir)) {
      fs.readdirSync(dir).forEach(function (task) {
        var taskPath = path.resolve(dir, task);
        if(!fs.lstatSync(taskPath).isDirectory()) {
          require(taskPath)(this);
        }
      }, this);
    }
  }
  return this;
};

module.exports = loadTasks;
