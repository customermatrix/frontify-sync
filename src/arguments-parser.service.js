'use strict';

var fs = require('fs');
var _ = require('lodash');

var ConfOptions = require('./configuration-options.service');
var OptionsValidator = require('./options-validator.service');

/**
 * Main runner
 * @param  {Array-like} args  Arguments passed to the initial function
 * @return {Array}            Parsed options
 */
function run(args) {
  var options = {};
  if (!_.isPlainObject(args)) {
    throw 'Invalid format for options, JSON object expected';
  }
  var confOptions = ConfOptions.get();
  _.forIn(args, function(value, key) {
    options[key] = value;
  });
  return OptionsValidator.run(options, confOptions);
}

module.exports = {
  run: run
};