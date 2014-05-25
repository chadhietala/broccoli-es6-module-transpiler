var fs = require('fs');
var path = require('path');
var broccoli = require('broccoli');
var expect = require('expect.js');
var transpile = require('..');


describe('broccoli-es6-module-transpiler', function() {
  function getSourcePath(testName) {
    return path.join('tests/fixtures', testName, 'source');
  }

  function readTranspiled(directory, relativePath) {
    var filePath = path.join(directory, relativePath || "");
    return fs.readFileSync(filePath, {encoding: 'utf8'});
  }

  function readExpected(testName, relativePath) {
    var filePath = path.join('tests/fixtures', testName, 'expected', relativePath || "");
    return fs.readFileSync(filePath, {encoding: 'utf8'});
  }

  var builder;

  afterEach(function() {
    if (builder) {
      builder.cleanup();
    }
  });

  describe('transpiling named AMD', function() {
    it('should name modules automatically when `moduleName: true`', function() {
      var testName = 'named-amd-automatic';
      var tree = transpile(getSourcePath(testName), { moduleName: true });

      builder = new broccoli.Builder(tree);
      return builder.build().then(function(node) {
        expect(readTranspiled(node.directory, 'foo.js')).to.be(readExpected(testName, 'foo.js'));
        expect(readTranspiled(node.directory, 'foo/bar.js')).to.be(readExpected(testName, 'foo/bar.js'));
      });
    });
  });
});
