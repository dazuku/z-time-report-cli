'use strict';

import fs from 'fs';
import path from 'path';
import os from 'os';

const root = (os.platform == 'win32') ? process.cwd().split(path.sep)[0] : '/';

export class Commit {
  constructor({ msg, id = '' }) {
    this.message = msg;
    this.date = new Date();
    this.todoId = id;
  }
}

export class TimeReport {
  constructor() {
    this.commits = [];
    this.promises = [];

    const promise = new Promise((resolve, reject) => {
      fs.readFile(`${path.dirname(process.argv[1])}/.ztr`, 'utf8', (err, data) => {
        if (err) {
          resolve([]);
        }

        const commits = JSON.parse(data || '[]');

        if (this.initListener) {
          this.initListener(commits);
        }
        resolve(commits);
      });
    });

    this.promises.push(promise);
  }

  setOnFinishInit(listener) {
    this.initListener = listener;
  }

  add({ commit }) {
    const promise = new Promise((resolve, reject) => {
      this.getConfig().then(config => {
        commit.todoId = commit.todoId || config.TODO_ITEM_ID;
        commit.personId = commit.personId || config.PERSON_ID;
        resolve([commit]);
      });
    });
    this.promises.push(promise);
  }

  getConfig() {
    const promise = new Promise((resolve, reject) => {
      fs.readFile(`${path.dirname(process.argv[1])}/config.ztr`, 'utf8', (err, data) => {
        if (err) {
          resolve({});
        }

        this.config = JSON.parse(data || '{}');
        resolve(this.config);
      });
    });

    return promise;
  }

  setConfig(config) {
    this.getConfig().then((defaultConfigs) => {
      Object.assign(defaultConfigs, config);

      fs.writeFile(`${path.dirname(process.argv[1])}/config.ztr`, JSON.stringify(defaultConfigs), err => {
        if (err) {
          return console.error(err);
        }

        this.config = defaultConfigs;
        console.log('Added config to Zemoga time report');
      });
    });
  }

  save(showMessage = true) {
    Promise.all(this.promises).then(commits => {
      let list = [];
      commits.map(c => {
        Array.prototype.push.apply(this.commits, c);
      });

      fs.writeFile(`${path.dirname(process.argv[1])}/.ztr`, JSON.stringify(this.commits), err => {
          if(err) {
              return console.log(err);
          }

          if (showMessage) {
            console.log('added to zemoga time report');
          }
      });
    }).catch(err => {
      console.log(err);
    });
  }
}
