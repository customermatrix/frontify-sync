'use strict';

var fs = require('fs');
var _ = require('lodash');

var frontifyApi = require('@frontify/frontify-api');
var frontifyPattern = require('@frontify/frontify-api/lib/core/patterns.js');

var Patterns = require('./patterns.service');
var Files = require('./files.service');
var Logger = require('./logger.service');

function init(patternsFolder) {
  generatePatterns(patternsFolder);
}


/**
 * Generate JSON files for found patterns
 */
function generatePatterns(patternsFolder) {
  walk(patternsFolder);
  var patternsList = Patterns.getList();
  if (!patternsList.length) {
    var error = "Error: no patterns found";
    Logger.error(error);
    return;
  }

  // Create temp folder
  var tmpFolder = './tmp-frontify';
  if(!Files.checkIfDir(tmpFolder, true)) {
    fs.mkdirSync(tmpFolder);
  }
  // Create JSON files
  _.forEach(patternsList, function(pattern) {
    var patternAsString = JSON.stringify(pattern);
    fs.writeFileSync(tmpFolder + '/' + pattern.name + '.json', patternAsString, 'utf8');
  });

  Logger.success('Created/updated ' + patternsList.length + ' patterns');
}

/**
 * Walk through a directory and create patterns
 * @param  {String} dir             Directory to walk through
 * @param  {Object} currentPattern  Current pattern object
 * @param  {Boolean} startPattern   Indicate that current files should be patterns directories
 */
function walk(dir, currentPattern, startPattern) {
  // File is not a directory, we stop here
  if (!Files.checkIfDir(dir)) {
    var error = "Error: file " + dir + " is not a directory";
    Logger.error(error);
    return;
  }

  // List files and run checks
  var paths = Files.readDir(dir);
  _.forEach(paths, function(path) {
    path = dir + '/' + path;
    if (Files.checkIfDir(path)) {
      if(startPattern) {
        currentPattern = Patterns.getOrCreate(path);
        walk(path, currentPattern);
        return;
      }

      if (Patterns.checkType(path)) {
        walk(path, currentPattern, true);
      }
    } else {
      var fileExtension = Files.getExtension(path);
      if (Patterns.isAuthorizedAsset(fileExtension)) {
        Patterns.registerAsset(path, currentPattern);
      }
    }
  });
}

module.exports = {
  init: init
};
