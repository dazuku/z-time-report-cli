'use strict';

import shell from 'shelljs';
import { Commit, TimeReport } from './database.js';
import { getPrefix } from './utils';

export default class CommitBash {
  constructor(userArgs) {
    this.userArgs = userArgs;
    this.timeReport = new TimeReport();
  }

  onCommit() {
    const { userArgs } = this;
    const { value: zignore } = getPrefix(userArgs, { short: 'zi', long: 'zignore' });

    if (zignore) {
      return;
    }

    let commit = null;

    const message = getPrefix(userArgs, { short: 'm', long: 'message' });
    if (message.value) {
      commit = new Commit({ msg: message.value });
      userArgs[message.index] = `"${message.value}"`;
    }

    const zmessage = getPrefix(userArgs, { short: 'zm', long: 'zmessage' });
    if (zmessage.value) {
      commit = new Commit({ msg: zmessage.value });
      userArgs.splice(zmessage.index - 1, 2);
    }

    const ztime = getPrefix(userArgs, { short: 'zt', long: 'ztime' }, { value: 1 });
    if (ztime.value) {
      commit.hour = ztime.value;
      userArgs.splice(ztime.index - 1, 2);
    }

    const ztodo = getPrefix(userArgs, { short: 'zd', long: 'ztodo' });
    if (ztodo.value) {
      commit.todoId = ztodo.value;
      userArgs.splice(ztodo.index - 1, 2);
    }

    if (commit) {
      this.timeReport.add({ commit });
    }
  }

  isCommit() {
    return !!this.userArgs.find(a => a === 'commit');
  }

  execShell(command) {
    let commandShell = `${command} ${this.userArgs.join(' ')}`;
    let shellres = shell.exec(commandShell);

    if (shellres && shellres.code === 0 && this.isCommit()) {
      this.timeReport.save();
    }
  }
}
