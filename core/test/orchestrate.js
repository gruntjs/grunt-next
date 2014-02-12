const mocha = require('mocha');
const expect = require('chai').expect;
const expander = require('expander');
const orchestrate = require('../lib/orchestrate');

var tasks = {
  task: {name:'task',type:'multi',fn:function(){console.log('task',this);}},
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

describe('buildRunner', function () {

  it('should build a task registry', function () {
    var runner = orchestrate(config, tasks, ['task']);
    runner.start('task');
  });

});
