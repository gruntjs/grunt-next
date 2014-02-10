const parseArgs = require('../../lib/utils/parse_args');

describe('parseArgs', function () {

  it('should normalize method arguments to an array.', function () {
    var result;
    (function(){result=parseArgs(arguments);}('foo'));
    expect(result).to.deep.equal(['foo']);

    (function(){result=parseArgs(arguments);}('foo', 'bar', 'baz'));
    expect(result).to.deep.equal(['foo', 'bar', 'baz']);

    (function(){result=parseArgs(arguments);}(['foo', 'bar', 'baz']));
    expect(result).to.deep.equal(['foo', 'bar', 'baz']);
  });

});
