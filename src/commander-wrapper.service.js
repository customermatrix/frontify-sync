var Command = require('commander').Command;
var commander = new Command('frontify-sync');

/**
 * Wrap commander initialization
 * This service is defined as a module for unit testing purpose:
 * it can be stubbed instead of stubbing directly the native console object.
 */
function getInstance() {
  return commander;
}

module.exports = {
  getInstance: getInstance
};
