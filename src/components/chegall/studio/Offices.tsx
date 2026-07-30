"use client";

import clsx from "clsx";
import { useTranslations } from "next-intl";
import type { PublicSiteSettings } from "@/src/types/site-settings";

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
  settings,
  ...props
}: {
  invert?: boolean;
  settings: PublicSiteSettings;
  [key: string]: any;
}) {
  const t = useTranslations("Offices");
  return (
    <ul role="list" {...props}>
      <li>
        <Office name={settings.contact?.officeName || t("bandarAbbas.name")} invert={invert}>
          <span className="block">{settings.contact?.addressLine1 || t("bandarAbbas.line1")}</span>
          <span className="block">{settings.contact?.addressLine2 || t("bandarAbbas.line2", { number: 5 })}</span>
        </Office>
      </li>
    </ul>
  );
}
