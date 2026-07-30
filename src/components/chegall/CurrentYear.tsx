"use client";

import { useFormatter } from "next-intl";

export function CurrentYear() {
  const format = useFormatter();
  // This runs in the client (or during hydration), safely bypassing the static build check
  return <>{format.dateTime(new Date(), { year: "numeric" })}</>;
}
