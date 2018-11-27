const {string, int, bool, array, float} = require("./types");
const boolTrue = ["yes", "true", "1", true];

function set(vars, config, name, type, defaultValue, options) {
  const {required, aliases} = options;
  const attrs = [...aliases, getAttrName(name)];

  validate(vars, name, required);

  attrs.forEach(attr => {
    property(config, attr, () => {
      if (!(name in vars)) {
        return defaultValue;
      }

      return coerce(type, vars[name]);
    });
  });
}

function toArray(value, type) {
  return value.split(/, */).map(v => coerce([type], v));
}

function toString(value) {
  return String(value).toString();
}

function toInt(value) {
  const coercedValue = parseInt(value, 10);

  if (isNaN(coercedValue)) {
    throw new Error(`invalid value for integer: "${value}"`);
  }

  return coercedValue;
}

function toFloat(value) {
  const coercedValue = parseFloat(value);

  if (isNaN(coercedValue)) {
    throw new Error(`invalid value for float: "${value}"`);
  }

  return coercedValue;
}

function toBool(value) {
  return boolTrue.includes(value);
}

function coerce(type, value) {
  [type, subtype] = type;

  if (type === "array") {
    return toArray(value, subtype);
  } else if (type === "int") {
    return toInt(value);
  } else if (type === "float") {
    return toFloat(value);
  } else if (type === "bool") {
    return toBool(value);
  } else {
    return toString(value);
  }
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

function mandatory(vars, config, name, type, options = {aliases: []}) {
  set(vars, config, name, type, null, {...options, required: true});
}

function optional(vars, config, name, type, defaultValue = null, options = {aliases: []}) {
  set(vars, config, name, type, defaultValue, {...options, required: false});
}

function property(config, name, func) {
  Object.defineProperty(config, name, {
    configurable: true,
    enumerable: true,
    get() {
      return func();
    }
  });
}

module.exports = {
  mandatory,
  optional,
  property
};
