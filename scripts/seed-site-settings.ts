import "dotenv/config";
import { getPayload } from "payload";
import config from "../src/payload.config";

const payload = await getPayload({ config });

const shared = {
  contact: {
    email: "info@alef-office.ir",
    phone: "+989177609917",
  },
  social: {
    whatsapp: "https://wa.me/989177609917",
    telegram: "https://t.me/rasooldabirinasab",
    instagram: "https://www.instagram.com/alef_group",
  },
  pages: {
    portfolio: true,
    services: true,
    process: true,
    about: true,
    blog: true,
    contact: true,
    team: true,
  },
};

await payload.updateGlobal({
  slug: "site-settings",
  locale: "en",
  data: {
    ...shared,
    contact: {
      ...shared.contact,
      officeName: "Bandar Abbas Office",
      addressLine1: "Bandar Abbas, Hormozgan",
      addressLine2: "Alef Architecture Office",
      workingHours: "Saturday to Tuesday, 08:00-15:00",
    },
    seo: {
      siteName: "Alef Architecture Office",
      titleTemplate: "%s | Alef Architecture Office",
      defaultDescription:
        "Architecture, interior design, urban strategy, renovation, and construction supervision by Alef Architecture Office.",
    },
  },
  context: { disableRevalidate: true },
  overrideAccess: true,
});

await payload.updateGlobal({
  slug: "site-settings",
  locale: "fa",
  data: {
    ...shared,
    contact: {
      ...shared.contact,
      officeName: "دفتر بندرعباس",
      addressLine1: "بندرعباس، هرمزگان",
      addressLine2: "دفتر معماری الف",
      workingHours: "شنبه تا سه‌شنبه، ساعت ۸ تا ۱۵",
    },
    seo: {
      siteName: "دفتر معماری الف",
      titleTemplate: "%s | دفتر معماری الف",
      defaultDescription:
        "طراحی معماری، طراحی داخلی، راهبرد شهری، بازسازی و نظارت بر اجرا توسط دفتر معماری الف.",
    },
  },
  context: { disableRevalidate: true },
  overrideAccess: true,
});

console.log("Site settings seeded for English and Persian.");
process.exit(0);
