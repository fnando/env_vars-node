// Recognized types
const string = "string";
const float = "float";
const bool = "bool";
const int = "int";
const array = (type = "string") => ["array", type];

const boolTrue = ["yes", "true", "1", true];

function env(setup, vars = process.env) {
  const config = {};
  const mandatory = (...args) => $mandatory(vars, config, ...args);
  const optional = (...args) => $optional(vars, config, ...args);
  const property = (...args) => $property(config, ...args);

  setup({mandatory, optional, property});

  return config;
}

function set(vars, config, name, type, defaultValue, options) {
  const {required, aliases} = options;
  const attrs = [...aliases, getAttrName(name)];

  validate(vars, name, required);

  attrs.forEach(attr => {
    Object.defineProperty(config, attr, {
      configurable: false,
      enumerable: true,
      get() {
        if (!(name in vars)) {
          return defaultValue;
        }

        return coerce(type, vars[name]);
      }
    });
  });
}

function coerce(type, value) {
  if (type && type.constructor === Array) {
    return value.split(/, */).map(v => coerce(type[1], v));
  }

  if (type === int) {
    const coercedValue = parseInt(value, 10);

    if (isNaN(coercedValue)) {
      throw new Error(`invalid value for integer: "${value}"`);
    }

    return coercedValue;
  }

  if (type === float) {
    const coercedValue = parseFloat(value);

    if (isNaN(coercedValue)) {
      throw new Error(`invalid value for float: "${value}"`);
    }

    return coercedValue;
  }

  if (type === bool) {
    return boolTrue.includes(value);
  }

  return value;
}

function validate(vars, name, required) {
  if (!required) {
    return;
  }

  if ((name in vars)) {
    return;
  }

  throw new Error(`${name} is not defined`);
}

function getAttrName(value) {
  const acronyms = require("./acronyms");
  const words = value.split("_");

  return words.map((word, index) => {
    word = word.toLowerCase();
    const acronym = word.toUpperCase();

    if (acronyms.includes(acronym)) {
      return acronym;
    } else if (index === 0) {
      return word;
    } else {
      return word[0].toUpperCase() + word.substr(1);
    }
  }).join("");
}

function $mandatory(vars, config, name, type, options = {aliases: []}) {
  set(vars, config, name, type, null, {...options, required: true});
}

function $optional(vars, config, name, type, defaultValue = null, options = {aliases: []}) {
  set(vars, config, name, type, defaultValue, {...options, required: false});
}

function $property(config, name, func) {
  Object.defineProperty(config, name, {
    configurable: false,
    enumerable: true,
    get() {
      return func();
    }
  });
}

module.exports = {
  env,
  string,
  float,
  array,
  bool,
  int
};
