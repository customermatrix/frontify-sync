'use strict';

var _ = require('lodash');

var frontifyApi = require('@frontify/frontify-api');
var frontifyPattern = require('@frontify/frontify-api/lib/core/patterns.js');
var Logger = require('./logger.service');

/**
 * Synchronize remote Frontify patterns
 * @param  {Object} access    Frontify API credentials
 * @param  {Array}  files     Array of JSON files to sync
 */
function syncPatterns(access, files) {
  return frontifyApi.syncPatterns(access, files);
}

/**
 * Synchronize remote Frontify assets
 * @param  {Object} access    Frontify API credentials
 * @param  {Array}  files     Array of files to sync
 * @param  {String} target    Destination directory in Frontify
 * @param  {String} cwd       Current local working directory
 */
function syncAssets(access, files, target, cwd) {
  if (_.isString(target)) {
    assets.target = target;
  }
  if (_.isString(cwd)) {
    assets.cwd = cwd;
  }

  return frontifyApi.syncAssets(access, files);
}

module.exports = {
  syncPatterns: syncPatterns,
  syncAssets: syncAssets
};