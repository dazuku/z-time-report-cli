#! /usr/bin/env node
'use strict';

import { Commit, TimeReport } from './models/database.js';
import moment from 'moment';

const timeReport = new TimeReport();
timeReport.setOnFinishInit(commits => {
  const yesterdayDate = moment().add(-1, 'days').format('MMM Do YY');
  const todayDate = moment().add().format('MMM Do YY');
  const yesterdayCommits = commits.filter(commit => {
    return moment(commit.date).format('MMM Do YY') === yesterdayDate;
  });
  const todayCommits = commits.filter(commit => {
    return moment(commit.date).format('MMM Do YY') === todayDate;
  });

  const listener = commit => {
    const date = moment(commit.date).format('hh:mmA');
    console.log(`${date}\t${commit.message} (${commit.hour})`);
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
