'use strict';

var fs = require('fs');
var _ = require('lodash');
var Promise = require("bluebird");

var Patterns = require('./patterns.service');
var Files = require('./files.service');
var Frontify = require('./frontify.service');
var Conf = require('./configuration-options.service');
var ArgsParser = require('./arguments-parser.service');
var Logger = require('./logger.service');

var patternsJSONFiles = [
  './tmp-frontify/**/*.json'
];

/**
 * Generate patterns JSON files, then sync them and sync assets
 * @param  {Object} args    Arguments object provided when requiring the library
 */
function run(args) {
  var conf;
  try {
    conf = ArgsParser.run(args);
  }
  catch(err) {
    Logger.error(err);
    return;
  }

  var access = {
    access_token: _.get(conf, 'accessToken', null),
    project: _.get(conf, 'projectId', null),
    cwd: _.get(conf, 'cwd', null),
    target: _.get(conf, 'target', null)
  };

  var syncInfo = setSyncInfo(conf, access);
  return Promise.all(syncInfo.promises)
    .then(function() {
      Logger.success(syncInfo.message);
    })
    .catch(function(err) {
      Logger.error(err.message);
    });
}

function setSyncInfo(options, access) {
  var promises = [];
  var message = _.get(options, 'dryRun') ? "(DRY RUN) " : "";

  if (_.get(options, 'assets')) {
    message += "Assets";
    promises.push(Frontify.syncAssets(access, _.get(options, 'assets', null)));
  }
  if (_.get(options, 'assets') && _.get(options, 'patterns')) {
    message += " and ";
  }
  if (_.get(options, 'patterns')) {
    try {
      generatePatterns(_.get(options, 'patterns', null));
    }
    catch(err) {
      Logger.error(err);
      return;
    }
    message += "Patterns";
    promises.push(Frontify.syncPatterns(access, patternsJSONFiles));
  }

  message += " have been synchronized to Frontify";

  return {
    promises: promises,
    message: message
  };

}

/**
 * Generate JSON files for found patterns
 * @param  {String} patternsFolder    Root directory of patterns files
 */
function generatePatterns(patternsFolder) {
  walk(patternsFolder);
  var patternsList = Patterns.getList();
  if (!patternsList.length) {
    throw "no patterns found";
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

  Logger.info('Created/updated ' + patternsList.length + ' patterns locally');
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
    return;
  }

  // List files and run checks
  var paths = Files.readDir(dir);
  _.forEach(paths, function(path) {
    path = dir + '/' + path;

    var fileExtension = Files.getExtension(path);
    if (!Files.checkIfDir(path) && Patterns.isAuthorizedAsset(fileExtension)) {
      Patterns.registerAsset(path, currentPattern);
      return;
    }

    if(startPattern) {
      currentPattern = Patterns.getOrCreate(path);
      walk(path, currentPattern);
      return;
    }

    if (Patterns.checkType(path)) {
      walk(path, currentPattern, true);
    }

  });
}

module.exports = function(args) {
  return run(args);
}
