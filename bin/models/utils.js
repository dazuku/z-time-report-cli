'use strict';

'use string';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.getPrefix = getPrefix;

function getPrefix(userArgs, _ref) {
  var short = _ref.short;
  var long = _ref.long;
  var config = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

  var index = config.index || -1;
  var value = config.value || '';

  userArgs.find(function (arg, i) {
    var condition = arg === '-' + short || arg === '--' + long;

    index = condition ? i + 1 : index;
    return condition;
  });

  value = index > 0 ? userArgs[index] : value;

  return { value: value, index: index };
}