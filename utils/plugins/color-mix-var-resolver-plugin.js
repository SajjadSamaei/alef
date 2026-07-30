const postcssValueParser = require("postcss-value-parser");

const colorMixVarResolverPlugin = () => {
  return {
    postcssPlugin: "postcss-color-mix-var-resolver",
    Once(root) {
      const cssVariables = {};

      root.walkRules((rule) => {
        if (!rule.selectors) return;

        const isRootOrHost = rule.selectors.some(
          (sel) => sel.includes(":root") || sel.includes(":host"),
        );

        if (isRootOrHost) {
          rule.walkDecls((decl) => {
            if (decl.prop.startsWith("--")) {
              cssVariables[decl.prop] = decl.value.trim();
            }
          });
        }
      });

      root.walkDecls((decl) => {
        const originalValue = decl.value;
        if (!originalValue || !originalValue.includes("color-mix(")) return;

        const parsed = postcssValueParser(originalValue);
        let modified = false;

        parsed.walk((node) => {
          if (node.type === "function" && node.value === "color-mix") {
            node.nodes.forEach((childNode) => {
              if (
                childNode.type === "function" &&
                childNode.value === "var" &&
                childNode.nodes.length > 0
              ) {
                const varName = childNode.nodes[0]?.value;
                if (!varName) return;

                const resolvedVarName =
                  cssVariables[varName] === undefined
                    ? "black"
                    : cssVariables[varName];
                const resolved = `${resolvedVarName} ` || `var(${varName})`;

                childNode.type = "word";
                childNode.value = resolved;
                childNode.nodes = [];
                modified = true;
              }
            });
          }
        });

        if (modified) {
          decl.value = parsed.toString();
        }
      });
    },
  };
};

colorMixVarResolverPlugin.postcss = true;

module.exports = colorMixVarResolverPlugin;
