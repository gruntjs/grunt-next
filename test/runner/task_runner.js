const mocha = require('mocha');
const expect = require('chai').expect;
const expander = require('expander');
const runner = require('../../runner');

var tasks = {
  task: {
    name: 'task',
    type: 'multi',
    fn: function() {
      var done = this.async();
      setTimeout(function() {
        done();
      }, 100);
    }
  },
  taskTwo: {name:'taskTwo',type:'single',fn:function(){console.log('taskTwo');}},
  taskThree: {name:'taskThree',type:'single',fn:function(){console.log('taskThree');}}
};

var configRaw = {
  task: {
    targetOne: {},
    targetTwo: {},
    targetThree: {}
  },
  taskTwo: {
    src: []
  },
  taskThree: {

  }
};
var config = expander.interface(configRaw);

describe('taskRunner', function () {

  /*it('should build a task registry', function (done) {
    var runner = taskRunner(config, tasks, ['task']);
    runner.start('task', function () {
      done();
    });
  });
*/

});
