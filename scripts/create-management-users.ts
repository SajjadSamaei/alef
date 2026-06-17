import "dotenv/config";

import { randomBytes } from "node:crypto";
import { getPayload } from "payload";
import config from "../src/payload.config";

const payload = await getPayload({ config });

const adminPassword = process.env.ALEF_ADMIN_PASSWORD;

if (!adminPassword) {
  throw new Error(
    "ALEF_ADMIN_PASSWORD is required to provision the primary admin.",
  );
}

const accounts = [
  {
    email: process.env.ALEF_ADMIN_EMAIL || "admin@alef.com",
    username: "admin",
    names: {
      en: "Alef Administrator",
      fa: "مدیر اصلی دفتر الف",
    },
    roles: ["admin", "editor", "management"],
    password: adminPassword,
  },
  {
    email: "homayoun@alef-office.ir",
    username: "homayoun",
    names: {
      en: "Homayoun Hosseinzadeh",
      fa: "همایون حسین‌زاده",
    },
    roles: ["management"],
    password: process.env.ALEF_HOMAYOUN_PASSWORD,
  },
  {
    email: "shima@alef-office.ir",
    username: "shima",
    names: {
      en: "Shima Ghahri",
      fa: "شیما قهری",
    },
    roles: ["management"],
    password: process.env.ALEF_SHIMA_PASSWORD,
  },
] as const;

for (const account of accounts) {
  const existing = await payload.find({
    collection: "users",
    where: { email: { equals: account.email } },
    limit: 1,
    overrideAccess: true,
  });

  let userID = existing.docs[0]?.id;

  if (userID) {
    const password =
      "password" in account && account.password
        ? account.password
        : undefined;
    await payload.update({
      collection: "users",
      id: userID,
      data: {
        name: account.names.en,
        username: account.username,
        roles: [...account.roles],
        ...(password ? { password } : {}),
      },
      locale: "en",
      overrideAccess: true,
    });
    console.log(`${account.email}: existing account updated`);
  } else {
    const password =
      "password" in account && account.password
        ? account.password
        : `Alef-${randomBytes(9).toString("base64url")}!`;
    const created = await payload.create({
      collection: "users",
      data: {
        email: account.email,
        username: account.username,
        name: account.names.en,
        password,
        roles: [...account.roles],
      },
      locale: "en",
      overrideAccess: true,
    });
    userID = created.id;
    console.log(`${account.email}: ${password}`);
  }

  await payload.update({
    collection: "users",
    id: userID,
    data: {
      name: account.names.fa,
    },
    locale: "fa",
    overrideAccess: true,
  });
}

process.exit(0);
