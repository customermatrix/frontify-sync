var chai = require('chai');
var sinon = require('sinon');

var logger = require('../src/logger.service');
var consoleCaller = require('../src/console-caller.service');

var expect = chai.expect;
chai.should();


function run() {

  var stub;
  beforeEach(function() {
    sinon.stub(consoleCaller, 'log');
  });

  afterEach(function() {
    consoleCaller.log.restore();
  });

  describe('@error', function() {

    it ('should be exposed', function() {
      expect(logger.error).to.be.a('function');
    });

    it ('should return an error log message when message is provided', function() {
      var message = 'log message';
      var expectedMessage = '\u001b[31mERROR: \u001b[39mlog message';
      expect(logger.error(message)).to.equal(expectedMessage);
    });

    it ('should have called console logger', function() {
      logger.error();
      expect(consoleCaller.log.callCount).to.equal(1);
    });

  });

  describe('@warning', function() {

    it ('should be exposed', function() {
      expect(logger.warning).to.be.a('function');
    });

    it ('should return a warning log message when message is provided', function() {
      var message = 'log message';
      var expectedMessage = '\u001b[33mWARNING: \u001b[39mlog message';
      expect(logger.warning(message)).to.equal(expectedMessage);
    });

    it ('should have called console logger', function() {
      logger.warning();
      expect(consoleCaller.log.callCount).to.equal(1);
    });

  });

  describe('@info', function() {

    it ('should be exposed', function() {
      expect(logger.info).to.be.a('function');
    });

    it ('should return an info log message when message is provided', function() {
      var message = 'log message';
      var expectedMessage = '\u001b[36mINFO: \u001b[39mlog message';
      expect(logger.info(message)).to.equal(expectedMessage);
    });

    it ('should have called console logger', function() {
      logger.info();
      expect(consoleCaller.log.callCount).to.equal(1);
    });

  });

  describe('@success', function() {

    it ('should be exposed', function() {
      expect(logger.success).to.be.a('function');
    });

    it ('should return a success log message when message is provided', function() {
      var message = 'log message';
      var expectedMessage = '\u001b[32mSUCCESS: \u001b[39mlog message';
      expect(logger.success(message)).to.equal(expectedMessage);
    });

    it ('should have called console logger', function() {
      logger.success();
      expect(consoleCaller.log.callCount).to.equal(1);
    });

  });

}

module.exports = {
  run: run
};