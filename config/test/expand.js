const test = require('tap').test;
const expand = require('../lib/expand');

test('expand', function (t) {

  t.deepEqual(expand({src:'fixtures/*'}), {
    src: ['fixtures/1.js',
          'fixtures/2.js',
          'fixtures/3.js',
          'fixtures/bar.txt',
          'fixtures/baz.txt',
          'fixtures/foo.txt']
  });

  t.deepEqual(expand({src:'fixtures/*',dest:'dest'}), {
    src: ['fixtures/1.js',
          'fixtures/2.js',
          'fixtures/3.js',
          'fixtures/bar.txt',
          'fixtures/baz.txt',
          'fixtures/foo.txt'],
    dest: 'dest'
  });

  t.deepEqual(expand({src:'fixtures/*',dest:'dest/',expand:true}), [
    {src: ['fixtures/1.js'], dest: 'dest/fixtures/1.js'},
    {src: ['fixtures/2.js'], dest: 'dest/fixtures/2.js'},
    {src: ['fixtures/3.js'], dest: 'dest/fixtures/3.js'},
    {src: ['fixtures/bar.txt'], dest: 'dest/fixtures/bar.txt'},
    {src: ['fixtures/baz.txt'], dest: 'dest/fixtures/baz.txt'},
    {src: ['fixtures/foo.txt'], dest: 'dest/fixtures/foo.txt'}
  ]);

  t.end();
});
