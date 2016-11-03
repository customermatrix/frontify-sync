var chai = require('chai');
var sinon = require('sinon');
var fs = require('fs');

var files = require('../src/files.service');
var logger = require('../src/logger.service');

var expect = chai.expect;
chai.should();


function run() {

  describe('@readFile', function() {

    it ('should be exposed', function() {
      expect(files.readFile).to.be.a('function');
    });

    it ("should log an error when file doesn't exist", function() {
      var stub = sinon.stub(logger, 'error');
      var error = "ENOENT: no such file or directory, open 'not-a-file.txt'";
      files.readFile('not-a-file.txt')
      expect(stub.callCount).to.equal(1);
      expect(stub.calledWith(error)).to.be.true;
      stub.restore();
    });

    it ("should log an error when file is a directory", function() {
      var stub = sinon.stub(logger, 'error');
      var error = "EISDIR: illegal operation on a directory, read";
      files.readFile('./test/assets/')
      expect(stub.callCount).to.equal(1);
      expect(stub.calledWith(error)).to.be.true;
      stub.restore();
    });

    it ('should return file contents when file exists', function() {
      expect(files.readFile('./test/assets/file.txt')).to.equal('file contents');
    });
  });

  describe('@readDir', function() {

    it ('should be exposed', function() {
      expect(files.readDir).to.be.a('function');
    });

    it ("should log an error when directory doesn't exist", function() {
      var stub = sinon.stub(logger, 'error');
      var error = "ENOENT: no such file or directory, scandir 'not-a-directory'";
      files.readDir('not-a-directory');
      expect(stub.callCount).to.equal(1);
      expect(stub.calledWith(error)).to.be.true;
      stub.restore();
    });

    it ("should log an error when file is not a directory", function() {
      var stub = sinon.stub(logger, 'error');
      var error = "ENOTDIR: not a directory, scandir './test/assets/file.txt'";
      files.readDir('./test/assets/file.txt');
      expect(stub.callCount).to.equal(1);
      expect(stub.calledWith(error)).to.be.true;
      stub.restore();
    });

    it ('should return directory files when directory exists', function() {
      var filesArray = ['file.txt', 'configuration.json'];
      expect(files.readDir('./test/assets')).to.deep.members(filesArray);
    });

  });

  describe('@checkIfDir', function() {

    it ('should be exposed', function() {
      expect(files.checkIfDir).to.be.a('function');
    });

    it ("should throw an error when directory doesn't exist", function() {
      var stub = sinon.stub(logger, 'error');
      var error = "ENOENT: no such file or directory, access 'foo'";
      files.checkIfDir('foo');
      expect(stub.callCount).to.equal(1);
      expect(stub.calledWith(error)).to.be.true;
      stub.restore();
    });

    it ("should not throw an error but should return false when directory doesn't exist but silent mode is activated", function() {
      var stub = sinon.spy(logger, 'error');
      expect(files.checkIfDir('foo', true)).to.be.false;
      expect(stub.callCount).to.equal(0);
      stub.restore();
    });

    it ("should return false when file is not a directory", function() {
      expect(files.checkIfDir('./test/assets/file.txt')).to.be.false;
    });

    it ("should return true when file is a directory", function() {
      expect(files.checkIfDir('./test/assets/')).to.be.true;
    });

  });

  describe('@getExtension', function() {

    it ('should be exposed', function() {
      expect(files.getExtension).to.be.a('function');
    });

    it ('should return a file extension if file has one', function() {
      expect(files.getExtension('foo.json')).to.equal('json');
    });

    it ('should return a file extension if file has multiple dots in its name', function() {
      expect(files.getExtension('foo.test-bar.something.json')).to.equal('json');
    });

    it ("should return filename if file doesn't have an extension", function() {
      expect(files.getExtension('foo')).to.equal('foo');
    });

  });

}

module.exports = {
  run: run
};
