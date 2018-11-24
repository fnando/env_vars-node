const {assert} = require("chai");
const {
  env,
  string,
  float,
  array,
  bool,
  int
} = require("../index");

suite("@fnando/env_vars", () => {
  test("mandatory with set value", () => {
    const config = env(({mandatory}) => {
      mandatory("APP_NAME", string);
    }, {APP_NAME: "myapp"});

    assert.strictEqual("myapp", config.appName);
  });

  test("mandatory without value raises exception", () => {
    assert.throws(() => {
      const config = env(({mandatory}) => {
        mandatory("APP_NAME", string);
      }, {});
    }, "APP_NAME is not defined");
  });

  test("optional with set value", () => {
    const config = env(({optional}) => {
      optional("APP_NAME", string);
    }, {APP_NAME: "myapp"});

    assert.strictEqual("myapp", config.appName);
  });

  test("define optional", () => {
    const config = env(({optional}) => {
      optional("APP_NAME", string);
    }, {});

    assert.isNull(config.appName);
  });

  test("define optional with default value", () => {
    const config = env(({optional}) => {
      optional("APP_NAME", string, "myapp");
    }, {});

    assert.strictEqual("myapp", config.appName);
  });

  test("coerce float", () => {
    const config = env(({mandatory}) => {
      mandatory("WAIT", float);
    }, {WAIT: "1.2"});

    assert.strictEqual(1.2, config.wait);
  });

  test("do not coerce nil values to float", () => {
    const config = env(({optional}) => {
      optional("WAIT", float);
    }, {});

    assert.isNull(config.wait);
  });

  test("coerce array", () => {
    const config = env(({mandatory}) => {
      mandatory("CHARS", array());
    }, {CHARS: "a, b, c"});

    assert.deepEqual(["a", "b", "c"], config.chars);
  });

  test("coerce array (without spaces)", () => {
    const config = env(({mandatory}) => {
      mandatory("CHARS", array());
    }, {CHARS: "a,b,c"});

    assert.deepEqual(["a", "b", "c"], config.chars);
  });

  test("coerce array and items", () => {
    const config = env(({mandatory}) => {
      mandatory("NUMBERS", array(float));
    }, {NUMBERS: "1.1,1.2,1.3"});

    assert.deepEqual([1.1, 1.2, 1.3], config.numbers);
  });

  test("do not coerce nil values to array", () => {
    const config = env(({optional}) => {
      optional("CHARS", array(string));
    }, {});

    assert.isNull(config.chars);
  });

  test("return default boolean", () => {
    const config = env(({optional}) => {
      optional("FORCE_SSL", bool, true);
    }, {});

    assert.strictEqual(true, config.forceSSL);
  });

  test("coerce bool value", () => {
    ["yes", "true", "1"].forEach(value => {
      const config = env(({mandatory}) => {
        mandatory("FORCE_SSL", bool);
      }, {FORCE_SSL: value});

      assert.strictEqual(true, config.forceSSL);
    });

    ["no", "false", "0"].forEach(value => {
      const config = env(({mandatory}) => {
        mandatory("FORCE_SSL", bool);
      }, {FORCE_SSL: value});

      assert.strictEqual(false, config.forceSSL);
    });
  });

  test("coerce int value", () => {
    const config = env(({mandatory}) => {
      mandatory("TIMEOUT", int);
    }, {TIMEOUT: 10});

    assert.strictEqual(10, config.timeout);
  });

  test("raise exception with invalid int", () => {
    const config = env(({mandatory}) => {
      mandatory("TIMEOUT", int);
    }, {TIMEOUT: "invalid"});

    assert.throws(() => config.timeout, "invalid value for integer: \"invalid\"");
  });

  test("raise exception with invalid float", () => {
    const config = env(({mandatory}) => {
      mandatory("WAIT", float);
    }, {WAIT: "invalid"});

    assert.throws(() => config.wait, "invalid value for float: \"invalid\"");
  });

  test("create alias", () => {
    const config = env(({mandatory}) => {
      mandatory("NODE_ENV", string, {aliases: ["env"]});
    }, {NODE_ENV: "production"});

    assert.strictEqual("production", config.nodeEnv);
    assert.strictEqual("production", config.env);
  });

  test("get all caps variable", () => {
    const config = env(({mandatory}) => {
      mandatory("TZ", string);
    }, {TZ: "Etc/UTC"});

    assert.strictEqual("Etc/UTC", config.tz);
  });

  test("consider acronyms", () => {
    const acronyms = require("../acronyms");

    const config = env(({optional}) => {
      acronyms.forEach(acronym => optional(`PREFIX_${acronym}_SUFFIX`, string, acronym));
    }, {});


    acronyms.forEach(acronym => {
      assert.strictEqual(acronym, config[`prefix${acronym}Suffix`])
    });
  });

  test("add custom acronym", () => {
    const acronyms = require("../acronyms");
    acronyms.push("RTSP");

    const config = env(({mandatory}) => {
      mandatory("RTSP_SERVER", string);
    }, {RTSP_SERVER: "rtsp://example.com"});

    assert.strictEqual("rtsp://example.com", config.RTSPServer);

    acronyms.pop();
  });

  test("set arbitrary property", () => {
    const config = env(({property}) => {
      property("number", () => 1234);
    }, {});

    assert.strictEqual(1234, config.number);
  });

  test("raise error for missing configuration", () => {
    const config = env(({property}) => {
      property("number", () => 1234);
    }, {});

    assert.throws(() => {
      config.missing;
    }, "\"missing\" is not a registered configuration.");
  });

  test("raise error when assigning configuration", () => {
    const config = env(({property}) => {
    }, {});

    assert.throws(() => {
      config.prop = 1234;
    }, "Configuration is read-only (\"prop\" was assigned).");
  });
});
