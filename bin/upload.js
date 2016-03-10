#! /usr/bin/env node
'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _modelsBasecampJs = require('./models/basecamp.js');

var _modelsBasecampJs2 = _interopRequireDefault(_modelsBasecampJs);

var _modelsDatabaseJs = require('./models/database.js');

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

'use string';

var basecampAPI = new _modelsBasecampJs2['default']();
var timeReport = new _modelsDatabaseJs.TimeReport();
timeReport.setOnFinishInit(function (commits) {
  var todayDate = (0, _moment2['default'])().add().format('MMM Do YY');

  var todayCommits = commits.filter(function (commit) {
    return (0, _moment2['default'])(commit.date).format('MMM Do YY') === todayDate;
  });

  var listener = function listener(commit) {
    if (!commit.upload) {
      basecampAPI.timeReport({
        todoId: commit.todoId,
        personId: commit.personId,
        date: (0, _moment2['default'])(commit.date).format('YYYYMMDD'),
        hours: commit.hour,
        description: commit.message
      }, function () {
        commit.upload = true;
        timeReport.save(false);
      });
    }
  };

  if (todayCommits.length > 0) {
    todayCommits.forEach(listener);
  }
});