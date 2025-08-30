const { RuleTester } = require("eslint");
const rule = require("./select");

const ruleTester = new RuleTester({
  languageOptions: { ecmaVersion: 2015 },
});

ruleTester.run(
  "enforce-select",
  rule,
  {
    valid: [
      {
        code: "trx.selectFrom('name').select(['field']).where('something', '=', 'something').execute()",
      },
      {
        code: "trx.selectFrom('name').selectAll().where('something', '=', 'something').execute()",
      },
    ],
    invalid: [
      {
        code: "trx.selectFrom('name').where('something', '=', 'something').execute()",
        errors: 1,
        output:
          "trx.selectFrom('name').selectAll().where('something', '=', 'something').execute()",
      },
    ],
  },
);

console.log("EnforceSelect: All tests passed!");
