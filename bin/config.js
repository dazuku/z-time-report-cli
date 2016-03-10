#! /usr/bin/env node

'use strict';

var _modelsDatabase = require('./models/database');

var _modelsUtils = require('.models/utils');

var timeReport = new _modelsDatabase.TimeReport();
var userArgs = process.argv.slice(2);

var config = {};

var _getPrefix = (0, _modelsUtils.getPrefix)(userArgs, { short: 'l', long: 'protocol' });

var protocol = _getPrefix.value;

var _getPrefix2 = (0, _modelsUtils.getPrefix)(userArgs, { short: 'k', long: 'token' });

var token = _getPrefix2.value;

var _getPrefix3 = (0, _modelsUtils.getPrefix)(userArgs, { short: 'd', long: 'domain' });

var domain = _getPrefix3.value;

var _getPrefix4 = (0, _modelsUtils.getPrefix)(userArgs, { short: 't', long: 'todo' });

var todo = _getPrefix4.value;

var _getPrefix5 = (0, _modelsUtils.getPrefix)(userArgs, { short: 'p', long: 'person' });

var person = _getPrefix5.value;

if (protocol) {
  config.BASECAMP_PROTOCOL = protocol;
}

if (token) {
  config.BASECAMP_TOKEN = token;
}

if (domain) {
  config.BASECAMP_DOMAIN = domain;
}

if (todo) {
  config.TODO_ITEM_ID = todo;
}

if (person) {
  config.PERSON_ID = person;
}

timeReport.setConfig(config);