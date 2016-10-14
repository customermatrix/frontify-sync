'use strict';

var fs = require('fs');
var _ = require('lodash');

var Patterns = require('./patterns.service');
var Files = require('./files.service');
var Frontify = require('./frontify.service');
var Logger = require('./logger.service');


var access = {
  access_token: "frontify_access_token",
  project: "frontify_project_id"
};
var patternsDir = './patterns';
var patternsJSONFiles = [
  'tmp-frontify/**/*.json'
];
var assetsFiles = [
  'assets/**/*.*'
];

/**
 * Generate patterns JSON files, then sync them and sync assets
 */
function init() {
  try {
    generatePatterns(patternsDir);
  }
  catch(err) {
    Logger.error(err);
    return;
  }
  Frontify.syncPatterns(access, patternsJSONFiles);
  Frontify.syncAssets(access, assetsFiles);
}

/**
 * Generate JSON files for found patterns
 * @param  {String} patternsFolder    Root directory of patterns files
 */
function generatePatterns(patternsFolder) {
  walk(patternsFolder);
  var patternsList = Patterns.getList();
  if (!patternsList.length) {
    throw "Error: no patterns found";
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

  Logger.info('Created/updated ' + patternsList.length + ' patterns');
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
