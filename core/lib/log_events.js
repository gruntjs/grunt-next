const prettyTime = require('pretty-hrtime');
const chalk = require('chalk');

function formatError (e) {
  if (!e.err) return e.message;
  if (e.err.message) return e.err.message;
  return JSON.stringify(e.err);
}

module.exports = function (emitter) {

  emitter.on('task_start', function(e){
    console.log('Running', "'"+chalk.cyan(e.task)+"'...");
  });

  emitter.on('task_stop', function(e){
    var time = prettyTime(e.hrDuration);
    console.log('Finished', "'"+chalk.cyan(e.task)+"'", 'in', chalk.magenta(time));
  });

  emitter.on('task_err', function(e){
    var msg = formatError(e);
    var time = prettyTime(e.hrDuration);
    console.log('Errored', "'"+chalk.cyan(e.task)+"'", 'in', chalk.magenta(time), chalk.red(msg));
  });

  emitter.on('task_not_found', function(err){
    console.log(chalk.red("Task '"+err.task+"' was not defined in your Gruntfile but you tried to run it."));
    console.log('Please check the documentation for proper Gruntfile formatting.');
    process.exit(1);
  });

};
