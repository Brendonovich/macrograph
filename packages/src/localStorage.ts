import { core, types } from "@macrograph/core";

const pkg = core.createPackage({
  name: "Localstorage",
});

pkg.createNonEventSchema({
  name: "Set Data",
  variant: "Exec",
  generateIO: (t) => {
    t.dataInput({
      id: "key",
      name: "Key",
      type: types.string(),
    });
    t.dataInput({
      id: "value",
      name: "Value",
      type: types.string(),
    });
  },
  run({ ctx }) {
    localStorage.setItem(`value-${ctx.getInput("key")}`, ctx.getInput("value"));
  },
});

pkg.createNonEventSchema({
  name: "Get Data",
  variant: "Pure",
  generateIO: (t) => {
    t.dataInput({
      id: "key",
      name: "Key",
      type: types.string(),
    });
    t.dataOutput({
      id: "output",
      name: "Data",
      type: types.option(types.string()),
    });
  },
  run({ ctx }) {
    let data = localStorage.getItem(`value-${ctx.getInput("key")}`);
    ctx.setOutput("exists", data !== null);
    if (data !== null) ctx.setOutput("output", data);
  },
});