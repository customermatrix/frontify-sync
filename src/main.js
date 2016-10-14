'use strict';

var fs = require('fs');
var _ = require('lodash');

var frontifyApi = require('@frontify/frontify-api');
var frontifyPattern = require('@frontify/frontify-api/lib/core/patterns.js');

var Patterns = require('./patterns.service');
var Files = require('./files.service');
var Logger = require('./logger.service');

function init(patternsFolder) {
  try {
    generatePatterns(patternsFolder);
  }
  catch(err) {
    Logger.error(err);
    return;
  }
  synchronizePatterns();
}


/**
 * Generate JSON files for found patterns
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

/**
 * Synchronize remote Frontify project
 */
function synchronizePatterns() {
  var access = {
    access_token: "frontify_access_token",
    project: "frontify_project_id"
  };
  frontifyApi.syncPatterns(access, ['tmp-frontify/**/*.json'])
    .then(function(data) {
      Logger.success('Success: Patterns have been synchronized to Frontify');
    })
    .catch(function(err) {
        Logger.error(err);
    });
}

module.exports = {
  init: init
};
