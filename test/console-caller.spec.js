var chai = require('chai');
var sinon = require('sinon');

var expect = chai.expect;
chai.should();

var consoleCaller = require('../src/console-caller.service');

function run() {

  describe('@log', function() {
    it ('should be exposed', function() {
      expect(consoleCaller.log).to.be.a('function');
    });

    it ('should call console log', function() {
      var spy = sinon.spy(console, 'log');
      consoleCaller.log('\tDummy log printed only for unit tests');
      expect(spy.callCount).to.equal(1);
      spy.restore();
    });
  });

}

module.exports = {
  run: run
};
