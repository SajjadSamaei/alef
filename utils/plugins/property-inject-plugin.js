import postcss from "postcss";

const propertyInjectPlugin = () => {
  return {
    postcssPlugin: "postcss-property-polyfill",
    Once(root) {
      const fallbackRules = [];
      root.walkAtRules("property", (rule) => {
        const declarations = {};
        let varName = null;

        rule.walkDecls((decl) => {
          if (decl.prop === "initial-value") {
            varName = rule.params.trim();
            declarations[varName] = decl.value;
          }
        });

        if (varName) {
          fallbackRules.push(`${varName}: ${declarations[varName]};`);
        }
      });

      if (fallbackRules.length > 0) {
        const fallbackCSS = `@supports not (background: paint(something)) {
          :root { ${fallbackRules.join(" ")} }
        }`;

        const sourceFile = root.source?.input?.file || root.source?.input?.from;
        const fallbackAst = postcss.parse(fallbackCSS, { from: sourceFile });

        let lastImportIndex = -1;
        root.nodes.forEach((node, i) => {
          if (node.type === "atrule" && node.name === "import") {
            lastImportIndex = i;
          }
        });

        if (lastImportIndex === -1) {
          root.prepend(fallbackAst);
        } else {
          root.insertAfter(root.nodes[lastImportIndex], fallbackAst);
        }
      }
    },
  };
};

propertyInjectPlugin.postcss = true;

export default propertyInjectPlugin;
