var chai = require('chai');
var chaiSubset = require('chai-subset');
chai.use(chaiSubset);
var sinon = require('sinon');

var argumentsParser = require('../src/arguments-parser.service');
var optionsValidator = require('../src/arguments-parser.service');
var confOptions = require('../src/configuration-options.service');
var logger = require('../src/logger.service');

var expect = chai.expect;
chai.should();


function run() {

  describe('@run', function() {

    it ('should be exposed', function() {
      expect(argumentsParser.run).to.be.a('function');
    });

    it ('should print an error about options format when no arguments provided', function() {
      var error = 'Invalid format for options, JSON object expected';
      expect(function() {
        argumentsParser.run()
      }).to.throw(error);
    });

    it ('should call the configuration options service', function() {
      var spy = sinon.spy(confOptions, 'get');
      try {
        argumentsParser.run();
        expect(spy.callCount).to.equal(1);
      }
      catch(err) {}
      confOptions.get.restore();
    });

    it ('should call the options validator service', function() {
      // optionsValidator is stubbed to prevent warning log about invalid options
      var stubCb = function() {};
      var stub = sinon.stub(optionsValidator, 'run', stubCb);
      var options = {
        foo: 'bar'
      };
      argumentsParser.run(options);
      expect(stub.callCount).to.equal(1);
      optionsValidator.run.restore();
    });

    it ('should prints an error about mandatory option when called without them', function() {
      var stub = sinon.stub(logger, 'error');
      var error = '`accessToken` value is mandatory, job aborted!';
      argumentsParser.run({})
      expect(stub.callCount).to.equal(1);
      stub.restore();
    });

    it ('should return parsed options when called with proper options', function() {
      var options = {
        accessToken: '123',
        projectId: '123',
        assets: 'foo'
      };
      var optionsExpected = {
        accessToken: '123',
        projectId: '123',
        assets: ['foo']
      };
      expect(argumentsParser.run(options)).to.containSubset(optionsExpected);
    });

  });

}

module.exports = {
  run: run
};