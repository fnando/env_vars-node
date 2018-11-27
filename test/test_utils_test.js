const {assert} = require("chai");
const {env, int} = require("../index");
const {stub, restore} = require("../testing");

suite("@fnando/env_vars => test utils", () => {
  test("stub optional value", () => {
    const config = env(({optional}) => optional("NUMBER", int, 1234));

    stub(config, "number", 4321);
    assert.strictEqual(4321, config.number);

    restore();
    assert.strictEqual(1234, config.number);
  });

  test("stub mandatory value", () => {
    process.env.NUMBER = "1234";
    const config = env(({mandatory}) => mandatory("NUMBER", int));

    stub(config, "number", 4321);
    assert.strictEqual(4321, config.number);

    restore();

    process.env.NUMBER = "9876";
    assert.strictEqual(9876, config.number);

    delete process.env.NUMBER;
  });

  test("stub property", () => {
    const values = [1, 2, 3];
    const config = env(({property}) => property("number", () => values.pop()));

    stub(config, "number", 4321);
    assert.strictEqual(4321, config.number);

    restore();

    assert.strictEqual(3, config.number);
    assert.strictEqual(2, config.number);
    assert.strictEqual(1, config.number);
  });

  test("nested stubs", () => {
    const config = env(({optional}) => optional("NUMBER", int, 1234));

    stub(config, "number", 4321);
    stub(config, "number", 9876);

    assert.strictEqual(9876, config.number);

    restore();

    assert.strictEqual(1234, config.number);
  });

  test("stub missing property", () => {
    const config = env(() => {});

    assert.throws(() => {
      stub(config, "number", 4321);
    }, "You can't stub a configuration that's not defined (\"number\")");
  });
});
