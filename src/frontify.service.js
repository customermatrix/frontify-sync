'use strict';

var _ = require('lodash');
var Promise = require('bluebird');

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

  if (!access || !_.isPlainObject(access)) {
    return Promise.reject('Missing Frontify account information, job aborted!')
      .catch(function(error) {
        throw error;
      });
  }

  if (_.isString(target)) {
    access.target = target;
  }
  if (_.isString(cwd)) {
    access.cwd = cwd;
  }

  return frontifyApi.syncAssets(access, files);
}

module.exports = {
  syncPatterns: syncPatterns,
  syncAssets: syncAssets
};
