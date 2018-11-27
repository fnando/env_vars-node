const {property} = require("./utils");
const restores = [];

function stub(config, name, value) {
  const descriptor = Object.getOwnPropertyDescriptor(config, name);

  if (!descriptor) {
    throw new Error(`You can't stub a configuration that's not defined ("${name}")`);
  }

  property(config, name, () => value);
  restores.push(() => Object.defineProperty(config, name, descriptor));
}

function restore() {
  let func;

  while ((func = restores.pop())) {
    func();
  }
}

module.exports = {
  stub,
  restore
};
