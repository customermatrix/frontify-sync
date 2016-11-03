var chai = require('chai');
var sinon = require('sinon');
var chaiSubset = require('chai-subset');
var expect = chai.expect;
chai.should();
chai.use(chaiSubset);

var optionsValidator = require('../src/options-validator.service');
var ConfOptions = require('../src/configuration-options.service');
var logger = require('../src/logger.service');

function run() {

  describe('@run', function() {

    it ('should be exposed', function() {
      expect(optionsValidator.run).to.be.a('function');
    });

    it ('without options provided, should throw an error about mandatory options', function() {
      var error = "`accessToken` value is mandatory, job aborted!";
      try {
        optionsValidator.run();
      }
      catch(err) {
        expect(err).to.equal(error);
      }
    });

    it ('should throw an error if either `assets` or `patterns` value is missing', function() {
      var error = "Either `assets` or `patterns` value must be filled, job aborted!";
      var confOptions = ConfOptions.get();
      var options = {
        accessToken: '1',
        projectId: '2'
      };
      try {
        optionsValidator.run(options);
      }
      catch(err) {
        expect(err).to.equal(error);
      }
    });

    it ('should log a warning if an option is unknown', function() {
      var stub = sinon.stub(logger, 'warning');
      var warning = "Option `foo` is unknown and will be ignored"
      var options = {
        foo: 'bar',
        accessToken: '1',
        projectId: '2'
      };
      try {
        optionsValidator.run(options);
      }
      catch(err) {}

      expect(stub.callCount).to.equal(1);
      expect(stub.calledWith(warning)).to.be.true;
      stub.restore();
    });

    it ('should log a warning if an option value mismatches expected type', function() {
      var stub = sinon.stub(logger, 'warning');
      var warning = "`accessToken` value has mismatched type, option will be ignored"
      var options = {
        accessToken: 1,
        projectId: '2'
      };
      try {
        optionsValidator.run(options);
      }
      catch(err) {}

      expect(stub.callCount).to.equal(1);
      expect(stub.calledWith(warning)).to.be.true;
      stub.restore();
    });

    it ('should convert a string value to an array value when option type is array', function() {
      var options = {
        accessToken: '1',
        projectId: '2',
        assets: '3'
      };
      var expectedOptions = {
        accessToken: '1',
        projectId: '2',
        assets: ['3']
      };

      expect(optionsValidator.run(options)).to.containSubset(expectedOptions);
    });

    it ('should handle properly a configuration file and merge its options with provided options', function() {
      var options = {
        configuration: './test/assets/configuration.json',
        assets: '3'
      };
      var expectedOptions = {
        accessToken: '1',
        projectId: '2',
        assets: ['3']
      };

      expect(optionsValidator.run(options)).to.containSubset(expectedOptions);
    });

  });

}

module.exports = {
  run: run
};
