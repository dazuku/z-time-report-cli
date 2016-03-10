#! /usr/bin/env node
'use string';

import BasecampAPI from './models/basecamp.js';
import moment from 'moment';

const basecampAPI = new BasecampAPI();
const userArgs = process.argv.slice(2);

switch (userArgs[0]) {
  case 'ls':
    basecampAPI.projects();
    break;
  case undefined:
  case null:
  case '':
    console.error('you can use ls or id of the todo list');
    break;
  default:
    basecampAPI.todoLists(userArgs[0]);
    break;
}
