import postcssValueParser from "postcss-value-parser";

const valueParser = postcssValueParser;

const addSpaceForEmptyVarFallback = () => {
  return {
    postcssPlugin: "postcss-add-space-for-empty-var-fallback",
    OnceExit(root) {
      root.walkDecls((decl) => {
        if (!decl.value || !decl.value.includes("var(")) {
          return;
        }

        const parsed = valueParser(decl.value);
        let changed = false;

        parsed.walk((node) => {
          if (node.type === "function" && node.value === "var") {
            const commaIndex = node.nodes.findIndex(
              (n) => n.type === "div" && n.value === ",",
            );
            if (commaIndex === -1) return;

            const fallbackNodes = node.nodes.slice(commaIndex + 1);
            const fallbackText = fallbackNodes
              .map((n) => n.value)
              .join("")
              .trim();

            if (fallbackText === "") {
              const commaNode = node.nodes[commaIndex];
              if (commaNode.value === ",") {
                commaNode.value = ", ";
                changed = true;
              }
            }
          }
        });

        if (changed) {
          decl.value = parsed.toString();
        }
      });
    },
  };
};

addSpaceForEmptyVarFallback.postcss = true;

export default addSpaceForEmptyVarFallback;
