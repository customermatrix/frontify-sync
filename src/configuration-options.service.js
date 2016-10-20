'use strict';

// Authorized options
var options = [
  {
    name: 'configuration',
    type: 'string',
    commands: '-c, --configuration [path]',
    commandDescription: 'Set configuration file source path (String)'
  },
  {
    name: 'accessToken',
    type: 'string',
    mandatory: true,
    commands: '-A, --access-token [path]',
    commandDescription: 'Set access token (String)'
  },
  {
    name: 'projectId',
    type: 'string',
    mandatory: true,
    commands: '-P, --project-id [path]',
    commandDescription: 'Set project id (String)'
  },
  {
    name: 'patterns',
    type: 'string',
    commands: '-p, --patterns [path]',
    commandDescription: 'Set patterns directory source path (Array glob)'
  },
  {
    name: 'assets',
    type: 'array',
    commands: '-a, --assets [path]',
    commandDescription: 'Set assets directory source path (Array glob)'
  },
  {
    name: 'cwd',
    type: 'string',
    commands: '-C, --cwd [Boolean]',
    commandDescription: 'Set the current working directory for local assets'
  },
  {
    name: 'target',
    type: 'string',
    commands: '-T, --target [String]',
    commandDescription: 'Set the target directory for assets in Frontify project'
  },
  {
    name: 'dryRun',
    type: 'boolean',
    commands: '-D, --dry-run [String]',
    commandDescription: 'Run a fake synchronisation to check for updated items'
  }
];

function get() {
  return options;
}


module.exports = {
  get: get
};