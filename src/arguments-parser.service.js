'use strict';

var fs = require('fs');
var _ = require('lodash');

var ConfOptions = require('./configuration-options.service');
var OptionsValidator = require('./options-validator.service');
var Logger = require('./logger.service')

/**
 * Main runner
 * @param  {Object} args  Options provided to the initial function
 * @return {Object}       Parsed options
 */
function run(args) {
  var options = {};
  if (!_.isPlainObject(args)) {
    throw 'Invalid format for options, JSON object expected';
  }

  _.forIn(args, function(value, key) {
    options[key] = value;
  });
  try {
    return OptionsValidator.run(options);
  }
  catch(err) {
    Logger.error(err);
  }
}

module.exports = {
  run: run
};