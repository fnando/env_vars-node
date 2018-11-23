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
#=> "value"
```

Note: If your env var has the words `SSL` or `URL`, then case will be honoured. `FORCE_SSL` and `REDIS_URL` will be available as `forceSSL` and `redisURL` respectively.

### Types

You can coerce values to the following types:

- `string`: Is the default. E.g. `optional("name", string)`.
- `int`: E.g. `optional("timeout", int)`.
- `float`: E.g. `optional("wait", float)`.
- `bool`: E.g. `optional("force_ssl", bool)`. Any of `yes`, `true` or `1` is considered as `true`. Any other value will be coerced to `false`.
- `array`: E.g. `optional("chars", array())` or `optional("numbers", array(int))`. The environment variable must be something like `a,b,c`.

## Development

Run `yarn test` to run the tests.

## Contributing

Bug reports and pull requests are welcome on GitHub at https://github.com/fnando/env_vars-node. This project is intended to be a safe, welcoming space for collaboration, and contributors are expected to adhere to the [Contributor Covenant](contributor-covenant.org) code of conduct.

## License

The package is available as open source under the terms of the [MIT License](http://opensource.org/licenses/MIT).
