const { RuleTester } = require("eslint");
const rule = require("./where");

const ruleTester = new RuleTester({
  languageOptions: { ecmaVersion: 2015 },
});

ruleTester.run(
  "enforce-where",
  rule,
  {
    valid: [
      {
        code: "trx.updateTable('name').set({foo:'bar'}).where('something', '=', 'something').execute()",
      },
    ],
    invalid: [
      {
        code: "trx.updateTable('name').set({foo:'bar'}).execute()",
        errors: 1,
      },
    ],
  },
);

console.log("EnforceWhere: All tests passed!");
