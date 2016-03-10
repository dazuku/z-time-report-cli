#! /usr/bin/env node

'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _modelsDatabaseJs = require('./models/database.js');

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var timeReport = new _modelsDatabaseJs.TimeReport();
timeReport.setOnFinishInit(function (commits) {
  var yesterdayDate = (0, _moment2['default'])().add(-1, 'days').format('MMM Do YY');
  var todayDate = (0, _moment2['default'])().add().format('MMM Do YY');
  var yesterdayCommits = commits.filter(function (commit) {
    return (0, _moment2['default'])(commit.date).format('MMM Do YY') === yesterdayDate;
  });
  var todayCommits = commits.filter(function (commit) {
    return (0, _moment2['default'])(commit.date).format('MMM Do YY') === todayDate;
  });

  var listener = function listener(commit) {
    var date = (0, _moment2['default'])(commit.date).format('hh:mmA');
    console.log(date + '\t' + commit.message + ' (' + commit.hour + ')');
  };

  if (yesterdayCommits.length > 0) {
    console.log('Yesterday');
    yesterdayCommits.forEach(listener);
  }

  if (todayCommits.length > 0) {
    console.log('Today');
    todayCommits.forEach(listener);
  }

  if (commits.length < 1) {
    console.log('You don\'t have commits in your Zemoga Time Report');
  }
});