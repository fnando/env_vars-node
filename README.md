# @fnando/env_vars

Access environment variables. Also includes presence validation, type coercion and default values.

[![Travis-CI](https://travis-ci.org/fnando/env_vars-node.svg)](https://travis-ci.org/fnando/env_vars-node)
[![NPM package version](https://img.shields.io/npm/v/@fnando/env_vars.svg)](https://www.npmjs.com/package/@fnando/env_vars)
[![License: MIT](https://img.shields.io/npm/l/@fnando/env_vars.svg)](https://tldrlegal.com/license/mit-license)

## Installation

```
yarn add -E @fnando/env_vars
```

## Usage

```js
// config.js
import {env, int, bool, string} from "@fnando/env_vars"

const config = env(({mandatory, optional}) => {
  mandatory("DATABASE_URL", string);
  optional("TIMEOUT", int, 10);
  optional("FORCE_SSL", bool, false);
  optional("NODE_ENV", string, "development", {aliases: ["env"]});
});

export default config;

// app.js
import config from "./config";
config.databaseURL
config.timeout
config.forceSSL
```

You can also set arbitrary properties, like the following:

```js
// config.js
import {env, string} from "@fnando/env_vars"
import redis from "redis"

const config = env(({property, optional}) => {
  optional("REDIS_URL", string, "redis://127.0.0.1");
  property("redis", () => redis.createClient(config.redisURL));
});

// app.js
import config from "./config";
import {print} from "redis";

config.redis.set("key", "value", print);
config.redis.get("key", print);
//=> "value"
```

### Missing properties & assignment

An exception is thrown for properties that weren't registered:

```js
config.missing
//=> throws `"missing" is not a registered configuration.`
```

You're also not allowed to assign properties to the config object.

```js
config.name = "John";
//=> throws `Configuration is read-only ("name" was assigned).`
```

### Acronyms

`@fnando/env_vars` supports a small list of acronyms (words that will be set as uppercased in property names). Words like `URL` and `SSL` will be returned as it is (e.g. `REDIS_URL` will be defined as `config.redisURL`). The full list is available at <https://github.com/fnando/env_vars-node/blob/master/acronyms.js>. You can add new words to the list by loading `@fnando/env_vars/acronyms` like the following:

```js
import {env, string} from "@fnando/env_vars"
import {acronyms} from "@fnando/env_vars/acronyms";

acronyms.push("RTSP");

const config = env(({optional}) => {
  optional("RTSP_SERVER", string, "rtsp://127.0.0.1");
});

config.RTSPServer
```

### Types

You can coerce values to the following types:

- `string`: Is the default. E.g. `optional("name", string)`.
- `int`: E.g. `optional("timeout", int)`.
- `float`: E.g. `optional("wait", float)`.
- `bool`: E.g. `optional("force_ssl", bool)`. Any of `yes`, `true` or `1` is considered as `true`. Any other value will be coerced to `false`.
- `array`: E.g. `optional("chars", array())` or `optional("numbers", array(int))`. The environment variable must be something like `a,b,c`.

### Testing

To stub properties in tests, you can import `stub` and `restore`:

```js
import {env, int} from "@fnando/env_vars";
import {stub, restore} from "@fnando/env_vars/testing";

const config = env(({optional}) => optional("NUMBER", int, 1234));
config.number
//=> 1234

stub(config, "number", 4321);
config.number
//=> 4321

restore();

config.number
//=> 1234
```

## Development

Run `yarn test` to run the tests.

## Contributing

Bug reports and pull requests are welcome on GitHub at https://github.com/fnando/env_vars-node. This project is intended to be a safe, welcoming space for collaboration, and contributors are expected to adhere to the [Contributor Covenant](contributor-covenant.org) code of conduct.

## License

The package is available as open source under the terms of the [MIT License](http://opensource.org/licenses/MIT).
