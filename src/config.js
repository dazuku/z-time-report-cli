#! /usr/bin/env node
'use strict';

import { TimeReport } from './models/database';
import { getPrefix } from '.models/utils';

const timeReport = new TimeReport();
const userArgs = process.argv.slice(2);

const config = {};

const { value: protocol } = getPrefix(userArgs, { short: 'l', long: 'protocol' });
const { value: token } = getPrefix(userArgs, { short: 'k', long: 'token' });
const { value: domain } = getPrefix(userArgs, { short: 'd', long: 'domain' });
const { value: todo } = getPrefix(userArgs, { short: 't', long: 'todo' });
const { value: person } = getPrefix(userArgs, { short: 'p', long: 'person' });

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
