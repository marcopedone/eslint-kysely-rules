//@ts-nocheck
module.exports = {
  meta: {
    type: "problem",
    docs: {
      description:
        "Ensures that any call chain which affects a table also includes a 'where' clause.",
    },
    fixable: "code",
    schema: [], // no options
  },
  create(context) {
    const sourceCode = context.sourceCode;

    if (!/\.updateTable\(|\.deleteFrom\(/.test(sourceCode.text)) {
      // Skip
      return {};
    }

    return {
      ExpressionStatement(node) {
        evaluate(node.expression, sourceCode.getTokens(node));
      },
      AwaitExpression(node) {
        evaluate(node.argument, sourceCode.getTokens(node));
      },
    };

    function evaluate(expression, nodes) {
      if (!expression || expression.type !== "CallExpression") {
        return true;
      }

      const hasUpdateOrDelete = nodes.some(
        (token) =>
          token.value === "updateTable" || token.value === "deleteFrom",
      );

      if (hasUpdateOrDelete) {
        const hasWhere = nodes.some((token) => token.value === "where");

        if (!hasWhere) {
          const message = `Call chains containing "updateTable" or "deleteFrom" must also include a "where" clause.`;
          context.report({
            node: expression,
            message,
          });
        }
      }
    }
  },
};
