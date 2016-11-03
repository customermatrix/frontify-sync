var chai = require('chai');
var chaiSubset = require('chai-subset');
var sinon = require('sinon');
var expect = chai.expect;
var commander = require('commander');

chai.use(chaiSubset);
chai.should();

var commanderWrapper = require('../src/commander-wrapper.service');

function run() {

  describe('@getInstance', function() {
    it ('should be exposed', function() {
      expect(commanderWrapper.getInstance).to.be.a('function');
    });

    it ('should return a commander Command Object', function() {
      var command = {
        commands: [],
        options: [],
        _execs: {},
        _allowUnknownOption: false,
        _args: [],
        _name: 'local-sync-frontify'
      }
      expect(commanderWrapper.getInstance()).to.containSubset(command);
    });

    it ('should set CLI name to `local-sync-frontify`', function() {
      expect(commanderWrapper.getInstance().name()).to.equal('local-sync-frontify');
    });

  });

}

module.exports = {
  run: run
};