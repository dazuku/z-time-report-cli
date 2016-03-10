#! /usr/bin/env node
'use strict';

import CommitBash from './models/commit.js';

const commitBash = new CommitBash(process.argv.slice(2));

if (commitBash.isCommit()) {
  commitBash.onCommit();
}

commitBash.execShell('svn');
