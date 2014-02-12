const mocha = require('mocha');
const expect = require('chai').expect;
const orchestrate = require('../lib/orchestrate');

var tasks = {
  task: {name:'task',type:'multi',fn:function(){console.log('task',this);}},
  taskTwo: {name:'taskTwo',type:'single',fn:function(){console.log('taskTwo');}},
  taskThree: {name:'taskThree',type:'single',fn:function(){console.log('taskThree');}}
};

var config = {
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

describe('buildRunner', function () {

  it('should build a task registry', function () {
    var runner = orchestrate(config, tasks, ['taskTwo']);
    runner.start('taskTwo');
  });

});
