const cornerNames = ["tl", "tr", "br", "bl"] as const;

const radius12 = {
  "": {
    all: "rounded-[12px]",
    tl: "rounded-tl-[12px]",
    tr: "rounded-tr-[12px]",
    br: "rounded-br-[12px]",
    bl: "rounded-bl-[12px]",
  },
  "sm:": {
    all: "sm:rounded-[12px]",
    tl: "sm:rounded-tl-[12px]",
    tr: "sm:rounded-tr-[12px]",
    br: "sm:rounded-br-[12px]",
    bl: "sm:rounded-bl-[12px]",
  },
  "lg:": {
    all: "lg:rounded-[12px]",
    tl: "lg:rounded-tl-[12px]",
    tr: "lg:rounded-tr-[12px]",
    br: "lg:rounded-br-[12px]",
    bl: "lg:rounded-bl-[12px]",
  },
  "xl:": {
    all: "xl:rounded-[12px]",
    tl: "xl:rounded-tl-[12px]",
    tr: "xl:rounded-tr-[12px]",
    br: "xl:rounded-br-[12px]",
    bl: "xl:rounded-bl-[12px]",
  },
} as const;

const radius40 = {
  "": {
    tl: "rounded-tl-[40px]",
    tr: "rounded-tr-[40px]",
    br: "rounded-br-[40px]",
    bl: "rounded-bl-[40px]",
  },
  "sm:": {
    tl: "sm:rounded-tl-[40px]",
    tr: "sm:rounded-tr-[40px]",
    br: "sm:rounded-br-[40px]",
    bl: "sm:rounded-bl-[40px]",
  },
  "lg:": {
    tl: "lg:rounded-tl-[40px]",
    tr: "lg:rounded-tr-[40px]",
    br: "lg:rounded-br-[40px]",
    bl: "lg:rounded-bl-[40px]",
  },
  "xl:": {
    tl: "xl:rounded-tl-[40px]",
    tr: "xl:rounded-tr-[40px]",
    br: "xl:rounded-br-[40px]",
    bl: "xl:rounded-bl-[40px]",
  },
} as const;

type RadiusPrefix = keyof typeof radius12;
type Direction = "ltr" | "rtl";

const visualColForIndex = (index: number, cols: number, direction: Direction) => {
  const col = index % cols;
  return direction === "rtl" ? cols - 1 - col : col;
};

const rowVisualBounds = (
  row: number,
  total: number,
  cols: number,
  direction: Direction,
) => {
  const start = row * cols;
  const end = Math.min(total - 1, start + cols - 1);
  const colsInRow = [];

  for (let item = start; item <= end; item += 1) {
    colsInRow.push(visualColForIndex(item, cols, direction));
  }

  return {
    min: Math.min(...colsInRow),
    max: Math.max(...colsInRow),
  };
};

const cornerIsExposed = (
  corner: (typeof cornerNames)[number],
  index: number,
  total: number,
  cols: number,
  direction: Direction,
) => {
  const row = Math.floor(index / cols);
  const visualCol = visualColForIndex(index, cols, direction);
  const lastRow = Math.floor((total - 1) / cols);
  const topBounds = rowVisualBounds(0, total, cols, direction);
  const bottomBounds = rowVisualBounds(lastRow, total, cols, direction);

  if (corner === "tl") return row === 0 && visualCol === topBounds.min;
  if (corner === "tr") return row === 0 && visualCol === topBounds.max;
  if (corner === "bl") return row === lastRow && visualCol === bottomBounds.min;
  return row === lastRow && visualCol === bottomBounds.max;
};

export const getSquareMosaicRadii = (
  index: number,
  total: number,
  direction: Direction = "ltr",
) => {
  const breakpoints: { cols: number; prefix: RadiusPrefix }[] = [
    { cols: 2, prefix: "" },
    { cols: 3, prefix: "sm:" },
    { cols: 4, prefix: "lg:" },
    { cols: 5, prefix: "xl:" },
  ];

  const classes = ["h-full"];

  for (const { cols, prefix } of breakpoints) {
    classes.push(radius12[prefix].all);

    for (const corner of cornerNames) {
      if (cornerIsExposed(corner, index, total, cols, direction)) {
        classes.push(radius40[prefix][corner]);
      } else {
        classes.push(radius12[prefix][corner]);
      }
    }
  }

  return classes.join(" ");
};
