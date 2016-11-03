var chai = require('chai');
var expect = chai.expect;
var chaiSubset = require('chai-subset');
var sinon = require('sinon');
var commander = require('commander');
chai.should();
chai.use(chaiSubset);

var patterns = require('../src/patterns.service');
var logger = require('../src/logger.service');

function run() {

  describe('@getList', function() {

    it ('should be exposed', function() {
      expect(patterns.getList).to.be.a('function');
    });

    it ('should return an empty list by default', function() {
      expect(patterns.getList()).to.members([]);
    });

  });

  describe('@checkType', function() {

    it ('should be exposed', function() {
      expect(patterns.checkType).to.be.a('function');
    });

    it ('should return true when path matches authorized type', function() {
      expect(patterns.checkType('molecules')).to.be.true;
    });

    it ("should return false when path doesn't match authorized type", function() {
      expect(patterns.checkType('foo')).to.be.false;
    });

  });

  describe('@getOrCreate', function() {

    it ('should be exposed', function() {
      expect(patterns.getOrCreate).to.be.a('function');
    });

    it ("should create a new pattern if not already registered", function() {
      var expectedPattern = {
        name: "test",
        description: "",
        type: "atoms",
        stability: "stable",
        assets: {
          html: [],
          css: []
        }
      };
      patterns.getOrCreate('atoms/test');
      expect(patterns.getList()).to.deep.members([expectedPattern]);
    });

    it ("should not create a pattern if already registered and return the pattern object", function() {
      var existingPattern = {
        name: "test",
        description: "",
        type: "atoms",
        stability: "stable",
        assets: {
          html: [],
          css: []
        }
      };
      patterns.getOrCreate('atoms/test');
      expect(patterns.getOrCreate('atoms/test')).to.containSubset(existingPattern);
    });

  });

  describe('@isAuthorizedAsset', function() {

    it ('should be exposed', function() {
      expect(patterns.isAuthorizedAsset).to.be.a('function');
    });

    it ("should return false when extension doesn't match authorized type", function() {
      expect(patterns.isAuthorizedAsset('bar')).to.be.false;
    });

    it ("should return true when extension matches authorized type", function() {
      expect(patterns.isAuthorizedAsset('scss')).to.be.true;
    });

  });

  describe('@registerAsset', function() {

    it ('should be exposed', function() {
      expect(patterns.registerAsset).to.be.a('function');
    });

    it ('should add a css asset to a pattern if not already registered', function() {
      var filePath = 'foo/bar.css';
      var currentPattern = {
        name: "foo",
        assets: {
          css: []
        }
      };
      var expectedPattern = {
        name: "foo",
        assets: {
          css: []
        }
      };
      expect(patterns.registerAsset(filePath, currentPattern)).to.containSubset(expectedPattern);
    });

    it ('should log a warning and not add a css asset to a pattern if already registered', function() {
      var stub = sinon.stub(logger, 'warning');
      var filePath = 'foo/bar.css';
      var message = "Asset already registered, last declaration is taken into account: `" + filePath + "`";
      var currentPattern = {
        name: "foo",
        assets: {
          css: [filePath]
        }
      };
      patterns.registerAsset(filePath, currentPattern);
      expect(stub.calledWith(message)).to.be.true;
      expect(stub.callCount).to.equal(1);
      stub.restore();
    });

    it ('should add a html asset to a pattern if not already registered', function() {
      var filePath = 'bar/foo.html';
      var currentPattern = {
        name: "foo",
        assets: {
          html: []
        }
      };
      var expectedPattern = {
        name: "foo",
        assets: {
          html: [filePath]
        }
      };
      expect(patterns.registerAsset(filePath, currentPattern)).to.containSubset(expectedPattern);
    });

    it ('should log a warning and not add a html asset to a pattern if already registered', function() {
      var stub = sinon.stub(logger, 'warning');
      var filePath = 'bar/foo.html';
      var message = "Asset already registered, last declaration is taken into account: `" + filePath + "`";
      var currentPattern = {
        name: "foo",
        assets: {
          html: [filePath]
        }
      };
      patterns.registerAsset(filePath, currentPattern);
      expect(stub.calledWith(message)).to.be.true;
      expect(stub.callCount).to.equal(1);
      stub.restore();
    });

  });

}

module.exports = {
  run: run
};
