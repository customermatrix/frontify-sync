var argumentsParser = require('./arguments-parser.spec');
var configOptions = require('./configuration-options.spec');
var frontify = require('./frontify.spec');
var logger = require('./logger.spec');
var consoleCaller = require('./console-caller.spec');
var cliParser = require('./cli-parser.spec');
var commanderWrapper = require('./commander-wrapper.spec');
var files = require('./files.spec');
var patterns = require('./patterns.spec');
var optionsValidator = require('./options-validator.spec');
var mainFile = require('./main.spec');

describe('Arguments Parser service', function() {
  argumentsParser.run();
});

describe('Configuration Options service', function() {
  configOptions.run();
});

describe('Frontify service', function() {
  frontify.run();
});

describe('Logger service', function() {
  logger.run();
});
describe('Console caller', function() {
  consoleCaller.run();
});

describe('Cli parser service', function() {
  cliParser.run();
});
describe('Commander wrapper', function() {
  commanderWrapper.run();
});

describe('Files service', function() {
  files.run();
});

describe('Patterns service', function() {
  patterns.run();
});

describe('Options validator service', function() {
  optionsValidator.run();
});

describe('Main package file', function() {
  mainFile.run();
});
