/**
 * Call console log function
 * This service is defined as a module for unit testing purpose:
 * it can be stubbed instead of stubbing directly the native console object.
 */
function log(message) {
  console.log(message);
}

module.exports = {
  log: log
}
