'use strict';

var _ = require('lodash');

var Files = require('./files.service');
var Logger = require('./logger.service');

/**
 * Run validation script
 * @param  {[type]} options     [description]
 * @param  {[type]} confOptions [description]
 * @return {[type]}             [description]
 */
function run(options, confOptions) {
  var confFileOptions = getConfFileOptions(options);
  var mergedOptions = mergeConfFileOptions(options, confFileOptions);
  var filteredOptions = filtersInvalidArgs(mergedOptions, confOptions);
  if (checkMandatoryOptions(filteredOptions, confOptions) && checkSyncMode(filteredOptions)) {
    return filteredOptions;
  }
}

/**
 * Filter options:
 *  - check if their type is valid
 *  - check if their value is filled
 * @param  {Object} options       Parsed options
 * @param  {Array} confOptions    Allowed options
 * @return {Object}               Filtered option
 */
function filtersInvalidArgs(options, confOptions) {
  _.forIn(options, function(value, key) {
    var confOption = _.find(confOptions, { name: key });
    if (!confOption) {
      Logger.warning('Option `' + key + '` is unknown and will be ignored')
      delete options[key];
      return;
    }
    var arraySpotted;
    var optionType = confOption.type;
    // Convert to array if value is string when required type is array
    if (optionType === 'array') {
      if (typeof options[key] === 'string') {
        options[key] = [options[key]];
      }
      arraySpotted = true;
    }

    // Check for type and delete option is mismatch
    var checkType =
      arraySpotted ?
      _.isArray(options[key]) :
      typeof options[key] === optionType;

    if (!checkType && options[key]) {
      delete options[key];
      Logger.warning('`' + key + '` value has mismatched type, option will be ignored');
    }
  });

  return options;
}

/**
 * Parse configuration file and extend it with arguments options
 * @param  {String} confFile  Configuration file path
 * @param  {Object} options   Arguments options to merge with configuration ones
 * @return {Object}           Refined options
 */
function getConfFileOptions(options) {
  var confFile = options.configuration;
  if (!confFile) {
    return [];
  }
  var fileContents = Files.readFile(confFile);
  return JSON.parse(fileContents);
}


/**
 * Adds configuration options in parsed options
 * @param  {Object} options             Parsed options
 * @param  {Object} confFileOptions     Configuration file Options
 * @return {Object}                     Merged options
 */
function mergeConfFileOptions(options, confFileOptions) {
  _.forIn(confFileOptions, function(value, key) {
    var currentOption = _.get(options, key);
    if (!currentOption) {
      options[key] = value;
    }
  });

  return options;
}

/**
 * Check if mandatories options value are missing
 * @param  {Object} options          Filtered options
 * @param  {Object} confOptions      Allowed Options
 * @return {Boolean}
 */
function checkMandatoryOptions(options, confOptions) {
  var mandatoryOptions = _.filter(confOptions, {mandatory: true});
  _.forEach(mandatoryOptions, function(option) {
    if (!options[option.name] && option.mandatory) {
      throw '`' + option.name + '` value is mandatory, job aborted!';
      return false;
    }
  });

  return true;
}

/**
 * Check if either assets or patterns option is defined
 * @param  {Object} options   Filtered options
 * @return {Boolean}
 */
function checkSyncMode(options) {
  if(!options.assets && !options.patterns) {
    throw 'Either `assets` or `patterns` value must be filled, job aborted!';
  }
  return true;
}

module.exports = {
  run: run
};