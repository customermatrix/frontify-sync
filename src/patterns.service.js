'use strict';

var _ = require('lodash');

var Files = require('./files.service');
var Logger = require('./logger.service');

var patternsList = [];
// Default pattern JSON structure
var defaultPattern = {
  name: "",
  description: "",
  type: "",
  stability: "stable",
  assets: {
    html: [],
    css: []
  }
};

/**
 * Get patterns list
 * @return {Array}
 */
function getList() {
  return patternsList;
}

/**
 * Get type of pattern
 * @param  {String} path  Path to match
 * @return {String}       Granularity type
 */
function getType(path) {
  var pattern = /(atoms|molecules|organisms)/i;
  var type = pattern.exec(path);
  if (type) {
    return type[1];
  }
}

/**
 * Get pattern name
 * @param  {String} path  Path to retrieve name
 * @return {String}       Extracted name
 */
function getName(path) {
  var pattern = /(?:\/([^\/]*)\/?)$/i;
  var name = pattern.exec(path);
  if (name) {
    return name[1];
  }
}

/**
 * Check if type of granularity is authorized
 * @param  {String} path  Path to check
 * @return {Boolean}
 */
function checkType(path) {
  var pattern = /(atoms|molecules|organisms)/;
  return pattern.test(path);
}

/**
 * Get pattern or create a new one
 * @param  {String} path  Path to retrieve name
 * @return {Object}       Returns a pattern object
 */
function getOrCreate(path) {
  var UIPatternName = getName(path)
  if(isExistingPattern(UIPatternName)) {
    return patternsList[UIPatternName];
  }

  if (UIPatternName) {
    var newUiPattern = _.cloneDeep(defaultPattern);
    newUiPattern.name = UIPatternName;
    newUiPattern.type = getType(path);
    patternsList.push(newUiPattern);
    return newUiPattern;
  }
}

/**
 * Check for existing pattern name
 * @param  {String}  name  Name to check
 * @return {Boolean}
 */
function isExistingPattern(name) {
  return _.findIndex(patternsList, {name: name}) !== -1;
}

/**
 * Check if asset type is authorized
 * @param  {String}  ext  Extension to check
 * @return {Boolean}
 */
function isAuthorizedAsset(ext) {
  var possibleAssetsExtensions = ['css', 'scss', 'html'];
  return _.indexOf(possibleAssetsExtensions, ext) !== -1;
}

/**
 * Check if current pattern asset is already registered
 * @param  {Object}  currentPattern   Pattern object
 * @param  {String}  assetType        Type of asset
 * @param  {String}  path             Asset path to check
 * @return {Boolean}
 */
function hasAsset(currentPattern, assetType, path) {
  return _.indexOf(currentPattern.assets[assetType], path) !== -1;
}

/**
 * Register a new asset if not already done
 * @param  {String} path            Asset path
 * @param  {Object} currentPattern  Pattern Object
 */
function registerAsset(path, currentPattern) {
  var fileExtension = Files.getExtension(path);
  var overrideMessage = "Asset already registered, last declaration is taken into account";
  switch(fileExtension) {
    case 'css':
    case 'scss':
      hasAsset(currentPattern, 'css', fileExtension) ?
        Logger.warning(overrideMessage + path):
        currentPattern.assets.css.push(path);
      break;
    case 'html':
      hasAsset(currentPattern, 'html', fileExtension) ?
        Logger.warning(overrideMessage + path):
        currentPattern.assets.html.push(path);
      break;
  }
}

module.exports = {
  checkType: checkType,
  getOrCreate: getOrCreate,
  isAuthorizedAsset: isAuthorizedAsset,
  registerAsset: registerAsset,
  getList: getList
};
