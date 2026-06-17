import "dotenv/config";

import sharp from "sharp";
import { getPayload } from "payload";
import config from "../src/payload.config";

const payload = await getPayload({ config });
const previousChecks = await payload.find({
  collection: "media",
  where: { filename: { contains: "storage-check-" } },
  limit: 100,
  overrideAccess: true,
});
for (const document of previousChecks.docs) {
  await payload.delete({
    collection: "media",
    id: document.id,
    overrideAccess: true,
  });
}

const file = await sharp({
  create: {
    width: 32,
    height: 32,
    channels: 3,
    background: "#ffffff",
  },
})
  .webp()
  .toBuffer();

const uploaded = await payload.create({
  collection: "media",
  data: { alt: "Storage verification image" },
  file: {
    data: file,
    mimetype: "image/webp",
    name: `storage-check-${Date.now()}.webp`,
    size: file.length,
  },
  overrideAccess: true,
});

if (
  !uploaded.url?.startsWith("https://storage.alef-office.ir/alef-cms/") ||
  uploaded.url.includes("/chegall/")
) {
  throw new Error(`Unexpected public URL: ${uploaded.url}`);
}

const response = await fetch(uploaded.url);
if (!response.ok) {
  throw new Error(`Public file returned HTTP ${response.status}`);
}

await payload.delete({
  collection: "media",
  id: uploaded.id,
  overrideAccess: true,
});

console.log(`Storage verified through ${uploaded.url}`);
process.exit(0);
