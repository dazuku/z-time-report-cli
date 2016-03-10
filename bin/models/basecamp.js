'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _request = require('request');

var _request2 = _interopRequireDefault(_request);

var _xml2js = require('xml2js');

var _js2xml = require('js2xml');

var _database = require('./database');

'use string';

var BASECAMP_PROJECT_PATH = '/projects';
var BASECAMP_TODO_PATH = '/todo_items';

var BasecampAPI = (function () {
  function BasecampAPI() {
    _classCallCheck(this, BasecampAPI);

    this.config = new _database.TimeReport().getConfig;
  }

  _createClass(BasecampAPI, [{
    key: 'configCallback',
    value: function configCallback(_ref) {
      var BASECAMP_PROTOCOL = _ref.BASECAMP_PROTOCOL;
      var BASECAMP_TOKEN = _ref.BASECAMP_TOKEN;
      var BASECAMP_DOMAIN = _ref.BASECAMP_DOMAIN;

      this.endpoint = '' + BASECAMP_PROTOCOL + BASECAMP_TOKEN + '@' + BASECAMP_DOMAIN;
    }
  }, {
    key: 'getBaseParams',
    value: function getBaseParams() {
      return {
        headers: {
          'User-Agent': 'Andres Garcia Reports (andres@zemoga.com)',
          'Content-Type': 'text/xml'
        }
      };
    }
  }, {
    key: 'printIdAndName',
    value: function printIdAndName(_ref2) {
      var id = _ref2.id;
      var name = _ref2.name;

      console.log(id + ':  ' + name);
    }
  }, {
    key: 'printTodoList',
    value: function printTodoList(name, todoItems) {
      var _this = this;

      console.log('\n' + name);

      todoItems.forEach(function (todo) {
        var id = todo.id[0]._,
            name = todo.content[0];

        _this.printIdAndName({ id: id, name: name });
      });
    }
  }, {
    key: 'projects',
    value: function projects() {
      var _this2 = this;

      this.config().then(function (config) {
        _this2.configCallback(config);
        _this2._projects();
      });
    }
  }, {
    key: 'todoLists',
    value: function todoLists(id) {
      var _this3 = this;

      this.config().then(function (config) {
        _this3.configCallback(config);
        _this3._todoLists(id);
      });
    }
  }, {
    key: 'todoItems',
    value: function todoItems(id, name) {
      var _this4 = this;

      this.config().then(function (config) {
        _this4.configCallback(config);
        _this4._todoItems(id, name);
      });
    }
  }, {
    key: 'timeReport',
    value: function timeReport(params, cb) {
      var _this5 = this;

      this.config().then(function (config) {
        _this5.configCallback(config);
        _this5._timeReport(params, cb);
      });
    }
  }, {
    key: '_projects',
    value: function _projects() {
      var _this6 = this;

      var params = { url: '' + this.endpoint + BASECAMP_PROJECT_PATH + '.xml' };

      _request2['default'].get(Object.assign(params, this.getBaseParams()), function (error, resp, body) {
        if (error) {
          return console.error(error);
        }

        (0, _xml2js.parseString)(body, function (parseError, parseResult) {
          var projects = parseResult.projects.project;

          projects.forEach(function (project) {
            var id = project.id[0]._,
                name = project.name[0];

            _this6.printIdAndName({ id: id, name: name });
          });
        });
      });
    }
  }, {
    key: '_todoLists',
    value: function _todoLists(id) {
      var _this7 = this;

      var params = { url: '' + this.endpoint + BASECAMP_PROJECT_PATH + '/' + id + '/todo_lists.xml' };

      _request2['default'].get(Object.assign(params, this.getBaseParams()), function (error, resp, body) {
        if (error) {
          return console.error(error);
        }

        (0, _xml2js.parseString)(body, function (parseError, parseResult) {
          var todoList = parseResult['todo-lists']['todo-list'];

          todoList.forEach(function (todo) {
            var id = todo.id[0]._,
                name = todo.name[0];

            _this7.todoItems(id, name);
          });
        });
      });
    }
  }, {
    key: '_todoItems',
    value: function _todoItems(id, name) {
      var _this8 = this;

      var params = { url: this.endpoint + '/todo_lists/' + id + '.xml' };

      _request2['default'].get(Object.assign(params, this.getBaseParams()), function (error, resp, body) {
        if (error) {
          console.error(error);
          return;
        }

        (0, _xml2js.parseString)(body, function (parseError, parseResult) {
          var todoItems = parseResult['todo-list']['todo-items'][0]['todo-item'];

          _this8.printTodoList(name, todoItems);
        });
      });
    }
  }, {
    key: '_timeReport',
    value: function _timeReport(_ref3, cb) {
      var todoId = _ref3.todoId;
      var personId = _ref3.personId;
      var date = _ref3.date;
      var hours = _ref3.hours;
      var description = _ref3.description;

      var params = {
        'person-id': personId,
        'date': date,
        'hours': hours,
        'description': description
      };

      var xmlParams = new _js2xml.Js2Xml('time-entry', params);

      var paramsUrl = {
        url: '' + this.endpoint + BASECAMP_TODO_PATH + '/' + todoId + '/time_entries.xml',
        body: xmlParams.toString()
      };

      _request2['default'].post(Object.assign(paramsUrl, this.getBaseParams()), function (error) {
        if (error) {
          return console.error(error);
        }

        if (cb) {
          cb();
        }
      });
    }
  }]);

  return BasecampAPI;
})();

exports['default'] = BasecampAPI;
module.exports = exports['default'];