import "dotenv/config";

import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { getPayload } from "payload";
import config from "../src/payload.config";

const root = process.cwd();
const sourceRoot = path.join(root, "images");
const optimizedRoot = path.join(root, "images", "optimized-client-request");
const publicURL = process.env.S3_PUBLIC_URL || "https://storage.alef-office.ir";
const noRevalidate = { disableRevalidate: true };

const richText = (paragraphs: readonly string[]) => ({
  root: {
    type: "root",
    children: paragraphs.map((text) => ({
      type: "paragraph",
      version: 1,
      children: [
        {
          type: "text",
          version: 1,
          text,
          detail: 0,
          format: 0,
          mode: "normal",
          style: "",
        },
      ],
      direction: null,
      format: "",
      indent: 0,
      textFormat: 0,
      textStyle: "",
    })),
    direction: null,
    format: "" as const,
    indent: 0,
    version: 1,
  },
});

const teamImages = [
  {
    file: "-2دپارتمان مالی-مریم امینی.jpg",
    slug: "maryam-amini",
    en: { name: "Maryam Amini", role: "Finance Department" },
    fa: { name: "مریم امینی", role: "دپارتمان مالی" },
    orgRoles: ["admin"],
  },
  {
    file: "2شیما قهری-دپارتمان معماری.png",
    slug: "shima-ghahri",
    en: { name: "Shima Ghahri", role: "Architecture Department" },
    fa: { name: "شیما قهری", role: "دپارتمان معماری" },
    orgRoles: ["team"],
  },
  {
    file: "الناز ماهوش-دپارتمان معماری.JPG",
    slug: "elnaz-mahoosh",
    en: { name: "Elnaz Mahoosh", role: "Architecture Department" },
    fa: { name: "الناز ماهوش", role: "دپارتمان معماری" },
    orgRoles: ["team"],
  },
  {
    file: "الهه زمیاد-دپارتمان معماری.JPG",
    slug: "elaheh-zamyad",
    en: { name: "Elaheh Zamyad", role: "Architecture Department" },
    fa: { name: "الهه زمیاد", role: "دپارتمان معماری" },
    orgRoles: ["team"],
  },
  {
    file: "نسرین منتجبی-دپارتمان تاسیسات.jpg",
    slug: "nasrin-montajebi",
    en: { name: "Nasrin Montajebi", role: "MEP Department" },
    fa: { name: "نسرین منتجبی", role: "دپارتمان تاسیسات" },
    orgRoles: ["team"],
  },
  {
    file: "همایون حسین زاده-دپارتمان معماری.png",
    slug: "homayoun-hosseinzadeh",
    en: { name: "Homayoun Hosseinzadeh", role: "CEO / Architecture Department" },
    fa: { name: "همایون حسین زاده", role: "مدیرعامل / دپارتمان معماری" },
    orgRoles: ["leadership"],
  },
] as const;

const optimize = async (
  source: string,
  outputName: string,
  options: { square?: boolean; width?: number } = {},
) => {
  await fs.mkdir(optimizedRoot, { recursive: true });
  const output = path.join(optimizedRoot, outputName);
  const width = options.width || 1800;
  const pipeline = sharp(source).rotate();

  if (options.square) {
    pipeline.resize(width, width, { fit: "cover", withoutEnlargement: true });
  } else {
    pipeline.resize({ width, height: width, fit: "inside", withoutEnlargement: true });
  }

  await pipeline.webp({ quality: 82, effort: 5 }).toFile(output);
  return output;
};

const upload = async (
  payload: Awaited<ReturnType<typeof getPayload>>,
  collection: "case-study-media" | "team-media",
  filePath: string,
  alt: string,
) => {
  const name = path.basename(filePath);
  const existing = await payload.find({
    collection,
    where: { filename: { equals: name } },
    limit: 1,
    overrideAccess: true,
  });

  if (existing.docs[0]) return existing.docs[0];

  const data = await fs.readFile(filePath);
  const doc = await payload.create({
    collection,
    data: { alt },
    file: {
      data,
      mimetype: "image/webp",
      name,
      size: data.length,
    },
    context: noRevalidate,
    overrideAccess: true,
  });

  if (typeof doc.url === "string" && !doc.url.startsWith(publicURL)) {
    throw new Error(`Unexpected upload URL for ${name}: ${doc.url}`);
  }

  return doc;
};

const updateSiteSettings = async (payload: Awaited<ReturnType<typeof getPayload>>) => {
  console.log("Updating site settings...");
  for (const locale of ["en", "fa"] as const) {
    const current = await payload.findGlobal({
      slug: "site-settings",
      locale,
      fallbackLocale: false,
      overrideAccess: true,
    });

    await payload.updateGlobal({
      slug: "site-settings",
      locale,
      data: {
        ...current,
        contact: {
          ...(current as any).contact,
          email: "Mimdezhalef@gmail.com",
          phone: "07633686661",
          mobilePhones: [{ number: "09059976166" }, { number: "09171600396" }],
          officeName:
            locale === "fa" ? "دفتر معماری الف" : "Alef Architecture Office",
        },
        social: {
          ...(current as any).social,
          instagram: "https://www.instagram.com/Alef.office",
          whatsapp: "https://wa.me/989059976166",
        },
        pages: {
          ...(current as any).pages,
          blog: false,
          contact: true,
        },
      },
      context: noRevalidate,
      overrideAccess: true,
    });
  }
};

const upsertTeam = async (payload: Awaited<ReturnType<typeof getPayload>>) => {
  console.log("Upserting team members...");
  const teamIds: number[] = [];

  for (const person of teamImages) {
    console.log(`Team: ${person.slug}`);
    const source = path.join(sourceRoot, person.file);
    const optimized = await optimize(source, `client-20260622-team-${person.slug}.webp`, {
      square: true,
      width: 1400,
    });
    const portrait = await upload(payload, "team-media", optimized, person.fa.name);

    const existing = await payload.find({
      collection: "team",
      where: { slug: { equals: person.slug } },
      limit: 1,
      locale: "en",
      overrideAccess: true,
    });

    const baseData = {
      profilePicture: portrait.id,
      employmentStatus: "active" as const,
      orgRoles: person.orgRoles,
      slug: person.slug,
    };

    const enData = {
      ...baseData,
      name: person.en.name,
      role: person.en.role,
      bio: `${person.en.name} is part of Alef Office's ${person.en.role.toLowerCase()}, contributing to the studio's architectural and operational work.`,
      skills: [{ skill: person.en.role }],
    };

    const faData = {
      name: person.fa.name,
      role: person.fa.role,
      bio: `${person.fa.name} عضو ${person.fa.role} دفتر الف است و در پیشبرد پروژه‌ها و فعالیت‌های تخصصی دفتر نقش دارد.`,
      skills: [{ skill: person.fa.role }],
    };

    const doc = existing.docs[0]
      ? await payload.update({
          collection: "team",
          id: existing.docs[0].id,
          data: enData as any,
          locale: "en",
          context: noRevalidate,
          overrideAccess: true,
        })
      : await payload.create({
          collection: "team",
          data: enData as any,
          locale: "en",
          context: noRevalidate,
          overrideAccess: true,
        });

    await payload.update({
      collection: "team",
      id: (doc as any).id,
      data: faData as any,
      locale: "fa",
      context: noRevalidate,
      overrideAccess: true,
    });

    teamIds.push((doc as any).id as number);
  }

  return teamIds;
};

const upsertProjectType = async (payload: Awaited<ReturnType<typeof getPayload>>) => {
  console.log("Upserting project type...");
  const slug = "commercial";
  const existing = await payload.find({
    collection: "case-study-type",
    where: { slug: { equals: slug } },
    limit: 1,
    locale: "en",
    overrideAccess: true,
  });

  const doc = existing.docs[0]
    ? await payload.update({
        collection: "case-study-type",
        id: existing.docs[0].id,
        data: { title: "Commercial", slug },
        locale: "en",
        context: noRevalidate,
        overrideAccess: true,
      })
    : await payload.create({
        collection: "case-study-type",
        data: { title: "Commercial", slug },
        locale: "en",
        context: noRevalidate,
        overrideAccess: true,
      });

  await payload.update({
    collection: "case-study-type",
    id: doc.id,
    data: { title: "تجاری", slug },
    locale: "fa",
    context: noRevalidate,
    overrideAccess: true,
  });

  return doc.id as number;
};

const upsertLalezar = async (
  payload: Awaited<ReturnType<typeof getPayload>>,
  projectTypeId: number,
  teamIds: number[],
) => {
  console.log("Upserting Lalezar project...");
  const files = ["IMG_9921.PNG", "IMG_9922.PNG", "IMG_9923.PNG", "IMG_9924.PNG"];
  const uploaded = [];

  for (const [index, file] of files.entries()) {
    console.log(`Lalezar image ${index + 1}`);
    const optimized = await optimize(
      path.join(sourceRoot, "lalezar", file),
      `client-20260622-lalezar-${index + 1}.webp`,
      { width: 1800 },
    );
    uploaded.push(await upload(payload, "case-study-media", optimized, `Lalezar project image ${index + 1}`));
  }

  const existing = await payload.find({
    collection: "case-studies",
    where: { slug: { equals: "lalezar" } },
    limit: 1,
    locale: "en",
    overrideAccess: true,
  });

  const baseData = {
    projectType: projectTypeId,
    projectStatus: "built" as const,
    featuredImage: uploaded[0].id,
    projectGallery: uploaded.slice(1).map((image, index) => ({
      image: image.id,
      caption: `Lalezar project view ${index + 2}`,
    })),
    credits: {
      team: teamIds,
    },
    publishedAt: new Date().toISOString(),
    _status: "published",
    slug: "lalezar",
  };

  const enData = {
    ...baseData,
    title: "Lalezar",
    subtitle: "A compact architectural project shaped by material warmth and precise detailing",
    projectBrief:
      "Lalezar is presented as a focused Alef Office project where atmosphere, scale, and material choices work together to create a refined spatial experience.",
    details: richText([
      "The Lalezar project is organized around a calm architectural language, pairing controlled proportions with warm surfaces and carefully framed views.",
      "Its imagery suggests an intimate design approach: details are kept deliberate, circulation remains clear, and each surface contributes to the overall character of the space.",
    ]),
    keywords: [
      { keyword: "Commercial" },
      { keyword: "Interior architecture" },
      { keyword: "Detailing" },
    ],
    client: "Private Client",
    location: { city: "Bandar Abbas", country: "Iran" },
    meta: {
      title: "Lalezar Project | Alef Architecture Office",
      description:
        "Lalezar is an Alef Architecture Office project shaped by warm materiality, controlled proportions, and refined spatial detailing.",
      image: uploaded[0].id,
    },
  };

  const faData = {
    title: "لاله‌زار",
    subtitle: "پروژه‌ای فشرده با گرمای متریال و جزئیات دقیق",
    projectBrief:
      "لاله‌زار به‌عنوان یکی از پروژه‌های دفتر الف، بر تجربه فضایی سنجیده، مقیاس انسانی و انتخاب دقیق متریال تکیه دارد.",
    details: richText([
      "پروژه لاله‌زار با زبانی آرام و کنترل‌شده شکل گرفته است؛ تناسبات روشن، سطوح گرم و قاب‌بندی دقیق دیدها، هویت اصلی فضا را می‌سازند.",
      "در تصاویر پروژه، رویکردی جزئی‌نگر دیده می‌شود؛ مسیر حرکت خواناست، سطوح با دقت انتخاب شده‌اند و هر بخش در شکل‌گیری حال‌وهوای کلی فضا نقش دارد.",
    ]),
    keywords: [
      { keyword: "تجاری" },
      { keyword: "معماری داخلی" },
      { keyword: "جزئیات اجرایی" },
    ],
    client: "کارفرمای خصوصی",
    location: { city: "بندرعباس", country: "ایران" },
    projectGallery: uploaded.slice(1).map((image, index) => ({
      image: image.id,
      caption: `نمای ${index + 2} از پروژه لاله‌زار`,
    })),
    meta: {
      title: "پروژه لاله‌زار | دفتر معماری الف",
      description:
        "پروژه لاله‌زار از دفتر معماری الف با تمرکز بر متریال گرم، تناسبات کنترل‌شده و جزئیات دقیق فضایی.",
      image: uploaded[0].id,
    },
  };

  const doc = existing.docs[0]
    ? await payload.update({
        collection: "case-studies",
        id: existing.docs[0].id,
        data: enData as any,
        locale: "en",
        context: noRevalidate,
        overrideAccess: true,
      })
    : await payload.create({
        collection: "case-studies",
        data: enData as any,
        locale: "en",
        context: noRevalidate,
        overrideAccess: true,
      });

  await payload.update({
    collection: "case-studies",
    id: (doc as any).id,
    data: faData as any,
    locale: "fa",
    context: noRevalidate,
    overrideAccess: true,
  });
};

const main = async () => {
  console.log("Initializing Payload...");
  const payload = await getPayload({ config });
  await updateSiteSettings(payload);
  const teamIds = await upsertTeam(payload);
  const projectTypeId = await upsertProjectType(payload);
  await upsertLalezar(payload, projectTypeId, teamIds);
  payload.logger.info("Client contact, team, and Lalezar updates applied.");
  process.exit(0);
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
