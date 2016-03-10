#! /usr/bin/env node
'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _modelsBasecampJs = require('./models/basecamp.js');

var _modelsBasecampJs2 = _interopRequireDefault(_modelsBasecampJs);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

'use string';

var basecampAPI = new _modelsBasecampJs2['default']();
var userArgs = process.argv.slice(2);

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