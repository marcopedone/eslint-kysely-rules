//@ts-nocheck
module.exports = {
  meta: {
    type: "suggestion",
    docs: {
      description: "Description of the rule",
    },
    fixable: "code",
    schema: [], // no options
  },
  create(context) {
    const sourceCode = context.sourceCode;
    if (!/\.selectFrom\(/.test(sourceCode.text)) {
      // Skip
      return {};
    }
    function evaluate(expression, nodes) {
      if (!expression || expression.type !== "CallExpression") {
        return true;
      }

      const hasSelectFrom = nodes.some((token) => token.value === "selectFrom");

      if (hasSelectFrom) {
        const hasSelect = nodes.some(
          (token) => token.value === "select" || token.value === "selectAll",
        );

        if (!hasSelect) {
          let closingParenthesisNode = null;
          const selectNodeIndex = nodes.findIndex(
            (token) => token.value === "selectFrom",
          );
          if (selectNodeIndex !== -1) {
            closingParenthesisNode = nodes
              .slice(selectNodeIndex)
              .find((token) => token.value === ")");
          }
          context.report({
            node: expression,
            message: `Call chains containing "selectFrom" must also include a "select" or "selectAll" clause.`,
            fix: (fixer) => {
              return fixer.insertTextAfter(
                closingParenthesisNode || nodes[6],
                ".selectAll()",
              );
            },
          });
        }
      }
    }
    return {
      ExpressionStatement(node) {
        evaluate(node.expression, sourceCode.getTokens(node));
      },
      AwaitExpression(node) {
        evaluate(node.argument, sourceCode.getTokens(node));
      },
    };
  },
};
