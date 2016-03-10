'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _os = require('os');

var _os2 = _interopRequireDefault(_os);

var root = _os2['default'].platform == 'win32' ? process.cwd().split(_path2['default'].sep)[0] : '/';

var Commit = function Commit(_ref) {
  var msg = _ref.msg;
  var _ref$id = _ref.id;
  var id = _ref$id === undefined ? '' : _ref$id;

  _classCallCheck(this, Commit);

  this.message = msg;
  this.date = new Date();
  this.todoId = id;
};

exports.Commit = Commit;

var TimeReport = (function () {
  function TimeReport() {
    var _this = this;

    _classCallCheck(this, TimeReport);

    this.commits = [];
    this.promises = [];

    var promise = new Promise(function (resolve, reject) {
      _fs2['default'].readFile(_path2['default'].dirname(process.argv[1]) + '/.ztr', 'utf8', function (err, data) {
        if (err) {
          resolve([]);
        }

        var commits = JSON.parse(data || '[]');

        if (_this.initListener) {
          _this.initListener(commits);
        }
        resolve(commits);
      });
    });

    this.promises.push(promise);
  }

  _createClass(TimeReport, [{
    key: 'setOnFinishInit',
    value: function setOnFinishInit(listener) {
      this.initListener = listener;
    }
  }, {
    key: 'add',
    value: function add(_ref2) {
      var _this2 = this;

      var commit = _ref2.commit;

      var promise = new Promise(function (resolve, reject) {
        _this2.getConfig().then(function (config) {
          commit.todoId = commit.todoId || config.TODO_ITEM_ID;
          commit.personId = commit.personId || config.PERSON_ID;
          resolve([commit]);
        });
      });
      this.promises.push(promise);
    }
  }, {
    key: 'getConfig',
    value: function getConfig() {
      var _this3 = this;

      var promise = new Promise(function (resolve, reject) {
        _fs2['default'].readFile(_path2['default'].dirname(process.argv[1]) + '/config.ztr', 'utf8', function (err, data) {
          if (err) {
            resolve({});
          }

          _this3.config = JSON.parse(data || '{}');
          resolve(_this3.config);
        });
      });

      return promise;
    }
  }, {
    key: 'setConfig',
    value: function setConfig(config) {
      var _this4 = this;

      this.getConfig().then(function (defaultConfigs) {
        Object.assign(defaultConfigs, config);

        _fs2['default'].writeFile(_path2['default'].dirname(process.argv[1]) + '/config.ztr', JSON.stringify(defaultConfigs), function (err) {
          if (err) {
            return console.error(err);
          }

          _this4.config = defaultConfigs;
          console.log('Added config to Zemoga time report');
        });
      });
    }
  }, {
    key: 'save',
    value: function save() {
      var _this5 = this;

      var showMessage = arguments.length <= 0 || arguments[0] === undefined ? true : arguments[0];

      Promise.all(this.promises).then(function (commits) {
        var list = [];
        commits.map(function (c) {
          Array.prototype.push.apply(_this5.commits, c);
        });

        _fs2['default'].writeFile(_path2['default'].dirname(process.argv[1]) + '/.ztr', JSON.stringify(_this5.commits), function (err) {
          if (err) {
            return console.log(err);
          }

          if (showMessage) {
            console.log('added to zemoga time report');
          }
        });
      })['catch'](function (err) {
        console.log(err);
      });
    }
  }]);

  return TimeReport;
})();

exports.TimeReport = TimeReport;