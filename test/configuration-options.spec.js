var chai = require('chai');
var sinon = require('sinon');
var expect = chai.expect;
chai.should();

var confOptions = require('../src/configuration-options.service');

function run() {

  describe('@run', function() {

    it ('should be exposed', function() {
      expect(confOptions.get).to.be.a('function');
    });

    it ('should have a list of options with commands, commands descriptions, name and type keys', function() {
      var options = confOptions.get();
      options.forEach(function(option){
        expect(option).to.have.ownProperty('commands');
        expect(option).to.have.ownProperty('commandDescription');
        expect(option).to.have.ownProperty('name');
        expect(option).to.have.ownProperty('type');
      });

    });

    it ('should have a list of options with commands value properly formatted', function() {
      var options = confOptions.get();
      // pattern must follow this rule -x, --xxx [value]
      var commandPattern = /^-[a-zA-Z]{1},\s--[\w-]{2,}\s\[\w+\]$/
      options.forEach(function(option){
        expect(option.commands).to.match(commandPattern)
      });

    });

    it ('should have a list of options with name and commands descriptions value to be string', function() {
      var options = confOptions.get();
      options.forEach(function(option){
        expect(option.commandDescription).to.be.a('string');
      });

    });

    it ('should have a list of options with type value matching authorized types', function() {
      var options = confOptions.get();
      var typePattern = /(string|array|boolean)/;
      options.forEach(function(option){
        expect(option.type).to.match(typePattern);
      });

    });

    it ('should have accessToken option with mandatory property', function() {
      var options = confOptions.get();
      var accessToken = options.find(function(o) {
        return o.name === 'accessToken';
      });
      expect(accessToken).to.have.ownProperty('mandatory');
      expect(accessToken.mandatory).to.be.a('boolean');
      expect(accessToken.mandatory).to.equal(true);

    });

    it ('should have projectId option with mandatory property', function() {
      var options = confOptions.get();
      var accessToken = options.find(function(o) {
        return o.name === 'projectId';
      });
      expect(accessToken).to.have.ownProperty('mandatory');
      expect(accessToken.mandatory).to.be.a('boolean');
      expect(accessToken.mandatory).to.equal(true);

    });

  });

}

module.exports = {
  run: run
};
