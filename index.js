const utils = require("./utils");
const types = require("./types");

function env(setup, vars = process.env) {
  const config = {};
  const proxy = new Proxy(config, {get: proxyGetHandler, set: proxySetHandler});

  const mandatory = (...args) => utils.mandatory(vars, config, ...args);
  const optional = (...args) => utils.optional(vars, config, ...args);
  const property = (...args) => utils.property(config, ...args);

  setup({mandatory, optional, property});

  return proxy;
}

function proxyGetHandler(target, property) {
  if (property in target) {
    return target[property];
  } else {
    throw new Error(`"${property}" is not a registered configuration.`);
  }
}

function proxySetHandler(target, property, value) {
  throw new Error(`Configuration is read-only ("${property}" was assigned).`);
}

module.exports = {env,...types};
