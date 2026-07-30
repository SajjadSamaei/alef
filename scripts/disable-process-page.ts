import "dotenv/config";

import { getPayload } from "payload";
import config from "../src/payload.config";

const locales = ["en", "fa"] as const;

const main = async () => {
  const payload = await getPayload({ config });

  for (const locale of locales) {
    const settings = (await payload.findGlobal({
      slug: "site-settings",
      locale,
      overrideAccess: true,
    })) as any;

    await payload.updateGlobal({
      slug: "site-settings",
      locale,
      data: {
        pages: {
          ...(settings.pages || {}),
          process: false,
        },
      },
      overrideAccess: true,
    });

    const updated = (await payload.findGlobal({
      slug: "site-settings",
      locale,
      overrideAccess: true,
    })) as any;

    console.log(`${locale}: process=${updated.pages?.process}`);
  }

  process.exit(0);
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
