#! /usr/bin/env node

'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _modelsCommitJs = require('./models/commit.js');

var _modelsCommitJs2 = _interopRequireDefault(_modelsCommitJs);

var commitBash = new _modelsCommitJs2['default'](process.argv.slice(2));

if (commitBash.isCommit()) {
  commitBash.onCommit();
}

commitBash.execShell('git');