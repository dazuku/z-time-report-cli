'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _shelljs = require('shelljs');

var _shelljs2 = _interopRequireDefault(_shelljs);

var _databaseJs = require('./database.js');

var _utils = require('./utils');

var CommitBash = (function () {
  function CommitBash(userArgs) {
    _classCallCheck(this, CommitBash);

    this.userArgs = userArgs;
    this.timeReport = new _databaseJs.TimeReport();
  }

  _createClass(CommitBash, [{
    key: 'onCommit',
    value: function onCommit() {
      var userArgs = this.userArgs;

      var _getPrefix = (0, _utils.getPrefix)(userArgs, { short: 'zi', long: 'zignore' });

      var zignore = _getPrefix.value;

      if (zignore) {
        return;
      }

      var commit = null;

      var message = (0, _utils.getPrefix)(userArgs, { short: 'm', long: 'message' });
      if (message.value) {
        commit = new _databaseJs.Commit({ msg: message.value });
        userArgs[message.index] = '"' + message.value + '"';
      }

      var zmessage = (0, _utils.getPrefix)(userArgs, { short: 'zm', long: 'zmessage' });
      if (zmessage.value) {
        commit = new _databaseJs.Commit({ msg: zmessage.value });
        userArgs.splice(zmessage.index - 1, 2);
      }

      var ztime = (0, _utils.getPrefix)(userArgs, { short: 'zt', long: 'ztime' }, { value: 1 });
      if (ztime.value) {
        commit.hour = ztime.value;
        userArgs.splice(ztime.index - 1, 2);
      }

      var ztodo = (0, _utils.getPrefix)(userArgs, { short: 'zd', long: 'ztodo' });
      if (ztodo.value) {
        commit.todoId = ztodo.value;
        userArgs.splice(ztodo.index - 1, 2);
      }

      if (commit) {
        this.timeReport.add({ commit: commit });
      }
    }
  }, {
    key: 'isCommit',
    value: function isCommit() {
      return !!this.userArgs.find(function (a) {
        return a === 'commit';
      });
    }
  }, {
    key: 'execShell',
    value: function execShell(command) {
      var commandShell = command + ' ' + this.userArgs.join(' ');
      var shellres = _shelljs2['default'].exec(commandShell);

      if (shellres && shellres.code === 0 && this.isCommit()) {
        this.timeReport.save();
      }
    }
  }]);

  return CommitBash;
})();

exports['default'] = CommitBash;
module.exports = exports['default'];