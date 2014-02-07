var grunt = {};
var GruntConfig = require('../');
grunt.config = new GruntConfig({});

exports['config'] = {
  setUp: function(done) {
    grunt.config.data = {
      meta: {
        foo: "bar",
        baz: [1, 2, 3]
      },
      foo: '<%= meta.foo %>',
      foo2: '<%= foo %>',
      obj: {
        foo: '<%= meta.foo %>',
        foo2: '<%= obj.foo %>',
        Arr: ['foo', '<%= obj.foo2 %>'],
        arr2: ['<%= arr %>', '<%= obj.Arr %>'],
      },
      bar: 'bar',
      arr: ['foo', '<%= obj.foo2 %>'],
      arr2: ['<%= arr %>', '<%= obj.Arr %>'],
    };
    done();
  },
  tearDown: function(done) {
    grunt.config.data = this.origData;
    done();
  },
  'config.escape': function(test) {
    test.expect(2);
    test.equal(grunt.config.escape('foo'), 'foo', 'Should do nothing if no . chars.');
    test.equal(grunt.config.escape('foo.bar.baz'), 'foo\\.bar\\.baz', 'Should escape all . chars.');
    test.done();
  },
  'config.getPropString': function(test) {
    test.expect(4);
    test.equal(grunt.config.getPropString('foo'), 'foo', 'Should do nothing if already a string.');
    test.equal(grunt.config.getPropString('foo.bar.baz'), 'foo.bar.baz', 'Should do nothing if already a string.');
    test.equal(grunt.config.getPropString(['foo', 'bar']), 'foo.bar', 'Should join parts into a dot-delimited string.');
    test.equal(grunt.config.getPropString(['foo.bar', 'baz.qux.zip']), 'foo\\.bar.baz\\.qux\\.zip', 'Should join parts into a dot-delimited string, escaping . chars in parts.');
    test.done();
  },
  'config.getRaw': function(test) {
    test.expect(4);
    test.equal(grunt.config.getRaw('foo'), '<%= meta.foo %>', 'Should not process templates.');
    test.equal(grunt.config.getRaw('obj.foo2'), '<%= obj.foo %>', 'Should not process templates.');
    test.equal(grunt.config.getRaw(['obj', 'foo2']), '<%= obj.foo %>', 'Should not process templates.');
    test.deepEqual(grunt.config.getRaw('arr'), ['foo', '<%= obj.foo2 %>'], 'Should not process templates.');
    test.done();
  },
  'config.process': function(test) {
    test.expect(5);
    test.equal(grunt.config.process('<%= meta.foo %>'), 'bar', 'Should process templates.');
    test.equal(grunt.config.process('<%= foo %>'), 'bar', 'Should process templates recursively.');
    test.equal(grunt.config.process('<%= obj.foo %>'), 'bar', 'Should process deeply nested templates recursively.');
    test.deepEqual(grunt.config.process(['foo', '<%= obj.foo2 %>']), ['foo', 'bar'], 'Should process templates in arrays.');
    test.deepEqual(grunt.config.process(['<%= arr %>', '<%= obj.Arr %>']), [['foo', 'bar'], ['foo', 'bar']], 'Should expand <%= arr %> and <%= obj.Arr %> values as objects if possible.');
    test.done();
  },
  'config.get': function(test) {
    test.expect(8);
    test.equal(grunt.config.get('foo'), 'bar', 'Should process templates.');
    test.equal(grunt.config.get('foo2'), 'bar', 'Should process templates recursively.');
    test.equal(grunt.config.get('obj.foo2'), 'bar', 'Should process deeply nested templates recursively.');
    test.equal(grunt.config.get(['obj', 'foo2']), 'bar', 'Should process deeply nested templates recursively.');
    test.deepEqual(grunt.config.get('arr'), ['foo', 'bar'], 'Should process templates in arrays.');
    test.deepEqual(grunt.config.get('obj.Arr'), ['foo', 'bar'], 'Should process templates in arrays.');
    test.deepEqual(grunt.config.get('arr2'), [['foo', 'bar'], ['foo', 'bar']], 'Should expand <%= arr %> and <%= obj.Arr %> values as objects if possible.');
    test.deepEqual(grunt.config.get(['obj', 'arr2']), [['foo', 'bar'], ['foo', 'bar']], 'Should expand <%= arr %> and <%= obj.Arr %> values as objects if possible.');
    test.done();
  },
  'config.set': function(test) {
    test.expect(2);
    grunt.config.set('foo3', '<%= foo2 %>')
    grunt.config.set('a.b.c', '<%= foo2 %>')

    test.equal(grunt.config.data.foo3, '<%= foo2 %>', 'Should set values.');
    test.equal(grunt.config.data.a.b.c, '<%= foo2 %>', 'Should create interim objects.');
    test.done();
  },
  'config': function(test) {
    test.expect(6);
    test.equal(grunt.config('foo'), 'bar', 'Should retrieve processed data.');
    test.equal(grunt.config('obj.foo2'), 'bar', 'Should retrieve processed data.');
    test.equal(grunt.config(['obj', 'foo2']), 'bar', 'Should retrieve processed data.');
    test.deepEqual(grunt.config('arr'), ['foo', 'bar'], 'Should process templates in arrays.');

    grunt.config('foo3', '<%= foo2 %>');
    grunt.config('a.b.c', '<%= foo2 %>');
    test.equal(grunt.config.data.foo3, '<%= foo2 %>', 'Should have set the value.');
    test.equal(grunt.config.data.a.b.c, '<%= foo2 %>', 'Should have set the value.');
    test.done();
  }
};
