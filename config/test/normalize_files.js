const test = require('tap').test;
const normalizeFiles = require('../lib/normalize_files');

test('normalize_files', function (t) {

  var input, expected;

  input = {
    src: ['src'],
    dest: 'dest',
    key: true
  };
  expected = [input];
  t.deepEqual(normalizeFiles(input), expected, 'should extract single src/dest form');

  input = {
    files: {
      destOne: ['src'],
      destTwo: ['src2']
    }
  };
  expected = [
    {src: ['src'], dest: 'destOne'},
    {src: ['src2'], dest: 'destTwo'}
  ];
  t.deepEqual(normalizeFiles(input), expected, 'should extract array files form');

  input = {
    files: {
      src: 'src',
      dest: 'dest'
    }
  };
  expected = [input.files];
  t.deepEqual(normalizeFiles(input), expected, 'should extract files object form');

  input = {
    files: [
      {src: 'src', dest: 'dest'}
    ]
  };
  expected = input.files;
  t.deepEqual(normalizeFiles(input), expected, 'should extract files array form');

  t.end();
});
