//@ts-nocheck
module.exports = {
  meta: {
    type: "problem",
    docs: {
      description:
        "Ensure that all where condition that thest for null values utilize the correct operators.",
    },
    fixable: "code",
    schema: [], // no options
  },
  create(context) {
    const sourceCode = context.sourceCode;
    const reportedNodes = new Set();
    if (!/\.where\(/.test(sourceCode.text)) {
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

    function Check(expression, operator) {
      const forbiddenOperators = [
        "'='",
        "'=='",
        "'!='",
        "'!=='",
        '"="',
        '"=="',
        '"!="',
        '"!=="',
      ];

      if (forbiddenOperators.includes(operator.value)) {
        const message = `The where condition is testing for null using the ${operator.value} operator. Ensure this is intentional and uses the correct operator.`;

        context.report({
          node: expression,
          message,
          fix: (fixer) => {
            const correctOperator =
              operator.value === "'='" ||
              operator.value === "'=='" ||
              operator.value === '"="' ||
              operator.value === '"=="'
                ? "'is'"
                : "'is not'";
            return fixer.replaceText(operator, correctOperator);
          },
        });
      }
    }
    function findNodes(expression, node, nodes) {
      const nullNodes = nodes.filter((token) => token.value === "null");
      if (nullNodes.length === 0) {
        return;
      }
      for (let i = 0; i < nullNodes.length; i++) {
        const nullNode = nullNodes[i];

        // Avoid duplicate reports
        if (reportedNodes.has(nullNode)) {
          continue;
        }
        reportedNodes.add(nullNode);

        const operator = sourceCode.getTokensBefore(nullNode, 2)[0];

        if (!operator) {
          return;
        }
        Check(expression, operator);
      }
    }

    function evaluate(expression, nodes) {
      if (!expression || expression.type !== "CallExpression") {
        return true;
      }

      const whereNodes = nodes.filter((token) => token.value === "where");

      if (whereNodes.length === 0 || !whereNodes) {
        return;
      }

      if (whereNodes.length === 1) {
        findNodes(expression, whereNodes[0], nodes);

        return;
      }

      for (let i = 0; i < whereNodes.length; i++) {
        const whereNode = whereNodes[i];
        findNodes(expression, whereNode, nodes);
      }
      return;
    }
  },
};
