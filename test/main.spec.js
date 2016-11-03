var chai = require('chai');
var sinon = require('sinon');
var chaiAsPromised = require("chai-as-promised");
var Promise = require("bluebird");

var expect = chai.expect;
chai.should();
chai.use(chaiAsPromised);


var main = require('../src/main');
var argsParser = require('../src/arguments-parser.service');
var frontify = require('../src/frontify.service');
var logger = require('../src/logger.service');
var patterns = require('../src/patterns.service');


function run() {

  it ('should export run function', function() {
    expect(main).to.be.a('function');
  });

  it ('should call arguments parser', function() {
    function stubCbArgsParser() {
      throw 'dummy err';
    }
    var stubLogger = sinon.stub(logger, 'error');
    var stubParser = sinon.stub(argsParser, 'run', stubCbArgsParser);
    try {
      main();
    }
    catch(err) {}
    expect(stubParser.callCount).to.equal(1);
    stubParser.restore();
    stubLogger.restore();
  });

  it ('with valid options, should log success message about assets synchronization', function() {
    function stubCbArgsParser() {
      throw 'dummy err';
    }
    function stubCbSync() {
      return Promise.resolve('done')
        .then(function(msg) {
          return msg;
        });
    }
    var stubLoggerSuccess = sinon.stub(logger, 'success');
    var stubFrontifySyncAssets = sinon.stub(frontify, 'syncAssets', stubCbSync);
    var message = "Assets have been synchronized to Frontify";
    var args = {
      accessToken: '1',
      projectId: '2',
      assets: './test/assets'
    };
    main(args)
      .then(function() {
        expect(stubLoggerSuccess.callCount).to.equal(1);
        expect(stubLoggerSuccess.calledWith(message)).to.be.true;
        stubLoggerSuccess.restore();
      });
    stubFrontifySyncAssets.restore();
  });

  it ('with valid options, should log info and success message about patterns creation and synchronization', function() {
    function stubCbSync() {
      return Promise.resolve('done')
        .then(function(msg) {
          return msg;
        });
    }
    function stubCbPatternsGetList() {
      return ['foo', 'bar'];
    }
    var stubLoggerInfo = sinon.stub(logger, 'info');
    var stubLoggerSuccess = sinon.stub(logger, 'success');
    var stubPatternsGetList = sinon.stub(patterns, 'getList', stubCbPatternsGetList);
    var stubFrontifySyncPatterns = sinon.stub(frontify, 'syncPatterns', stubCbSync);
    var messageInfo = "Created/updated 2 patterns locally";
    var messageSuccess = "Patterns have been synchronized to Frontify";
    var args = {
      accessToken: '1',
      projectId: '2',
      patterns: './test/patterns'
    };
    main(args)
      .then(function() {
        expect(stubLoggerInfo.callCount).to.equal(1);
        expect(stubLoggerInfo.calledWith(messageInfo)).to.be.true;
        expect(stubLoggerSuccess.callCount).to.equal(1);
        expect(stubLoggerSuccess.calledWith(messageSuccess)).to.be.true;
        stubLoggerInfo.restore();
        stubLoggerSuccess.restore();
        stubFrontifySyncPatterns.restore();
      });
    stubPatternsGetList.restore();
  });


  it ('should call arguments parser and log a success with proper options', function() {
    function stubCbSync() {
      return Promise.resolve('done')
        .then(function(msg) {
          return msg;
        });
    }
    function stubCbPatternsGetList() {
      return ['foo', 'bar'];
    }
    var stubLoggerInfo = sinon.stub(logger, 'info');
    var stubLoggerWarning = sinon.stub(logger, 'warning');
    var stubLoggerSuccess = sinon.stub(logger, 'success');
    var stubParser = sinon.spy(argsParser, 'run');
    var stubPatternsGetList = sinon.stub(patterns, 'getList', stubCbPatternsGetList);
    var stubFrontifySyncAssets = sinon.stub(frontify, 'syncAssets', stubCbSync);
    var stubFrontifySyncPatterns = sinon.stub(frontify, 'syncPatterns', stubCbSync);
    var messageInfo = "Created/updated 2 patterns locally";
    var messageSuccess = "(DRY RUN) Assets and Patterns have been synchronized to Frontify";
    var args = {
      accessToken: '1',
      projectId: '2',
      dryRun: true,
      assets: './test/assets',
      patterns: './test/patterns'
    };
    main(args)
      .then(function() {
        expect(stubLoggerInfo.callCount).to.equal(1);
        expect(stubLoggerInfo.calledWith(messageInfo)).to.be.true;
        expect(stubLoggerSuccess.callCount).to.equal(1);
        expect(stubLoggerSuccess.calledWith(messageSuccess)).to.be.true;
        expect(stubParser.callCount).to.equal(1);
        stubLoggerInfo.restore();
        stubLoggerSuccess.restore();
        stubLoggerWarning.restore();
        stubFrontifySyncAssets.restore();
        stubFrontifySyncPatterns.restore();
      });
    stubParser.restore();
    stubPatternsGetList.restore();
  });

  it ('should throw en error when pattern list is empty', function() {
    function stubCbPatternsGetList() {
      return [];
    }
    var stubLoggerError = sinon.stub(logger, 'error');
    var stubLoggerWarning = sinon.stub(logger, 'warning');
    var stubPatternsGetList = sinon.stub(patterns, 'getList', stubCbPatternsGetList);
    var message = "no patterns found";
    var args = {
      accessToken: '1',
      projectId: '2',
      dryRun: true,
      patterns: './test/patterns'
    };
    try {
      main(args);
    }
    catch(err) {};

    expect(stubLoggerError.callCount).to.equal(1);
    expect(stubLoggerError.calledWith(message)).to.be.true;
    stubLoggerError.restore();
    stubLoggerWarning.restore();
    stubPatternsGetList.restore();
  });

  it ('should log an error message when frontify promises are rejected', function() {
    var errorMessage = 'error message'
    function stubCbSync() {
      return Promise.reject(new Error(errorMessage));
    }
    var stubLoggerError = sinon.stub(logger, 'error');
    var stubLoggerInfo = sinon.stub(logger, 'info');
    var stubLoggerWarning = sinon.stub(logger, 'warning');
    var stubFrontifySyncAssets = sinon.stub(frontify, 'syncAssets', stubCbSync);
    var stubFrontifySyncPatterns = sinon.stub(frontify, 'syncPatterns', stubCbSync);
    var args = {
      accessToken: '1',
      projectId: '2',
      dryRun: true,
      patterns: './test/patterns'
    };
    main(args)
      .then(function() {
        expect(stubLoggerError.callCount).to.equal(1);
        expect(stubLoggerError.calledWith(errorMessage)).to.be.true;
        stubFrontifySyncAssets.restore();
        stubFrontifySyncPatterns.restore();
        stubLoggerError.restore();
        stubLoggerInfo.restore();
        stubLoggerWarning.restore();
      });

  });

  it ('should call arguments parser and log an error without options', function() {
    var stubLoggerError = sinon.stub(logger, 'error');
    var stubLoggerWarning = sinon.stub(logger, 'warning');
    var stubParser = sinon.spy(argsParser, 'run');
    try {
      main();
    }
    catch(err) {};

    expect(stubLoggerError.callCount).to.equal(1);
    expect(stubParser.callCount).to.equal(1);
    stubLoggerError.restore();
    stubLoggerWarning.restore();
    stubParser.restore();
  });


}

module.exports = {
  run: run
};
