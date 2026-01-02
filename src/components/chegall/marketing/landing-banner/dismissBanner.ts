// ./src/app/actions.ts
"use server";

import { cookies } from "next/headers";

export async function dismissBanner(version: string) {
  if (!version) return;

  const cookieStore = await cookies();

  cookieStore.set("landing-page-banner", version, {
    maxAge: 60 * 60 * 24 * 30,
    path: "/",
  });
}
