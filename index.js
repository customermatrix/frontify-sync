#!/usr/bin/env node
;
var Main = require('./src/main');
var CliParser = require('./src/cli-parser.service');
var Logger = require('./src/logger.service');

var options = CliParser.run();
Main(options);