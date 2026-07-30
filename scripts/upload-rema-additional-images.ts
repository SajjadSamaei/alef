import "dotenv/config";

import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { HeadObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getPayload } from "payload";
import config from "../src/payload.config";

const root = process.cwd();
const sourceDir = path.join(root, "images-to-upload", "rema", "post1");
const optimizedDir = path.join(root, "images-to-upload", "optimized", "rema");
const publicURL = process.env.S3_PUBLIC_URL || "https://storage.alef-office.ir";
const noRevalidate = { disableRevalidate: true };

const s3 = new S3Client({
  endpoint: process.env.S3_ENDPOINT,
  forcePathStyle: true,
  region: process.env.S3_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || "",
  },
});

const keyFromURL = (url?: string | null) =>
  url ? decodeURIComponent(url.replace(publicURL, "").replace(/^\/+/, "")) : "";

const existsInS3 = async (key: string) => {
  try {
    await s3.send(
      new HeadObjectCommand({
        Bucket: process.env.S3_BUCKET || "",
        Key: key,
      }),
    );
    return true;
  } catch {
    return false;
  }
};

const putWebp = async (key: string, data: Buffer) => {
  await s3.send(
    new PutObjectCommand({
      Bucket: process.env.S3_BUCKET || "",
      Key: key,
      Body: data,
      ContentType: "image/webp",
    }),
  );
};

const optimize = async (source: string, outputName: string) => {
  await fs.mkdir(optimizedDir, { recursive: true });
  const output = path.join(optimizedDir, outputName);
  await sharp(source)
    .rotate()
    .resize({ width: 1800, height: 1800, fit: "inside", withoutEnlargement: true })
    .webp({ quality: 84, effort: 5 })
    .toFile(output);
  return output;
};

const upload = async (
  payload: Awaited<ReturnType<typeof getPayload>>,
  filePath: string,
  alt: string,
) => {
  const filename = path.basename(filePath);
  const existing = await payload.find({
    collection: "case-study-media",
    where: { filename: { equals: filename } },
    limit: 1,
    overrideAccess: true,
  });

  if (existing.docs[0]) return existing.docs[0] as any;

  const data = await fs.readFile(filePath);
  const doc = await payload.create({
    collection: "case-study-media",
    data: { alt },
    file: {
      data,
      mimetype: "image/webp",
      name: filename,
      size: data.length,
    },
    context: noRevalidate,
    overrideAccess: true,
  });

  if (typeof doc.url === "string" && !doc.url.startsWith(publicURL)) {
    throw new Error(`Unexpected upload URL for ${filename}: ${doc.url}`);
  }

  return doc as any;
};

const repairS3Objects = async (doc: any, localPath: string) => {
  const original = await fs.readFile(localPath);
  const originalKey = keyFromURL(doc.url);

  if (originalKey && !(await existsInS3(originalKey))) {
    await putWebp(originalKey, original);
    console.log(`Repaired ${originalKey}`);
  }

  for (const size of Object.values(doc.sizes || {}) as any[]) {
    if (!size?.url || !size?.width || !size?.height) continue;
    const sizeKey = keyFromURL(size.url);
    if (!sizeKey || (await existsInS3(sizeKey))) continue;

    const resized = await sharp(original)
      .resize(size.width, size.height, { fit: "cover", withoutEnlargement: true })
      .webp({ quality: 82, effort: 5 })
      .toBuffer();
    await putWebp(sizeKey, resized);
    console.log(`Repaired ${sizeKey}`);
  }
};

const caption = (index: number, locale: "en" | "fa") =>
  locale === "fa"
    ? `تصویر تکمیلی ${index + 1} از پروژه رِما`
    : `Additional Rema project image ${index + 1}`;

const imageID = (image: any) => String(typeof image === "object" ? image?.id : image);

const withValidFeatureNames = (sections: any[] | null | undefined, locale: "en" | "fa") => {
  if (!Array.isArray(sections)) return sections;

  return sections.map((section) => ({
    ...section,
    features: Array.isArray(section.features)
      ? section.features.map((feature: any, index: number) => ({
          ...feature,
          name:
            feature?.name ||
            feature?.value ||
            feature?.text ||
            (locale === "fa" ? `مورد ${index + 1}` : `Item ${index + 1}`),
        }))
      : section.features,
  }));
};

const main = async () => {
  const payload = await getPayload({ config });
  const entries = (await fs.readdir(sourceDir, { withFileTypes: true }))
    .filter((entry) => entry.isFile() && /\.(jpe?g|png|webp)$/i.test(entry.name))
    .map((entry) => entry.name)
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

  if (!entries.length) {
    throw new Error(`No images found in ${sourceDir}`);
  }

  const uploaded = [];
  for (const [index, name] of entries.entries()) {
    const source = path.join(sourceDir, name);
    const base = path.parse(name).name.replace(/[^a-zA-Z0-9_-]+/g, "-").toLowerCase();
    const optimized = await optimize(
      source,
      `client-20260630-rema-post1-${String(index + 1).padStart(2, "0")}-${base}.webp`,
    );
    const media = await upload(payload, optimized, `Rema project additional image ${index + 1}`);
    await repairS3Objects(media, optimized);
    uploaded.push(media);
    console.log(`Ready ${index + 1}/${entries.length}: ${media.filename}`);
  }

  const existingProject = await payload.find({
    collection: "case-studies",
    where: { slug: { equals: "rema" } },
    limit: 1,
    locale: "en",
    overrideAccess: true,
  });

  const project = existingProject.docs[0] as any;
  if (!project) throw new Error("Rema project was not found.");

  const existingImageIds = new Set(
    (project.projectGallery || [])
      .map((item: any) => imageID(item.image))
      .filter(Boolean),
  );

  const newItems = uploaded
    .filter((image) => !existingImageIds.has(String(image.id)))
    .map((image, index) => ({
      image: image.id,
      caption: caption(index, "en"),
    }));

  if (!newItems.length) {
    console.log("Rema already has these gallery images. Nothing to append.");
    process.exit(0);
  }

  const gallery = [...(project.projectGallery || []), ...newItems];

  await payload.update({
    collection: "case-studies",
    id: project.id,
    locale: "en",
    data: {
      projectGallery: gallery,
      featuresBySection: withValidFeatureNames(project.featuresBySection, "en"),
    } as any,
    context: noRevalidate,
    overrideAccess: true,
  });

  const faProject = (await payload.findByID({
    collection: "case-studies",
    id: project.id,
    locale: "fa",
    overrideAccess: true,
  })) as any;
  const faGallery = [...(faProject.projectGallery || project.projectGallery || []), ...newItems].map(
    (item: any, index: number, items: any[]) => ({
      ...item,
      caption:
        index >= items.length - newItems.length
          ? caption(index - (items.length - newItems.length), "fa")
          : item.caption,
    }),
  );

  await payload.update({
    collection: "case-studies",
    id: project.id,
    locale: "fa",
    data: {
      projectGallery: faGallery,
      featuresBySection: withValidFeatureNames(faProject.featuresBySection, "fa"),
    } as any,
    context: noRevalidate,
    overrideAccess: true,
  });

  console.log(`Appended ${newItems.length} images to Rema.`);
  process.exit(0);
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
