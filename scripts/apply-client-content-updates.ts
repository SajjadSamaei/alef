import "dotenv/config";

import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { HeadObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getPayload } from "payload";
import config from "../src/payload.config";

const root = process.cwd();
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

const putFile = async (key: string, data: Buffer, contentType: string) => {
  await s3.send(
    new PutObjectCommand({
      Bucket: process.env.S3_BUCKET || "",
      Key: key,
      Body: data,
      ContentType: contentType,
    }),
  );
};

const repairS3Objects = async (doc: any, localPath: string, contentType = "image/webp") => {
  const original = await fs.readFile(localPath);
  const originalKey = keyFromURL(doc.url);

  if (originalKey && !(await existsInS3(originalKey))) {
    await putFile(originalKey, original, contentType);
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
    await putFile(sizeKey, resized, "image/webp");
    console.log(`Repaired ${sizeKey}`);
  }
};

const imageID = (image: any) => (typeof image === "object" && image ? image.id : image);

const richText = (text: string) =>
  ({
    root: {
      type: "root",
      format: "",
      indent: 0,
      version: 1,
      children: [
        {
          type: "paragraph",
          format: "",
          indent: 0,
          version: 1,
          children: [
            {
              type: "text",
              detail: 0,
              format: 0,
              mode: "normal",
              style: "",
              text,
              version: 1,
            },
          ],
          direction: null,
          textFormat: 0,
          textStyle: "",
        },
      ],
      direction: null,
    },
  }) as any;

const withValidFeatureNames = (sections: any[] | null | undefined, locale: "en" | "fa") => {
  if (!Array.isArray(sections)) return sections;

  return sections.map((section) => ({
    ...section,
    features: Array.isArray(section.features)
      ? section.features.map((feature: any, index: number) => ({
          ...feature,
          name:
            feature?.name ||
            feature?.textValue ||
            feature?.value ||
            (locale === "fa" ? `مورد ${index + 1}` : `Item ${index + 1}`),
        }))
      : section.features,
  }));
};

const ensureCaseStudyType = async (payload: Awaited<ReturnType<typeof getPayload>>) => {
  const existing = await payload.find({
    collection: "case-study-type",
    where: { slug: { equals: "renovation" } },
    limit: 1,
    locale: "en",
    overrideAccess: true,
  });

  if (existing.docs[0]) {
    await payload.update({
      collection: "case-study-type",
      id: existing.docs[0].id,
      locale: "fa",
      data: { title: "بازسازی" } as any,
      context: noRevalidate,
      overrideAccess: true,
    });
    return existing.docs[0].id;
  }

  const type = await payload.create({
    collection: "case-study-type",
    locale: "en",
    data: { title: "Renovation", slug: "renovation" } as any,
    context: noRevalidate,
    overrideAccess: true,
  });

  await payload.update({
    collection: "case-study-type",
    id: type.id,
    locale: "fa",
    data: { title: "بازسازی" } as any,
    context: noRevalidate,
    overrideAccess: true,
  });

  return type.id;
};

const uploadTeamImage = async (
  payload: Awaited<ReturnType<typeof getPayload>>,
  sourcePath: string,
  filename: string,
  alt: string,
) => {
  const optimizedDir = path.join(root, "images-to-upload", "optimized", "team");
  await fs.mkdir(optimizedDir, { recursive: true });
  const optimizedPath = path.join(optimizedDir, filename);

  await sharp(sourcePath)
    .rotate()
    .resize({ width: 1400, height: 1400, fit: "cover", position: "centre" })
    .webp({ quality: 82, effort: 5 })
    .toFile(optimizedPath);

  const existing = await payload.find({
    collection: "team-media",
    where: { filename: { equals: filename } },
    limit: 1,
    overrideAccess: true,
  });

  if (existing.docs[0]) {
    await repairS3Objects(existing.docs[0], optimizedPath);
    return existing.docs[0] as any;
  }

  const data = await fs.readFile(optimizedPath);
  const doc = await payload.create({
    collection: "team-media",
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

  await repairS3Objects(doc, optimizedPath);
  return doc as any;
};

const upsertTeamMember = async (
  payload: Awaited<ReturnType<typeof getPayload>>,
  args: {
    slug: string;
    nameEn: string;
    nameFa: string;
    roleEn: string;
    roleFa: string;
    imageID: number;
    orgRoles: string[];
  },
) => {
  const found = await payload.find({
    collection: "team",
    where: { slug: { equals: args.slug } },
    limit: 1,
    locale: "en",
    overrideAccess: true,
  });

  const baseData = {
    name: args.nameEn,
    role: args.roleEn,
    profilePicture: args.imageID,
    employmentStatus: "active",
    orgRoles: args.orgRoles,
    slug: args.slug,
  } as any;

  const member = found.docs[0]
    ? await payload.update({
        collection: "team",
        id: found.docs[0].id,
        locale: "en",
        data: baseData,
        context: noRevalidate,
        overrideAccess: true,
      })
    : await payload.create({
        collection: "team",
        locale: "en",
        data: baseData,
        context: noRevalidate,
        overrideAccess: true,
      });

  await payload.update({
    collection: "team",
    id: member.id,
    locale: "fa",
    data: {
      name: args.nameFa,
      role: args.roleFa,
      profilePicture: args.imageID,
      employmentStatus: "active",
      orgRoles: args.orgRoles,
      slug: args.slug,
    } as any,
    context: noRevalidate,
    overrideAccess: true,
  });

  return member.id;
};

const main = async () => {
  const payload = await getPayload({ config });

  const [remaEn, remaFa] = await Promise.all([
    payload.find({
      collection: "case-studies",
      where: { slug: { equals: "rema" } },
      limit: 1,
      locale: "en",
      depth: 1,
      overrideAccess: true,
    }),
    payload.find({
      collection: "case-studies",
      where: { slug: { equals: "rema" } },
      limit: 1,
      locale: "fa",
      depth: 1,
      overrideAccess: true,
    }),
  ]);

  const rema = remaEn.docs[0] as any;
  const remaLocalized = remaFa.docs[0] as any;
  if (!rema) throw new Error("Rema project was not found.");

  const renovationTypeID = await ensureCaseStudyType(payload);
  const oldFeaturedID = imageID(rema.featuredImage);
  const oldGalleryItems = (rema.projectGallery || []).filter((item: any) => {
    const image = item.image;
    const filename = typeof image === "object" ? image?.filename : "";
    return filename === "02-3.webp";
  });
  const oldGallery = oldGalleryItems.map((item: any) => ({
    image: imageID(item.image),
    caption: item.caption || "Boulevard Moallem project image",
  }));

  const uniqueRecent = new Map<string, any>();
  for (const item of rema.projectGallery || []) {
    const image = item.image;
    const filename = typeof image === "object" ? image?.filename : "";
    if (!filename?.startsWith("client-20260630-rema-post1-")) continue;
    const id = String(imageID(image));
    if (!uniqueRecent.has(id)) {
      uniqueRecent.set(id, {
        image: imageID(image),
        caption: item.caption || "Rema renovation project image",
      });
    }
  }

  const recentGallery = [...uniqueRecent.values()];
  if (!recentGallery.length) throw new Error("No recent Rema gallery images found.");
  const remaFeaturedID = recentGallery[0].image;

  const moallemExisting = await payload.find({
    collection: "case-studies",
    where: { slug: { equals: "boulevard-moallem" } },
    limit: 1,
    locale: "en",
    overrideAccess: true,
  });

  const residentialTypeID = imageID(rema.projectType);
  const moallemEnData = {
    title: "Boulevard Moallem",
    subtitle: "Residential architecture on Moallem Boulevard",
    projectType: residentialTypeID,
    projectStatus: "schematic",
    projectBrief:
      "A residential project shaped by its urban frontage and a calm architectural rhythm along Moallem Boulevard.",
    featuredImage: oldFeaturedID,
    keywords: [{ keyword: "Residential" }, { keyword: "Urban housing" }],
    details: richText(
      "Boulevard Moallem is organized around a clear facade rhythm, measured openings, and a restrained material language for everyday urban living.",
    ),
    projectGallery: oldGallery,
    client: "Private client",
    yearCompleted: null,
    location: { city: "Bandar Abbas", country: "Iran" },
    metrics: {},
    featuresBySection: [],
    credits: {},
    meta: {
      title: "Boulevard Moallem residential project",
      description:
        "Boulevard Moallem residential architecture project by Alef Office in Bandar Abbas.",
      image: oldFeaturedID,
    },
    slug: "boulevard-moallem",
    _status: "published",
    publishedAt: new Date().toISOString(),
  } as any;

  const moallem = moallemExisting.docs[0]
    ? await payload.update({
        collection: "case-studies",
        id: moallemExisting.docs[0].id,
        locale: "en",
        data: moallemEnData,
        context: noRevalidate,
        overrideAccess: true,
      })
    : await payload.create({
        collection: "case-studies",
        locale: "en",
        data: moallemEnData,
        context: noRevalidate,
        overrideAccess: true,
      });

  await payload.update({
    collection: "case-studies",
    id: moallem.id,
    locale: "fa",
    data: {
      ...moallemEnData,
      title: "بلوار معلم",
      subtitle: "پروژه مسکونی در بلوار معلم",
      projectBrief:
        "پروژه‌ای مسکونی با تاکید بر ریتم آرام نما، تناسبات شهری و کیفیت سکونت در امتداد بلوار معلم.",
      keywords: [{ keyword: "مسکونی" }, { keyword: "مسکن شهری" }],
      details: richText(
        "بلوار معلم بر پایه ریتم منظم نما، بازشوهای کنترل‌شده و زبانی ساده برای کیفیت زندگی روزمره شهری شکل گرفته است.",
      ),
      projectGallery: oldGallery.map((item: any, index: number) => ({
        ...item,
        caption: `تصویر ${index + 1} از پروژه بلوار معلم`,
      })),
      client: "کارفرمای خصوصی",
      location: { city: "بندرعباس", country: "ایران" },
      meta: {
        title: "پروژه مسکونی بلوار معلم",
        description: "پروژه مسکونی بلوار معلم، طراحی دفتر معماری الف در بندرعباس.",
        image: oldFeaturedID,
      },
    } as any,
    context: noRevalidate,
    overrideAccess: true,
  });
  console.log(`Created/updated Boulevard Moallem with ${oldGallery.length + 1} old images.`);

  await payload.update({
    collection: "case-studies",
    id: rema.id,
    locale: "en",
    data: {
      title: rema.title,
      projectType: renovationTypeID,
      featuredImage: remaFeaturedID,
      projectGallery: recentGallery,
      keywords: [{ keyword: "Renovation" }, { keyword: "Interior renewal" }],
      featuresBySection: withValidFeatureNames(rema.featuresBySection, "en"),
      meta: {
        ...(rema.meta || {}),
        image: remaFeaturedID,
      },
    } as any,
    context: noRevalidate,
    overrideAccess: true,
  });

  await payload.update({
    collection: "case-studies",
    id: rema.id,
    locale: "fa",
    data: {
      title: remaLocalized?.title || "رِما",
      projectType: renovationTypeID,
      featuredImage: remaFeaturedID,
      projectGallery: recentGallery.map((item, index) => ({
        ...item,
        caption: `تصویر ${index + 1} از پروژه بازسازی رِما`,
      })),
      keywords: [{ keyword: "بازسازی" }, { keyword: "نوسازی داخلی" }],
      featuresBySection: withValidFeatureNames(remaLocalized?.featuresBySection, "fa"),
      meta: {
        ...(remaLocalized?.meta || {}),
        image: remaFeaturedID,
      },
    } as any,
    context: noRevalidate,
    overrideAccess: true,
  });
  console.log(`Rema now uses ${recentGallery.length} unique recent images and a recent featured image.`);

  const settings = (await payload.findGlobal({
    slug: "site-settings",
    locale: "fa",
    overrideAccess: true,
  })) as any;
  await payload.updateGlobal({
    slug: "site-settings",
    locale: "fa",
    data: {
      pages: {
        ...(settings.pages || {}),
        process: false,
      },
    },
    context: noRevalidate,
    overrideAccess: true,
  });
  console.log("Disabled the process page in site settings.");

  const mohammadImage = await uploadTeamImage(
    payload,
    path.join(root, "images-to-upload", "mohamamd-moradi", "gap.jpg"),
    "client-20260701-team-mohammad-moradi.webp",
    "Mohammad Moradi portrait",
  );
  const rasoulImage = await uploadTeamImage(
    payload,
    path.join(root, "images-to-upload", "rasoul-dabiri", "rasoul-2.png"),
    "client-20260701-team-rasoul-dabiri.webp",
    "Rasoul Dabiri portrait",
  );

  await upsertTeamMember(payload, {
    slug: "mohammad-moradi",
    nameEn: "Mohammad Moradi",
    nameFa: "محمد مرادی",
    roleEn: "Structural Department",
    roleFa: "دپارتمان سازه",
    imageID: mohammadImage.id,
    orgRoles: ["team"],
  });
  await upsertTeamMember(payload, {
    slug: "rasoul-dabiri",
    nameEn: "Rasoul Dabiri",
    nameFa: "رسول دبیری",
    roleEn: "Executive and Investment Consultant",
    roleFa: "مشاور اجرائی و سرمایه‌گذاری",
    imageID: rasoulImage.id,
    orgRoles: ["contractor"],
  });

  const shima = await payload.find({
    collection: "team",
    where: { slug: { equals: "shima-ghahri" } },
    limit: 1,
    locale: "en",
    overrideAccess: true,
  });
  if (shima.docs[0]) {
    await payload.update({
      collection: "team",
      id: shima.docs[0].id,
      locale: "en",
      data: { orgRoles: ["leadership"] } as any,
      context: noRevalidate,
      overrideAccess: true,
    });
    await payload.update({
      collection: "team",
      id: shima.docs[0].id,
      locale: "fa",
      data: { orgRoles: ["leadership"] } as any,
      context: noRevalidate,
      overrideAccess: true,
    });
  }
  console.log("Updated team members and leadership grouping.");

  process.exit(0);
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
