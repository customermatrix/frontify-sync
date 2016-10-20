'use strict'

var fs = require('fs');
var _ = require('lodash');
var commander = require ('commander');

var ConfOptions = require('./configuration-options.service');
var optionsValidator = require('./options-validator.service');
var Logger = require('./logger.service');

/**
 * Main runner
 * @param  {Object} args  Optional unit testing args
 * @return {Array}        Parsed options
 */
function run(args) {
  // We need to allow this method to accept arguments for unit testing
  var args = args || process.argv;
  var confOptions = ConfOptions.get();

  if (!cliSetup(args, confOptions)){
    return;
  }

  commander.parse(args);
  var options = parseArgs(confOptions);
  try {
    return optionsValidator.run(options, confOptions);
  }
  catch(err) {
    Logger.error(err);
  }
}

/**
 * Set up commander options
 * @param  {Array like} args      List of CLI arguments
 * @param  {Array} confOptions    Configuration options
 */
function cliSetup(args, confOptions) {
  commander.version(getVersion());

  // Construct commander options based on default definitions
  _.forEach(confOptions, function(option){
    commander.option(option.commands, option.commandDescription);
  });

  // Output help if no options
  if (args.slice(2).length === 0) {
    commander.outputHelp();
    return;
  }

  return commander;
}

/**
 * Parse arguments from CLI
 * @param  {Array} confOptions   Configuration options
 * @return {Array}               Parsed options
 */
function parseArgs(confOptions) {
  var options = {};
  _.forEach(confOptions, function(option) {
    var optionName = option.name;
    if (_.isUndefined(commander[optionName])) {
      return;
    }
    options[optionName] = commander[optionName];
  });
  return options;
}

/**
 * Get Package version
 * @return {String}
 */
function getVersion() {
  var packageFile = fs.readFileSync('./package.json', 'UTF-8');
  return JSON.parse(packageFile).version;
}

module.exports = {
  run: run
}
