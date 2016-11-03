var chai = require('chai');
var expect = chai.expect;
var chaiSubset = require('chai-subset');
var sinon = require('sinon');
var commander = require('commander');
chai.should();
chai.use(chaiSubset);

var cliParser = require('../src/cli-parser.service');
var optionsValidator = require('../src/options-validator.service');
var consoleCaller = require('../src/console-caller.service');
var logger = require('../src/logger.service');
var command = require('../src/commander-wrapper.service');
var commander = command.getInstance();

function run() {

  describe('@run', function() {

    it ('should be exposed', function() {
      expect(cliParser.run).to.be.a('function');
    });

    it ('should output help when no arguments provided', function() {
      function stubCb() {};
      var stub = sinon.stub(commander, 'outputHelp', stubCb);
      try {
        cliParser.run([]);
      }
      catch (error){}
      expect(stub.callCount).to.equal(1);
      stub.restore();
    });

    it ('should log error message when no arguments provided', function() {
      var stub = sinon.stub(consoleCaller, 'log');
      var spy = sinon.spy(logger, 'error');
      var args = [null, null, '-a', 'foo'];

      cliParser.run(args);

      expect(stub.callCount).to.equal(1);
      expect(spy.callCount).to.equal(1);
      stub.restore();
      spy.restore();
    });

    it ('should log warning and error messages when no arguments provided', function() {
      var stub = sinon.stub(consoleCaller, 'log');
      var spyError = sinon.spy(logger, 'error');
      var spyWarning = sinon.spy(logger, 'warning');
      var args = [null, null, '-a', 1];

      cliParser.run(args);

      expect(stub.callCount).to.equal(2);
      expect(spyError.callCount).to.equal(1);
      expect(spyWarning.callCount).to.equal(1);
      stub.restore();
      spyError.restore();
      spyWarning.restore();
    });

    it ('should call option validator and return filtered options', function() {
      var spy = sinon.spy(optionsValidator, 'run');
      // Two first entries in Array are related to node processes
      var args = [null, null, '-A', '1', '-P', '2', '-p', '3', '-a', '4'];
      var expectedOptions = {
        accessToken: '1',
        projectId: '2',
        patterns: '3',
        assets: ['4']
      };
      expect(cliParser.run(args)).to.containSubset(expectedOptions);
      expect(spy.callCount).to.equal(1);
      spy.restore();
    });

  });

}

module.exports = {
  run: run
};
