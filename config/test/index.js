const test = require('tap').test;
const globulator = require('../');

test('globulator', function (t) {

  t.deepEqual(globulator({
    src: 'fixtures/*',
    dest: 'dest',
    options: {
      key: 'value'
    }
  }), [{
    src: ['fixtures/1.js',
          'fixtures/2.js',
          'fixtures/3.js',
          'fixtures/bar.txt',
          'fixtures/baz.txt',
          'fixtures/foo.txt'],
    dest: 'dest'
  }], 'creates a files object from a task declaration');

  t.end();
});
