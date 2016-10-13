'use strict';
var fs = require('fs');
var _ = require('lodash');

var Logger = require('./logger.service');

/**
 * Read directory synchronously
 * @param  {String} path  Path to read
 * @return {Array}        Array of files
 */
function readDir(path) {
  var response;

  try {
    return fs.readdirSync(path);
  }
  catch(err) {
    var error = "Error:" + err.message;
    Logger.error(error);
    return null;
  }
}

/**
 * Check if file is a directory
 * @param  {String} path  Path to check
 * @param  {Boolean}      won't trigger an error if path is not found or not a directory
 * @return {Boolean}
 */
function checkIfDir(path, silent) {
  try {
    fs.accessSync(path, fs.F_OK);
    return fs.statSync(path).isDirectory();
  }
  catch(err) {
    if (silent) {
      return false;
    }
    var error = "Error: " + err.message;
    Logger.error(error);
    return false;
  }
}

/**
 * Returns file extension
 * @param  {String} path Path to parse
 * @return {String}      File extension
 */
function getExtension(path) {
  return path.split('.').pop();
}

module.exports = {
  readDir: readDir,
  checkIfDir: checkIfDir,
  getExtension: getExtension
};
