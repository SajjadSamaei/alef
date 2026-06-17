import "dotenv/config";

import fs from "node:fs/promises";
import path from "node:path";
import { getPayload } from "payload";
import config from "../src/payload.config";

const payload = await getPayload({ config });
const imagesRoot = path.resolve("Projects", "generated");
const seedContext = { disableRevalidate: true };

const imageDefinitions = {
  interior: {
    filename: "interior-design.webp",
    alt: "Contemporary residential interior opening to a shaded courtyard",
  },
  supervision: {
    filename: "construction-supervision.webp",
    alt: "Architectural drawings reviewed during construction supervision",
  },
  restoration: {
    filename: "adaptive-reuse.webp",
    alt: "Historic brick courtyard restored with a contemporary glass intervention",
  },
  studio: {
    filename: "design-studio.webp",
    alt: "Architecture studio table with models drawings and material samples",
  },
} as const;

async function findOrUpload({
  filename,
  alt,
}: {
  filename: string;
  alt: string;
}) {
  const existing = await payload.find({
    collection: "media",
    where: { filename: { equals: filename } },
    limit: 1,
    overrideAccess: true,
  });

  if (existing.docs[0]) return existing.docs[0];

  const filePath = path.join(imagesRoot, filename);
  const data = await fs.readFile(filePath);
  const uploaded = await payload.create({
    collection: "media",
    data: { alt },
    file: {
      data,
      mimetype: "image/webp",
      name: filename,
      size: data.length,
    },
    overrideAccess: true,
  });

  if (
    !uploaded.url?.startsWith(
      "https://storage.alef-office.ir/alef-cms/general-media/",
    )
  ) {
    throw new Error(`Unexpected public URL for ${filename}: ${uploaded.url}`);
  }

  const response = await fetch(uploaded.url);
  if (!response.ok) {
    throw new Error(`${uploaded.url} returned HTTP ${response.status}`);
  }

  return uploaded;
}

const [interior, supervision, restoration, studio] = await Promise.all([
  findOrUpload(imageDefinitions.interior),
  findOrUpload(imageDefinitions.supervision),
  findOrUpload(imageDefinitions.restoration),
  findOrUpload(imageDefinitions.studio),
]);

const existingMedia = await payload.find({
  collection: "media",
  where: {
    filename: {
      in: ["01.webp", "01-2.webp", "01-1.webp"],
    },
  },
  limit: 20,
  overrideAccess: true,
});
const mediaByFilename = new Map(
  existingMedia.docs.map((document) => [document.filename, document]),
);
const architecture = mediaByFilename.get("01.webp");
const urban = mediaByFilename.get("01-2.webp");
const technical = mediaByFilename.get("01-1.webp");

if (!architecture || !urban || !technical) {
  throw new Error("Required existing project media records were not found.");
}

await payload.updateGlobal({
  slug: "landing-page",
  locale: "en",
  context: seedContext,
  data: {
    about: { image: studio.id },
    services: {
      architecture: architecture.id,
      interior: interior.id,
      urban: urban.id,
      supervision: supervision.id,
      restoration: restoration.id,
    },
  },
  overrideAccess: true,
});
await payload.updateGlobal({
  slug: "landing-page",
  locale: "fa",
  context: seedContext,
  data: {
    about: { image: studio.id },
    services: {
      architecture: architecture.id,
      interior: interior.id,
      urban: urban.id,
      supervision: supervision.id,
      restoration: restoration.id,
    },
  },
  overrideAccess: true,
});

await payload.updateGlobal({
  slug: "about-page",
  locale: "en",
  context: seedContext,
  data: {
    studioImage: studio.id,
    imageCaption:
      "Models, material studies, and drawings develop together throughout the design process.",
  },
  overrideAccess: true,
});
await payload.updateGlobal({
  slug: "about-page",
  locale: "fa",
  context: seedContext,
  data: {
    studioImage: studio.id,
    imageCaption:
      "مدل‌ها، مطالعات مصالح و ترسیمات در تمام مراحل طراحی به‌صورت هم‌زمان توسعه می‌یابند.",
  },
  overrideAccess: true,
});

await payload.updateGlobal({
  slug: "services-page",
  locale: "en",
  context: seedContext,
  data: {
    architecture: { image: architecture.id },
    interior: { image: interior.id },
    urban: { image: urban.id },
    supervision: { image: supervision.id },
    restoration: { image: restoration.id },
  },
  overrideAccess: true,
});
await payload.updateGlobal({
  slug: "services-page",
  locale: "fa",
  context: seedContext,
  data: {
    architecture: { image: architecture.id },
    interior: { image: interior.id },
    urban: { image: urban.id },
    supervision: { image: supervision.id },
    restoration: { image: restoration.id },
  },
  overrideAccess: true,
});

await payload.updateGlobal({
  slug: "process-page",
  locale: "en",
  context: seedContext,
  data: {
    vision: { image: studio.id },
    design: { image: architecture.id },
    technical: { image: technical.id },
    execution: { image: supervision.id },
  },
  overrideAccess: true,
});
await payload.updateGlobal({
  slug: "process-page",
  locale: "fa",
  context: seedContext,
  data: {
    vision: { image: studio.id },
    design: { image: architecture.id },
    technical: { image: technical.id },
    execution: { image: supervision.id },
  },
  overrideAccess: true,
});

console.log(
  [
    `Interior: ${interior.url}`,
    `Supervision: ${supervision.url}`,
    `Restoration: ${restoration.url}`,
    `Studio: ${studio.url}`,
  ].join("\n"),
);

process.exit(0);
