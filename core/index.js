const util = require('util');
const Orchestrator = require('orchestrator');

function Grunt (env) {
  this.env = env;
  this.taskMeta = {};
  Orchestrator.call(this);
}
util.inherits(Grunt, Orchestrator);

Grunt.prototype.util = {};
Grunt.prototype.util._ = require('lodash');
Grunt.prototype.initConfig = require('./lib/init_config');
Grunt.prototype.loadTasks = require('./lib/load_tasks');
Grunt.prototype.loadNpmTasks = require('./lib/load_npm_tasks');
Grunt.prototype.registerTask = require('./lib/register_task');
Grunt.prototype.registerMultiTask = require('./lib/register_multi_task');
Grunt.prototype.option = function (name) { return this.env[name]; };

Grunt.prototype.log = require('../legacy/lib/grunt').log;
Grunt.prototype.file = require('../legacy/lib/grunt').file;
Grunt.prototype.warn = require('../legacy/lib/grunt').warn;
Grunt.prototype.verbose = require('../legacy/lib/grunt').verbose;
Grunt.prototype.fail = require('../legacy/lib/grunt').fail;


module.exports = Grunt;
