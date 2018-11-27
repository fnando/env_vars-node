// Recognized types
const string = ["string"];
const float = ["float"];
const bool = ["bool"];
const int = ["int"];
const array = (type = ["string"]) => ["array", ...type];

module.exports = {
  string,
  float,
  bool,
  int,
  array
};
