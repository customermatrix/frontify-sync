'use strict';

var colors = require('cli-color');

/**
 * Log usecases => error, warning, info and success
 * @param  {String} message [description]
 * @return {[type]}         [description]
 */
function error(message) {
  return log('error', message);
}
function warning(message) {
  return log('warning', message);
}
function info(message) {
  return log('info', message);
}
function success(message) {
  return log('success', message);
}

/**
 * Colorized console logger
 * @param  {String} type      Type of message
 * @param  {String} message   Message to display
 */
function log(type, message) {
  var color;
  switch(type) {
    case "error":
      color = "red";
      break;
    case "warning":
      color = "orange";
      break;
    case "info":
      color = "cyan";
      break;
    case "success":
      color = "green";
      break;
    default:
      type = '';
      color = "white";
  }
  type += ':';
  console.log(colors[color](type.toUpperCase()), message);
}

module.exports = {
  error: error,
  warning: warning,
  info: info,
  success: success
}