#! /usr/bin/env node
'use string';

import BasecampAPI from './models/basecamp.js';
import { Commit, TimeReport } from './models/database.js';
import moment from 'moment';

const basecampAPI = new BasecampAPI();
const timeReport = new TimeReport();
timeReport.setOnFinishInit(commits => {
  const todayDate = moment().add().format('MMM Do YY');

  const todayCommits = commits.filter(commit => {
    return moment(commit.date).format('MMM Do YY') === todayDate;
  });

  const listener = commit => {
    if (!commit.upload) {
      basecampAPI.timeReport({
        todoId: commit.todoId,
        personId: commit.personId,
        date: moment(commit.date).format('YYYYMMDD'),
        hours: commit.hour,
        description: commit.message
      }, () => {
        commit.upload = true;
        timeReport.save(false);
      });
    }
  };

  if (todayCommits.length > 0) {
    todayCommits.forEach(listener);
  }
});
