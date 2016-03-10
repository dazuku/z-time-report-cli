'use string';

export function getPrefix(userArgs, {short, long}, config = {}) {
  let index = config.index || -1;
  let value = config.value || '';

  userArgs.find((arg, i) => {
    const condition = arg === `-${short}` || arg === `--${long}`;

    index = condition ? i + 1 : index;
    return condition;
  });

  value = index > 0 ? userArgs[index] : value;

  return { value, index };
}
