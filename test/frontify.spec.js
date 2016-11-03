var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
var sinon = require('sinon');
var Promise = require('bluebird');

var frontify = require('../src/frontify.service');
var frontifyApi = require('@frontify/frontify-api');

var expect = chai.expect;
chai.should();
chai.use(chaiAsPromised);


function run() {

  describe('@syncPatterns', function() {

    it ('should be exposed', function() {
      expect(frontify.syncPatterns).to.be.a('function');
    });

    it ('should call frontify api syncPatterns function', function() {
      var stubCb = function() {};
      var stub = sinon.stub(frontifyApi, 'syncPatterns', stubCb);
      frontify.syncPatterns();
      expect(stub.callCount).to.equal(1);
      frontifyApi.syncPatterns.restore();
    });

  });

  describe('@syncAssets', function() {
    var stub;
    var access;
    beforeEach(function() {
      access = { foo: 'bar' };
      stub = sinon.stub(frontifyApi, 'syncAssets', stubCb);
      function stubCb() {
        return Promise.resolve('done')
          .then(function(msg) {
            return msg;
          });
      };
    });

    afterEach(function() {
      frontifyApi.syncAssets.restore();
    });

    it ('should be exposed', function() {
      expect(frontify.syncAssets).to.be.a('function');
    });

    it ('should call frontify api syncAssets function', function() {
      frontify.syncAssets(access);
      expect(stub.callCount).to.equal(1);
    });

    it ('should append cwd option to access information if provided', function() {
      frontify.syncAssets(access, null, null, 'foo');
      expect(access).to.have.ownProperty('cwd');
      expect(access.cwd).to.equal('foo');
    });

    it ('should append target option to access information if provided', function() {
      frontify.syncAssets(access, null, 'bar', null);
      expect(access).to.have.ownProperty('target');
      expect(access.target).to.equal('bar');
    });

    it ('should resolve promise when access information are provided', function() {
      return frontify.syncAssets(access).should.eventually.equal('done');
    });

    it ('should reject promise with an error when access information are not provided', function() {
      var error = 'Missing Frontify account information, job aborted!'
      return frontify.syncAssets().should.be.rejectedWith(error);
    });

  });

}

module.exports = {
  run: run
};
