const plugin = {
  meta: {
    name: "eslint-kysely-rules",
    version: "1.0.0",
  },
  configs: {},
  rules: {
    "enforce-select": require("./rules/select"),
    "enforce-where": require("./rules/where"),
    "enforce-null": require("./rules/null"),
  },
  processors: {},
};

module.exports = plugin;
