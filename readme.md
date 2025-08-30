# eslint-kysely-rules

Example ESLint rules for Kysely query builder.

To use in a project, put in directory and add to ESLint config:

```js
import kysely-rules from "path-to-rules-folder/plugin.js";
{
  "plugins": {kysely-rules: kysely-rules},
  "rules": {
    "kysely-rules/enforce-select": "error",
    "kysely-rules/enforce-null": "error",
    "kysely-rules/enforce-where": "error"
  }
}
```

package.json included for testing standalone.