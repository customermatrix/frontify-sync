'use strict';

var fs = require('fs');
var _ = require('lodash');

var Logger = require('./logger.service');

// Authorized options
var funcArgs = [
  { name: 'configuration', type: 'string' },
  { name: 'projectId', type: 'string', mandatory: true },
  { name: 'accessToken', type: 'string', mandatory: true  },
  { name: 'patterns', type: 'string', mandatory: true },
  { name: 'assets', type: 'array', mandatory: true },
  { name: 'cwd', type: 'string' },
  { name: 'target', type: 'string' },
  { name: 'dryRun', type: 'boolean' }
];

/**
 * Refine options provided through arguments
 * @param  {Array-like} args  Arguments passed to the initial function
 * @return {Object}           Filtered options
 */
function parse(args) {
  var options = {};
  var argsLength = args.length;
  // First we populate options with provided arguments
  for (var i = 0; i < argsLength; i++) {
    var optionName = _.get(funcArgs[i], 'name');
    if (!args[i]) {
      if (optionName) {
        Logger.warning(optionName + ' argument will be ignored due to invalid value');
      }
      continue;
    }
    options[optionName] = args[i];
  }

  // Then we extend options from configuration with ones from arguments
  if (options.configuration) {
    var optionsWithoutConf = _.omit(options, 'configuration');
    options = parseConf(options.configuration, optionsWithoutConf);
  }

  // Finally we run some checks
  var argsWithoutConf = _.reject(funcArgs, {name: 'configuration'});
  _.forEach(argsWithoutConf, function(arg) {
    var optionType = _.get(arg, 'type');
    var optionName = _.get(arg, 'name');
    var arraySpotted;
    // Convert to array if value is string when required type is array
    if (optionType === 'array') {
      if (typeof options[optionName] === 'string') {
        options[optionName] = [options[optionName]];
      }
      arraySpotted = true;
    }

    // Check for type and delete option is mismatch
    var checkType =
      arraySpotted ?
      _.isArray(options[optionName]) :
      typeof options[optionName] === optionType;
    if (!checkType) {
      delete options[optionName];
      Logger.warning(optionName + ' value has mismatched type, option will be ignored');
    }
    if (!options[optionName] && arg.mandatory) {
      throw optionName + ' value is mandatory, job aborted';
    }
  });

  return options;
}

/**
 * Check if an option is part of allowed ones
 * @param  {Object}  arg    Argument to check
 * @return {Boolean}
 */
function isAuthorizedArg(arg) {
  return _.findIndex(funcArgs, {name: arg}) !== -1;
}

/**
 * Parse configuration file and extend it with arguments options
 * @param  {String} confFile  Configuration file path
 * @param  {Object} options   Arguments options to merge with configuration ones
 * @return {Object}           Refined options
 */
function parseConf(confFile, options) {
  var fileContents = readFile(confFile);
  var conf = JSON.parse(fileContents);
  var filteredConf = _.pickBy(conf, function(value, key){
    return isAuthorizedArg(key);
  });
  return _.assign(filteredConf, options);
}

/**
 * Read synchronously a file path
 * @param  {String} file  File path
 * @return {String}       File contents
 */
function readFile(file) {
  try {
    return fs.readFileSync(file, 'utf8');
  }
  catch(err) {
    Logger.error(err);
    return;
  }
}

module.exports = {
  parse: parse
};