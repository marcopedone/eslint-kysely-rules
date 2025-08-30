const { RuleTester } = require("eslint");
const rule = require("./null");

const ruleTester = new RuleTester({
  languageOptions: { ecmaVersion: 2015 },
});

ruleTester.run(
  "enforce-null",
  rule,
  {
    valid: [
      {
        code: "trx.selectFrom('name').select(['field']).where('something', 'is', null).execute()",
      },
      {
        code: "trx.selectFrom('name').select(['field']).where('something', 'is not', null).execute()",
      },
    ],
    invalid: [
      {
        code: "trx.selectFrom('name').select(['field']).where('something', '=', null).execute()",
        errors: 1,
        output:
          "trx.selectFrom('name').select(['field']).where('something', 'is', null).execute()",
      },
      {
        code: "trx.selectFrom('name').select(['field']).where('something', '==', null).execute()",
        errors: 1,
        output:
          "trx.selectFrom('name').select(['field']).where('something', 'is', null).execute()",
      },
      {
        code: "trx.selectFrom('name').select(['field']).where('something', '!=', null).execute()",
        errors: 1,
        output:
          "trx.selectFrom('name').select(['field']).where('something', 'is not', null).execute()",
      },
      {
        code: "trx.selectFrom('name').select(['field']).where('something', '!==', null).execute()",
        errors: 1,
        output:
          "trx.selectFrom('name').select(['field']).where('something', 'is not', null).execute()",
      },
      {
        code: "trx.selectFrom('name').select(['field']).where('something', 'is', null).where('something2', '=', null).execute()",
        errors: 1,
        output:
          "trx.selectFrom('name').select(['field']).where('something', 'is', null).where('something2', 'is', null).execute()",
      },
    ],
  },
);

console.log("EnforceNull: All tests passed!");
