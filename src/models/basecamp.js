'use string';

import requestURL from 'request';
import { parseString } from 'xml2js';
import { Js2Xml } from 'js2xml';
import { TimeReport } from './database';

const BASECAMP_PROJECT_PATH = '/projects';
const BASECAMP_TODO_PATH = '/todo_items';

export default class BasecampAPI {
  constructor() {
    this.config = new TimeReport().getConfig;
  }

  configCallback({ BASECAMP_PROTOCOL, BASECAMP_TOKEN, BASECAMP_DOMAIN }) {
    this.endpoint = `${BASECAMP_PROTOCOL}${BASECAMP_TOKEN}@${BASECAMP_DOMAIN}`;
  }

  getBaseParams() {
    return {
      headers: {
        'User-Agent': 'Andres Garcia Reports (andres@zemoga.com)',
        'Content-Type': 'text/xml'
      }
    };
  }

  printIdAndName({ id, name }) {
    console.log(`${id}:  ${name}`);
  }


  printTodoList(name, todoItems) {
    console.log(`\n${name}`);

    todoItems.forEach((todo) => {
      const id = todo.id[0]._,
        name = todo.content[0];

      this.printIdAndName({ id, name });
    });
  }

  projects() {
    this.config().then((config) => {
      this.configCallback(config);
      this._projects();
    });
  }

  todoLists(id) {
    this.config().then((config) => {
      this.configCallback(config);
      this._todoLists(id);
    });
  }

  todoItems(id, name) {
    this.config().then((config) => {
      this.configCallback(config);
      this._todoItems(id, name);
    });
  }

  timeReport(params, cb) {
    this.config().then((config) => {
      this.configCallback(config);
      this._timeReport(params, cb);
    });
  }

  _projects() {
    const params = { url: `${this.endpoint}${BASECAMP_PROJECT_PATH}.xml` };

    requestURL.get(Object.assign(params, this.getBaseParams()), (error, resp, body) => {
      if (error) {
        return console.error(error);
      }

      parseString(body, (parseError, parseResult) => {
        const projects = parseResult.projects.project;

        projects.forEach((project) => {
          const id = project.id[0]._,
            name = project.name[0];

          this.printIdAndName({ id, name });
        });
      });
    });
  }

  _todoLists(id) {
    const params = { url: `${this.endpoint}${BASECAMP_PROJECT_PATH}/${id}/todo_lists.xml` };

    requestURL.get(Object.assign(params, this.getBaseParams()), (error, resp, body) => {
      if (error) {
        return console.error(error);
      }

      parseString(body, (parseError, parseResult) => {
        const todoList = parseResult['todo-lists']['todo-list'];

        todoList.forEach((todo) => {
          const id = todo.id[0]._,
            name = todo.name[0];

          this.todoItems(id, name);
        });
      });
    });
  }

  _todoItems(id, name) {
    const params = { url: `${this.endpoint}/todo_lists/${id}.xml` };

    requestURL.get(Object.assign(params, this.getBaseParams()), (error, resp, body) => {
      if (error) {
        console.error(error);
        return;
      }

      parseString(body, (parseError, parseResult) => {
        const todoItems = parseResult['todo-list']['todo-items'][0]['todo-item'];

        this.printTodoList(name, todoItems);
      });
    });
  }

  _timeReport({ todoId, personId, date, hours, description }, cb) {
    const params = {
      'person-id': personId,
      'date': date,
      'hours': hours,
      'description': description
    };

    const xmlParams = new Js2Xml('time-entry', params);

    const paramsUrl = {
      url: `${this.endpoint}${BASECAMP_TODO_PATH}/${todoId}/time_entries.xml`,
      body: xmlParams.toString()
    };

    requestURL.post(Object.assign(paramsUrl, this.getBaseParams()), (error) => {
      if (error) {
        return console.error(error);
      }

      if (cb) {
        cb();
      }
    });
  }
}
