import postcss from "postcss";
const transformShortcutPlugin = () => {
  return {
    postcssPlugin: "postcss-transform-shortcut",
    Once(root) {
      const defaults = {
        rotate: [0, 0, 1, "0deg"],
        scale: [1, 1, 1],
        translate: [0, 0, 0],
      };

      const fallbackAtRule = postcss.atRule({
        name: "supports",
        params: "not (translate: 0)",
      });

      root.walkRules((rule) => {
        let hasTransformShorthand = false;
        const transformFunctions = [];

        rule.walkDecls((decl) => {
          if (/^(rotate|scale|translate)$/.test(decl.prop)) {
            hasTransformShorthand = true;

            const newValues = [...defaults[decl.prop]];
            const value = decl.value.replaceAll(/\)\s*var\(/g, ") var(");
            const userValues = postcss.list.space(value);

            if (decl.prop === "rotate" && userValues.length === 1) {
              newValues.splice(-1, 1, ...userValues);
            } else {
              newValues.splice(0, userValues.length, ...userValues);
            }

            transformFunctions.push(`${decl.prop}3d(${newValues.join(",")})`);
          }
        });

        if (hasTransformShorthand && transformFunctions.length > 0) {
          const fallbackRule = postcss.rule({ selector: rule.selector });

          fallbackRule.append({
            prop: "transform",
            value: transformFunctions.join(" "),
          });

          fallbackAtRule.append(fallbackRule);
        }
      });

      if (fallbackAtRule.nodes && fallbackAtRule.nodes.length > 0) {
        root.append(fallbackAtRule);
      }
    },
  };
};

transformShortcutPlugin.postcss = true;

export default transformShortcutPlugin;
