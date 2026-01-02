"use client";

import clsx from "clsx";
import { useTranslations, useFormatter } from "next-intl";

function Office({
  name,
  children,
  invert = false,
}: {
  name: string;
  children: React.ReactNode;
  invert?: boolean;
}) {
  return (
    <address
      className={clsx(
        "text-sm not-italic",
        invert ? "text-neutral-300" : "text-neutral-600 dark:text-neutral-400",
      )}
    >
      <strong
        className={clsx(
          "font-semibold",
          invert ? "text-white" : "text-neutral-950 dark:text-white",
        )}
      >
        {name}
      </strong>
      <br />
      <div className="mt-4 space-y-1">{children}</div>
    </address>
  );
}

export function Offices({
  invert = false,
  ...props
}: {
  invert?: boolean;
  [key: string]: any;
}) {
  const t = useTranslations("Offices");
  const format = useFormatter();

  return (
    <ul role="list" {...props}>
      <li>
        <Office name={t("bandarAbbas.name")} invert={invert}>
          <span className="block">{t("bandarAbbas.line1")}</span>
          <span className="block">
            {t("bandarAbbas.line2", { number: format.number(5) })}
          </span>
        </Office>
      </li>
    </ul>
  );
}
