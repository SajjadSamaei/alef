import "dotenv/config";

import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { getPayload } from "payload";
import config from "../src/payload.config";

const root = process.cwd();
const optimizedRoot = path.join(root, "Projects", "optimized");
const backupRoot = path.join(root, "backups");

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

const projects = [
  {
    slug: "eight",
    folder: "8",
    hero: "06.webp",
    type: "residential",
    status: "built",
    en: {
      title: "Eight",
      subtitle: "A precise rhythm of depth, light, and vertical shadow",
      brief:
        "A completed urban residential building whose layered white facade uses deep frames, vertical fins, and blue glazing to balance privacy with daylight.",
      details: [
        "Eight is organized around a disciplined facade grid. Recessed openings and projecting white frames give the elevation depth while protecting the interiors from direct sun.",
        "The vertical fins extend the building's proportions and create a changing pattern of shadow through the day. Blue-toned glazing adds a restrained contrast to the pale mineral envelope.",
      ],
      city: "Iran",
      country: "Iran",
      keywords: ["Residential", "Built", "Facade design", "Daylight"],
      materials: ["White mineral render", "Glass", "Metal fins"],
      structure: "Reinforced concrete frame",
      sustainability: "Passive solar shading and controlled daylight",
      features: ["Deep facade frames", "Vertical sun screens", "Recessed balconies"],
      seoTitle: "Eight Residential Project | Alef Architecture Office",
      seoDescription:
        "Explore Eight, a completed residential project by Alef Architecture Office shaped by deep white frames, vertical shading, and controlled daylight.",
    },
    fa: {
      title: "هشت",
      subtitle: "ریتمی دقیق از عمق، نور و سایه‌های عمودی",
      brief:
        "ساختمانی مسکونی و اجراشده در بافت شهری که نمای سفید لایه‌مند آن با قاب‌های عمیق، تیغه‌های عمودی و شیشه آبی، میان حریم خصوصی و نور روز تعادل ایجاد می‌کند.",
      details: [
        "پروژه هشت بر پایه یک شبکه منظم در نما شکل گرفته است. بازشوهای عقب‌نشسته و قاب‌های سفید پیش‌آمده، ضمن ایجاد عمق، فضای داخلی را از تابش مستقیم محافظت می‌کنند.",
        "تیغه‌های عمودی تناسبات بنا را کشیده‌تر کرده و در طول روز الگوی متغیری از سایه می‌سازند. شیشه‌های آبی نیز تضادی کنترل‌شده با پوسته روشن بنا ایجاد می‌کنند.",
      ],
      city: "ایران",
      country: "ایران",
      keywords: ["مسکونی", "اجراشده", "طراحی نما", "نور روز"],
      materials: ["اندود معدنی سفید", "شیشه", "تیغه فلزی"],
      structure: "اسکلت بتن‌آرمه",
      sustainability: "کنترل تابش مستقیم و بهره‌گیری از نور طبیعی",
      features: ["قاب‌های عمیق نما", "سایه‌بان‌های عمودی", "بالکن‌های عقب‌نشسته"],
      seoTitle: "پروژه مسکونی هشت | دفتر معماری الف",
      seoDescription:
        "پروژه مسکونی اجراشده هشت از دفتر معماری الف؛ ترکیبی از قاب‌های سفید عمیق، سایه‌بان‌های عمودی و نور طبیعی کنترل‌شده.",
    },
  },
  {
    slug: "edge",
    folder: "edge",
    hero: "01.webp",
    type: "residential",
    status: "schematic",
    en: {
      title: "Edge",
      subtitle: "Layered terraces define a calm urban edge",
      brief:
        "A mid-rise residential proposal composed as a stack of shaded terraces, recessed rooms, and slender vertical screens.",
      details: [
        "Edge turns the residential facade into a sequence of inhabitable thresholds. Terraces wrap the corners and soften the transition between private interiors and the city.",
        "A restrained palette keeps attention on proportion, shadow, and the changing depth of the elevation. Vertical screens provide privacy without closing the apartments to light.",
      ],
      country: "Iran",
      keywords: ["Residential", "Terraces", "Urban housing", "Privacy"],
      materials: ["Light render", "Glass", "Powder-coated metal"],
      structure: "Reinforced concrete frame",
      sustainability: "Shaded terraces and filtered daylight",
      features: ["Corner terraces", "Privacy screens", "Layered facade"],
      seoTitle: "Edge Residential Project | Alef Architecture Office",
      seoDescription:
        "Edge is Alef Architecture Office's layered residential proposal, combining generous terraces, privacy screens, and a calm material palette.",
    },
    fa: {
      title: "اِج",
      subtitle: "تراس‌های لایه‌مند، لبه‌ای آرام برای شهر می‌سازند",
      brief:
        "پیشنهادی برای یک ساختمان مسکونی میان‌مرتبه که از لایه‌های تراس‌های سایه‌دار، فضاهای عقب‌نشسته و صفحات عمودی ظریف شکل گرفته است.",
      details: [
        "اِج نمای مسکونی را به مجموعه‌ای از آستانه‌های قابل سکونت تبدیل می‌کند. تراس‌ها در گوشه‌ها امتداد یافته و مرز میان فضای خصوصی و شهر را نرم‌تر می‌کنند.",
        "پالت محدود مصالح، توجه را بر تناسب، سایه و عمق متغیر نما نگه می‌دارد. صفحات عمودی بدون حذف نور، حریم لازم را برای واحدها فراهم می‌کنند.",
      ],
      country: "ایران",
      keywords: ["مسکونی", "تراس", "مسکن شهری", "حریم خصوصی"],
      materials: ["اندود روشن", "شیشه", "فلز رنگ‌شده"],
      structure: "اسکلت بتن‌آرمه",
      sustainability: "تراس‌های سایه‌دار و نور طبیعی فیلترشده",
      features: ["تراس‌های گوشه‌ای", "صفحات حریم‌ساز", "نمای لایه‌مند"],
      seoTitle: "پروژه مسکونی اِج | دفتر معماری الف",
      seoDescription:
        "پروژه مسکونی اِج از دفتر معماری الف با تراس‌های پیوسته، صفحات حریم‌ساز و ترکیبی آرام از نور، سایه و عمق.",
    },
  },
  {
    slug: "fanoos",
    folder: "fanoos",
    hero: "03.webp",
    type: "mixed-use",
    status: "schematic",
    en: {
      title: "Fanoos",
      subtitle: "A luminous urban marker framed in dark metal",
      brief:
        "A slender mixed-use building defined by an asymmetric dark frame, projecting glazed rooms, and planted vertical pockets.",
      details: [
        "Fanoos is conceived as an urban lantern: a narrow building whose illuminated interiors become part of the street after dusk.",
        "The dark structural frame gathers balconies, glazing, and planted voids into one legible composition. Its asymmetry responds to views and gives the corner a distinct identity.",
      ],
      country: "Iran",
      keywords: ["Mixed-use", "Urban infill", "Vertical garden", "Facade"],
      materials: ["Dark metal", "Glass", "Light render"],
      structure: "Reinforced concrete frame with metal facade elements",
      sustainability: "Planted terraces and recessed glazing",
      features: ["Projecting glass bay", "Vertical planting", "Asymmetric frame"],
      seoTitle: "Fanoos Mixed-use Project | Alef Architecture Office",
      seoDescription:
        "Discover Fanoos, a slender mixed-use proposal by Alef Architecture Office with a dark frame, luminous glazing, and planted urban terraces.",
    },
    fa: {
      title: "فانوس",
      subtitle: "نشانه‌ای روشن در شهر، درون قاب فلزی تیره",
      brief:
        "ساختمانی باریک و چندمنظوره که با قاب تیره نامتقارن، فضاهای شیشه‌ای پیش‌آمده و حفره‌های سبز عمودی تعریف می‌شود.",
      details: [
        "فانوس به‌عنوان چراغی شهری تصور شده است؛ بنایی باریک که در ساعات غروب، روشنایی فضاهای داخلی آن به بخشی از سیمای خیابان تبدیل می‌شود.",
        "قاب تیره، بالکن‌ها، شیشه و فضاهای سبز را در یک ترکیب خوانا جمع می‌کند. نامتقارن بودن نما به دیدها پاسخ می‌دهد و برای گوشه شهری هویتی متمایز می‌سازد.",
      ],
      country: "ایران",
      keywords: ["چندمنظوره", "میان‌افزای شهری", "فضای سبز عمودی", "نما"],
      materials: ["فلز تیره", "شیشه", "اندود روشن"],
      structure: "اسکلت بتن‌آرمه با اجزای فلزی نما",
      sustainability: "تراس‌های سبز و شیشه‌های عقب‌نشسته",
      features: ["باکس شیشه‌ای پیش‌آمده", "کاشت عمودی", "قاب نامتقارن"],
      seoTitle: "پروژه چندمنظوره فانوس | دفتر معماری الف",
      seoDescription:
        "پروژه فانوس از دفتر معماری الف؛ ساختمانی باریک با قاب تیره، فضاهای شیشه‌ای روشن و تراس‌های سبز شهری.",
    },
  },
  {
    slug: "rema",
    folder: "rema",
    hero: "01.webp",
    type: "residential",
    status: "schematic",
    en: {
      title: "Rema",
      subtitle: "Two complementary faces, one measured facade",
      brief:
        "A residential facade study that balances a quiet solid volume with a projecting glazed grid animated by warm interior light.",
      details: [
        "Rema divides the elevation into complementary conditions: a calm, weighty plane and a lighter glazed structure that projects toward the street.",
        "The contrast creates a clear hierarchy while balconies and warm-lit interiors add domestic scale. The composition remains deliberately frontal and precise.",
      ],
      country: "Iran",
      keywords: ["Residential", "Facade study", "Glazed bay", "Urban identity"],
      materials: ["Textured render", "Glass", "Dark metal"],
      structure: "Reinforced concrete frame",
      sustainability: "Recessed glazing and shaded balconies",
      features: ["Split facade", "Projecting glazed grid", "Integrated balconies"],
      seoTitle: "Rema Residential Project | Alef Architecture Office",
      seoDescription:
        "Rema is a residential facade proposal by Alef Architecture Office, pairing a solid textured plane with a warm projecting glass grid.",
    },
    fa: {
      title: "رِما",
      subtitle: "دو چهره مکمل در یک نمای سنجیده",
      brief:
        "مطالعه‌ای برای نمای مسکونی که میان یک حجم صلب و آرام و شبکه شیشه‌ای پیش‌آمده با نور گرم داخلی تعادل برقرار می‌کند.",
      details: [
        "رِما نمای اصلی را به دو وضعیت مکمل تقسیم می‌کند: صفحه‌ای آرام و سنگین در کنار سازه‌ای سبک‌تر و شفاف که به سمت خیابان پیش می‌آید.",
        "این تضاد سلسله‌مراتبی روشن می‌سازد و بالکن‌ها و نور گرم فضای داخلی، مقیاس سکونت را به نما می‌افزایند. ترکیب کلی آگاهانه مستقیم و دقیق باقی می‌ماند.",
      ],
      country: "ایران",
      keywords: ["مسکونی", "مطالعه نما", "باکس شیشه‌ای", "هویت شهری"],
      materials: ["اندود بافت‌دار", "شیشه", "فلز تیره"],
      structure: "اسکلت بتن‌آرمه",
      sustainability: "شیشه عقب‌نشسته و بالکن‌های سایه‌دار",
      features: ["نمای دو بخشی", "شبکه شیشه‌ای پیش‌آمده", "بالکن‌های یکپارچه"],
      seoTitle: "پروژه مسکونی رِما | دفتر معماری الف",
      seoDescription:
        "پروژه رِما از دفتر معماری الف؛ ترکیب یک صفحه صلب با شبکه شیشه‌ای پیش‌آمده و نور گرم برای تعریف هویت نمای مسکونی.",
    },
  },
  {
    slug: "tajeer",
    folder: "tajeer",
    hero: "01.webp",
    type: "commercial",
    status: "schematic",
    en: {
      title: "Tajeer",
      subtitle: "A porous screen gives retail a civic presence",
      brief:
        "A corner commercial building with transparent retail floors anchored by a finely perforated upper volume and a strong continuous canopy.",
      details: [
        "Tajeer uses a porous upper screen to turn a large commercial volume into a calm, finely scaled urban facade. The screen filters light and conceals service functions without becoming opaque.",
        "At street level, continuous glazing and a dark canopy create visibility for shops and a sheltered pedestrian edge. The angled corner draws movement around the building.",
      ],
      country: "Iran",
      keywords: ["Commercial", "Retail", "Perforated screen", "Corner building"],
      materials: ["Perforated masonry screen", "Glass", "Dark metal"],
      structure: "Reinforced concrete frame",
      sustainability: "Solar filtering facade and shaded storefronts",
      features: ["Perforated upper screen", "Continuous retail glazing", "Corner canopy"],
      seoTitle: "Tajeer Commercial Project | Alef Architecture Office",
      seoDescription:
        "Tajeer is a commercial corner project by Alef Architecture Office, combining transparent retail frontage with a refined perforated upper screen.",
    },
    fa: {
      title: "تجیر",
      subtitle: "پوسته‌ای مشبک، حضوری شهری به فضای تجاری می‌بخشد",
      brief:
        "بنایی تجاری در گوشه شهری با طبقات شفاف فروشگاهی، حجم فوقانی مشبک و سایبان پیوسته و شاخص در تراز خیابان.",
      details: [
        "تجیر با استفاده از پوسته مشبک در طبقات بالا، حجم بزرگ تجاری را به نمایی آرام و ریزمقیاس تبدیل می‌کند. این پوسته نور را فیلتر و عملکردهای خدماتی را بدون ایجاد سطحی بسته پنهان می‌کند.",
        "در تراز خیابان، شیشه پیوسته و سایبان تیره، ویترین‌ها را خوانا کرده و لبه‌ای محفوظ برای عابر می‌سازد. گوشه زاویه‌دار، حرکت را پیرامون بنا هدایت می‌کند.",
      ],
      country: "ایران",
      keywords: ["تجاری", "خرده‌فروشی", "پوسته مشبک", "ساختمان گوشه"],
      materials: ["پوسته بنایی مشبک", "شیشه", "فلز تیره"],
      structure: "اسکلت بتن‌آرمه",
      sustainability: "فیلتر تابش و سایه‌اندازی بر ویترین‌ها",
      features: ["پوسته مشبک فوقانی", "ویترین شیشه‌ای پیوسته", "سایبان گوشه"],
      seoTitle: "پروژه تجاری تجیر | دفتر معماری الف",
      seoDescription:
        "پروژه تجاری تجیر از دفتر معماری الف؛ ترکیب ویترین‌های شفاف، سایبان پیوسته و پوسته مشبک برای ساختن یک نشانه شهری.",
    },
  },
  {
    slug: "void",
    folder: "void",
    hero: "05.webp",
    type: "residential",
    status: "schematic",
    en: {
      title: "Void",
      subtitle: "The courtyard becomes the center of domestic life",
      brief:
        "A low-rise residential composition arranged around a transparent central void, with quiet street walls and sheltered garden-facing rooms.",
      details: [
        "Void begins with subtraction. A glazed courtyard is carved from the center of the house, drawing daylight deep into the plan and linking the surrounding rooms.",
        "Toward the street, the composition is controlled and private. Inside, projecting upper volumes frame the garden and create shaded thresholds around the transparent heart of the home.",
      ],
      country: "Iran",
      keywords: ["Residential", "Courtyard house", "Daylight", "Privacy"],
      materials: ["Light metal cladding", "Glass", "Textured masonry"],
      structure: "Reinforced concrete frame",
      sustainability: "Central daylight court and shaded garden edges",
      features: ["Glazed central courtyard", "Projecting upper volumes", "Private street facade"],
      seoTitle: "Void Courtyard House | Alef Architecture Office",
      seoDescription:
        "Void is Alef Architecture Office's courtyard house proposal, organized around a transparent central garden that brings daylight into the plan.",
    },
    fa: {
      title: "وُید",
      subtitle: "حیاط به مرکز زندگی خانه تبدیل می‌شود",
      brief:
        "ترکیبی مسکونی و کم‌ارتفاع پیرامون یک فضای خالی شفاف مرکزی، با جداره‌ای آرام رو به خیابان و اتاق‌هایی محافظت‌شده رو به باغ.",
      details: [
        "وُید با کاستن آغاز می‌شود. حیاطی شفاف از مرکز خانه جدا شده تا نور روز را به عمق پلان ببرد و فضاهای پیرامون را به یکدیگر پیوند دهد.",
        "در سمت خیابان، ترکیب کنترل‌شده و محرم است. در داخل، حجم‌های طبقه بالا باغ را قاب می‌کنند و پیرامون قلب شفاف خانه آستانه‌هایی سایه‌دار می‌سازند.",
      ],
      country: "ایران",
      keywords: ["مسکونی", "خانه حیاط‌دار", "نور روز", "حریم خصوصی"],
      materials: ["پوشش فلزی روشن", "شیشه", "مصالح بنایی بافت‌دار"],
      structure: "اسکلت بتن‌آرمه",
      sustainability: "حیاط مرکزی نورگیر و لبه‌های سایه‌دار باغ",
      features: ["حیاط مرکزی شفاف", "حجم‌های پیش‌آمده", "نمای محرم رو به خیابان"],
      seoTitle: "خانه حیاط‌دار وُید | دفتر معماری الف",
      seoDescription:
        "پروژه وُید از دفتر معماری الف؛ خانه‌ای پیرامون حیاط شفاف مرکزی که نور روز، باغ و فضاهای داخلی را به هم پیوند می‌دهد.",
    },
  },
] as const;

const payload = await getPayload({ config });
const seedContext = { disableRevalidate: true };

async function upload(
  collection: "case-study-media" | "media" | "team-media",
  filePath: string,
  alt: string,
) {
  const data = await fs.readFile(filePath);
  const document = await payload.create({
    collection,
    data: { alt },
    file: {
      data,
      mimetype: "image/webp",
      name: path.basename(filePath),
      size: data.length,
    },
    overrideAccess: true,
  });

  if (!document.url?.startsWith("https://storage.alef-office.ir")) {
    throw new Error(
      `Unexpected upload URL for ${path.basename(filePath)}: ${document.url}`,
    );
  }
  return document;
}

await fs.mkdir(backupRoot, { recursive: true });
const [oldProjects, oldTeam] = await Promise.all([
  payload.find({
    collection: "case-studies",
    depth: 2,
    limit: 1000,
    overrideAccess: true,
  }),
  payload.find({
    collection: "team",
    depth: 2,
    limit: 1000,
    overrideAccess: true,
  }),
]);
await fs.writeFile(
  path.join(backupRoot, `content-before-seed-${Date.now()}.json`),
  JSON.stringify(
    { caseStudies: oldProjects.docs, team: oldTeam.docs },
    null,
    2,
  ),
);

for (const document of oldProjects.docs) {
  await payload.delete({
    collection: "case-studies",
    id: document.id,
    context: seedContext,
    overrideAccess: true,
  });
}
for (const document of oldTeam.docs) {
  await payload.delete({
    collection: "team",
    id: document.id,
    overrideAccess: true,
  });
}

const typeNames = {
  residential: { en: "Residential", fa: "مسکونی" },
  commercial: { en: "Commercial", fa: "تجاری" },
  "mixed-use": { en: "Mixed-use", fa: "چندمنظوره" },
};
const typeIds = new Map<string, number>();
for (const [slug, names] of Object.entries(typeNames)) {
  const existing = await payload.find({
    collection: "case-study-type",
    where: { slug: { equals: slug } },
    limit: 1,
    overrideAccess: true,
  });
  const type =
    existing.docs[0] ??
    (await payload.create({
      collection: "case-study-type",
      locale: "en",
      data: { title: names.en, slug },
      overrideAccess: true,
    }));
  await payload.update({
    collection: "case-study-type",
    id: type.id,
    locale: "fa",
    data: { title: names.fa },
    overrideAccess: true,
  });
  typeIds.set(slug, Number(type.id));
}

const projectMedia = new Map<string, Awaited<ReturnType<typeof upload>>[]>();
const generalMedia = new Map<string, Awaited<ReturnType<typeof upload>>>();

for (const project of projects) {
  const files = (await fs.readdir(path.join(optimizedRoot, project.folder)))
    .filter((file) => file.endsWith(".webp"))
    .sort();
  const ordered = [
    project.hero,
    ...files.filter((file) => file !== project.hero),
  ];
  const uploads = [];
  for (const [index, file] of ordered.entries()) {
    uploads.push(
      await upload(
        "case-study-media",
        path.join(optimizedRoot, project.folder, file),
        `${project.en.title} architecture project view ${index + 1}`,
      ),
    );
  }
  projectMedia.set(project.slug, uploads);
  generalMedia.set(
    project.slug,
    await upload(
      "media",
      path.join(optimizedRoot, project.folder, project.hero),
      `${project.en.title} project by Alef Architecture Office`,
    ),
  );
}

const initialsPath = path.join(optimizedRoot, "homayoun-hosseinzadeh.webp");
const initialsSvg = Buffer.from(`
  <svg width="1200" height="1200" xmlns="http://www.w3.org/2000/svg">
    <rect width="1200" height="1200" fill="#e7e5e4"/>
    <rect x="120" y="120" width="960" height="960" fill="#f8fafc" stroke="#171717" stroke-width="3"/>
    <text x="600" y="650" text-anchor="middle" font-family="Arial, sans-serif" font-size="250" letter-spacing="18" fill="#171717">HH</text>
    <text x="600" y="790" text-anchor="middle" font-family="Arial, sans-serif" font-size="38" letter-spacing="8" fill="#525252">ALEF ARCHITECTURE OFFICE</text>
  </svg>
`);
await sharp(initialsSvg).webp({ quality: 88 }).toFile(initialsPath);
const teamImage = await upload(
  "team-media",
  initialsPath,
  "Homayoun Hosseinzadeh, CEO of Alef Architecture Office",
);

const homayoun = await payload.create({
  collection: "team",
  locale: "en",
  data: {
    name: "Homayoun Hosseinzadeh",
    role: "Chief Executive Officer",
    profilePicture: teamImage.id,
    bio: "Chief Executive Officer of Alef Architecture Office, guiding the studio's design direction, client relationships, and delivery standards.",
    skills: [
      { skill: "Design leadership" },
      { skill: "Architectural strategy" },
      { skill: "Project delivery" },
    ],
    details: richText([
      "Homayoun Hosseinzadeh leads Alef Architecture Office with a focus on clear design thinking, responsible project delivery, and long-term value for clients and communities.",
    ]),
    employmentStatus: "active",
    orgRoles: ["leadership"],
    contactInfo: { email: "info@alef-office.ir", website: "https://alef-office.ir" },
    slug: "homayoun-hosseinzadeh",
  },
  overrideAccess: true,
});
await payload.update({
  collection: "team",
  id: homayoun.id,
  locale: "fa",
  data: {
    name: "همایون حسین‌زاده",
    role: "مدیرعامل",
    bio: "مدیرعامل دفتر معماری الف؛ مسئول هدایت مسیر طراحی، ارتباط با کارفرمایان و استانداردهای اجرای پروژه.",
    skills: [
      { skill: "رهبری طراحی" },
      { skill: "راهبرد معماری" },
      { skill: "مدیریت و تحویل پروژه" },
    ],
    details: richText([
      "همایون حسین‌زاده دفتر معماری الف را با تمرکز بر تفکر شفاف طراحی، تحویل مسئولانه پروژه و خلق ارزش ماندگار برای کارفرما و جامعه هدایت می‌کند.",
    ]),
  },
  overrideAccess: true,
});

for (const project of projects) {
  const media = projectMedia.get(project.slug)!;
  const common = {
    projectType: typeIds.get(project.type),
    projectStatus: project.status,
    featuredImage: media[0].id,
    projectGallery: media.slice(1).map((image, index) => ({
      image: image.id,
      caption: `${project.en.title} project view ${index + 2}`,
    })),
    location: { country: project.en.country },
    technicalSpecs: {
      materials: project.en.materials.map((material) => ({ material })),
      structureSystem: project.en.structure,
      sustainability: project.en.sustainability,
    },
    featuresBySection: [
      {
        sectionType: "primary_features",
        features: project.en.features.map((feature) => ({
          name: feature,
          valueType: "boolean",
          booleanValue: true,
        })),
      },
    ],
    credits: { team: [homayoun.id] },
    meta: {
      title: project.en.seoTitle,
      description: project.en.seoDescription,
      image: media[0].id,
    },
    _status: "published" as const,
    publishedAt: new Date().toISOString(),
    slug: project.slug,
  };
  const created = await payload.create({
    collection: "case-studies",
    locale: "en",
    draft: false,
    context: seedContext,
    data: {
      ...common,
      title: project.en.title,
      subtitle: project.en.subtitle,
      projectBrief: project.en.brief,
      details: richText(project.en.details),
      keywords: project.en.keywords.map((keyword) => ({ keyword })),
      client: "Private Client",
    } as any,
    overrideAccess: true,
  });
  await payload.update({
    collection: "case-studies",
    id: created.id,
    locale: "fa",
    draft: false,
    context: seedContext,
    data: {
      title: project.fa.title,
      subtitle: project.fa.subtitle,
      projectBrief: project.fa.brief,
      details: richText(project.fa.details),
      keywords: project.fa.keywords.map((keyword) => ({ keyword })),
      client: "کارفرمای خصوصی",
      location: { country: project.fa.country },
      technicalSpecs: {
        materials: project.fa.materials.map((material) => ({ material })),
        structureSystem: project.fa.structure,
        sustainability: project.fa.sustainability,
      },
      featuresBySection: [
        {
          sectionType: "primary_features",
          features: project.fa.features.map((feature) => ({
            name: feature,
            valueType: "boolean",
            booleanValue: true,
          })),
        },
      ],
      projectGallery: media.slice(1).map((image, index) => ({
        image: image.id,
        caption: `نمای ${index + 2} پروژه ${project.fa.title}`,
      })),
      meta: {
        title: project.fa.seoTitle,
        description: project.fa.seoDescription,
        image: media[0].id,
      },
      _status: "published",
    } as any,
    overrideAccess: true,
  });
}

const mediaId = (slug: string) => generalMedia.get(slug)!.id;
const landingEn = {
  hero: {
    title: "Architecture shaped by place",
    subtitle:
      "Alef Architecture Office designs thoughtful buildings, interiors, and urban spaces across Iran.",
    primaryButton: "View projects",
    secondaryButton: "Start a project",
  },
  projectsCopy: {
    eyebrow: "Selected work",
    title: "Projects with a clear idea",
    description:
      "From completed residences to commercial and mixed-use proposals, each project begins with context and is resolved through light, material, and proportion.",
    viewAll: "View all projects",
  },
  about: {
    eyebrow: "About Alef",
    title: "A design practice grounded in clarity",
    description:
      "We create architecture that responds to climate, city, and everyday life with precise, durable ideas.",
    learnMoreLink: "About the office",
    image: mediaId("eight"),
  },
  servicesCopy: {
    eyebrow: "What we do",
    title: "Architecture from first idea to delivery",
    description:
      "Integrated design services for buildings, interiors, urban contexts, construction supervision, and sensitive renewal.",
    architectureTitle: "Architecture",
    interiorTitle: "Interior design",
    urbanTitle: "Urban design",
    supervisionTitle: "Construction supervision",
    restorationTitle: "Renovation",
  },
  services: {
    architecture: mediaId("edge"),
    interior: mediaId("void"),
    urban: mediaId("fanoos"),
    supervision: mediaId("eight"),
    restoration: mediaId("rema"),
  },
  partnersTitle: "Selected collaborators",
  testimonial: {
    quote:
      "Good architecture turns constraints into a clear and lasting spatial idea.",
    authorName: "Alef Architecture Office",
    authorRole: "Design principle",
  },
  metadata: { metaImage: mediaId("tajeer") },
};
const landingFa = {
  hero: {
    title: "معماری برخاسته از بستر",
    subtitle:
      "دفتر معماری الف، ساختمان‌ها، فضاهای داخلی و محیط‌های شهری دقیق و معاصر طراحی می‌کند.",
    primaryButton: "مشاهده پروژه‌ها",
    secondaryButton: "شروع همکاری",
  },
  projectsCopy: {
    eyebrow: "آثار منتخب",
    title: "پروژه‌هایی با ایده روشن",
    description:
      "از خانه‌های اجراشده تا طرح‌های تجاری و چندمنظوره، هر پروژه با شناخت بستر آغاز و با نور، مصالح و تناسب تکمیل می‌شود.",
    viewAll: "همه پروژه‌ها",
  },
  about: {
    eyebrow: "درباره الف",
    title: "دفتر طراحی با تکیه بر وضوح",
    description:
      "معماری ما با ایده‌هایی دقیق و ماندگار به اقلیم، شهر و زندگی روزمره پاسخ می‌دهد.",
    learnMoreLink: "درباره دفتر",
    image: mediaId("eight"),
  },
  servicesCopy: {
    eyebrow: "خدمات ما",
    title: "از نخستین ایده تا تحویل پروژه",
    description:
      "خدمات یکپارچه طراحی معماری، داخلی، شهری، نظارت بر اجرا و بازآفرینی بنا.",
    architectureTitle: "معماری",
    interiorTitle: "طراحی داخلی",
    urbanTitle: "طراحی شهری",
    supervisionTitle: "نظارت بر اجرا",
    restorationTitle: "بازسازی",
  },
  testimonial: {
    quote: "معماری خوب، محدودیت‌ها را به یک ایده فضایی روشن و ماندگار تبدیل می‌کند.",
    authorName: "دفتر معماری الف",
    authorRole: "رویکرد طراحی",
  },
  partnersTitle: "همکاران منتخب",
};
await payload.updateGlobal({
  slug: "landing-page",
  locale: "en",
  data: landingEn,
  context: seedContext,
  overrideAccess: true,
});
await payload.updateGlobal({
  slug: "landing-page",
  locale: "fa",
  data: landingFa,
  context: seedContext,
  overrideAccess: true,
});

const servicesEn = {
  hero: {
    title: "Design services",
    description:
      "A coordinated architectural process from strategy and concept through technical development and site delivery.",
  },
  architecture: {
    title: "Architecture",
    subtitle: "Buildings shaped by context",
    description:
      "Residential, commercial, and mixed-use architecture developed through site, climate, program, and material.",
    quote: "A clear concept should survive every scale of a building.",
    detailsTitle: "Scope",
    tags: ["Feasibility", "Concept design", "Design development", "Documentation"].map(
      (label) => ({ label }),
    ),
    image: mediaId("edge"),
  },
  interior: {
    title: "Interior design",
    subtitle: "Spaces for everyday life",
    description:
      "Interior environments where circulation, light, built-in elements, and material work as one coherent system.",
    quote: "The interior begins with how a space is lived.",
    detailsTitle: "Scope",
    tags: ["Space planning", "Material palette", "Lighting", "Custom details"].map(
      (label) => ({ label }),
    ),
    image: mediaId("void"),
  },
  urban: {
    title: "Urban design",
    subtitle: "Architecture as part of the city",
    description:
      "Site and public-realm strategies that connect buildings to streets, movement, landscape, and community.",
    quote: "Every building contributes to a larger urban room.",
    detailsTitle: "Scope",
    tags: ["Site strategy", "Public realm", "Massing", "Urban guidelines"].map(
      (label) => ({ label }),
    ),
    image: mediaId("fanoos"),
  },
  supervision: {
    title: "Construction supervision",
    subtitle: "Protecting design quality on site",
    description:
      "Technical coordination, material review, and site observation to carry design intent into construction.",
    quote: "Quality is built through attentive decisions.",
    detailsTitle: "Scope",
    tags: ["Site review", "Detail coordination", "Material approval", "Quality control"].map(
      (label) => ({ label }),
    ),
    image: mediaId("eight"),
  },
  restoration: {
    title: "Renovation",
    subtitle: "New value within existing structures",
    description:
      "Careful transformation of existing buildings through reuse, targeted intervention, and improved performance.",
    quote: "Renewal begins by understanding what is already there.",
    detailsTitle: "Scope",
    tags: ["Existing conditions", "Adaptive reuse", "Facade renewal", "Interior retrofit"].map(
      (label) => ({ label }),
    ),
    image: mediaId("rema"),
  },
  process: {
    eyebrow: "Our process",
    title: "One continuous line from strategy to site",
    description:
      "Each phase builds on the decisions before it, keeping design ambition, technical reality, and budget aligned.",
    buttonLabel: "See our process",
  },
};
await payload.updateGlobal({
  slug: "services-page",
  locale: "en",
  data: servicesEn,
  context: seedContext,
  overrideAccess: true,
});
await payload.updateGlobal({
  slug: "services-page",
  locale: "fa",
  data: {
    hero: {
      title: "خدمات طراحی",
      description:
        "فرایندی هماهنگ از راهبرد و ایده تا توسعه فنی، نظارت و تحویل پروژه.",
    },
    architecture: {
      title: "معماری",
      subtitle: "ساختمان‌هایی برآمده از بستر",
      description:
        "طراحی پروژه‌های مسکونی، تجاری و چندمنظوره بر پایه سایت، اقلیم، برنامه و مصالح.",
      quote: "ایده روشن باید در تمام مقیاس‌های ساختمان حضور داشته باشد.",
      detailsTitle: "دامنه خدمات",
      tags: ["امکان‌سنجی", "طراحی کانسپت", "توسعه طرح", "مدارک اجرایی"].map(
        (label) => ({ label }),
      ),
    },
    interior: {
      title: "طراحی داخلی",
      subtitle: "فضاهایی برای زندگی روزمره",
      description:
        "طراحی فضاهای داخلی که حرکت، نور، عناصر ثابت و مصالح را در یک سیستم منسجم گرد هم می‌آورد.",
      quote: "فضای داخلی از شیوه زندگی در آن آغاز می‌شود.",
      detailsTitle: "دامنه خدمات",
      tags: ["برنامه‌ریزی فضا", "انتخاب مصالح", "نورپردازی", "جزئیات سفارشی"].map(
        (label) => ({ label }),
      ),
    },
    urban: {
      title: "طراحی شهری",
      subtitle: "معماری به‌عنوان بخشی از شهر",
      description:
        "راهبردهای سایت و فضای عمومی برای پیوند ساختمان با خیابان، حرکت، منظر و جامعه.",
      quote: "هر ساختمان بخشی از یک فضای شهری بزرگ‌تر است.",
      detailsTitle: "دامنه خدمات",
      tags: ["راهبرد سایت", "فضای عمومی", "حجم‌گذاری", "ضوابط شهری"].map(
        (label) => ({ label }),
      ),
    },
    supervision: {
      title: "نظارت بر اجرا",
      subtitle: "حفظ کیفیت طراحی در کارگاه",
      description:
        "هماهنگی فنی، بررسی مصالح و نظارت کارگاهی برای انتقال دقیق ایده طراحی به اجرا.",
      quote: "کیفیت از مجموعه تصمیم‌های دقیق ساخته می‌شود.",
      detailsTitle: "دامنه خدمات",
      tags: ["بازدید کارگاه", "هماهنگی جزئیات", "تأیید مصالح", "کنترل کیفیت"].map(
        (label) => ({ label }),
      ),
    },
    restoration: {
      title: "بازسازی",
      subtitle: "ارزش تازه در ساختار موجود",
      description:
        "دگرگونی سنجیده بناهای موجود با استفاده مجدد، مداخله هدفمند و بهبود عملکرد.",
      quote: "بازآفرینی با شناخت آنچه از قبل وجود دارد آغاز می‌شود.",
      detailsTitle: "دامنه خدمات",
      tags: ["شناخت وضع موجود", "استفاده مجدد", "بازطراحی نما", "بهسازی داخلی"].map(
        (label) => ({ label }),
      ),
    },
    process: {
      eyebrow: "فرایند ما",
      title: "مسیر پیوسته از راهبرد تا کارگاه",
      description:
        "هر مرحله بر تصمیم‌های مرحله قبل بنا می‌شود تا کیفیت طراحی، واقعیت فنی و بودجه همسو بمانند.",
      buttonLabel: "مشاهده فرایند",
    },
  },
  context: seedContext,
  overrideAccess: true,
});

const processImages = ["fanoos", "edge", "rema", "eight"];
const processEn = {
  hero: {
    title: "Our process",
    description:
      "A transparent sequence that turns a project's needs and constraints into a buildable architectural idea.",
  },
  vision: {
    title: "Vision and strategy",
    subtitle: "Define the right problem",
    paragraphs: [
      { text: "We begin with the site, brief, regulations, budget, and the client's long-term priorities." },
      { text: "The result is a clear design strategy and a shared definition of success." },
    ],
    detailsTitle: "Key outputs",
    tags: ["Brief", "Site analysis", "Feasibility", "Design strategy"].map((label) => ({ label })),
    image: mediaId(processImages[0]),
  },
  design: {
    title: "Concept and design",
    subtitle: "Turn strategy into space",
    paragraphs: [
      { text: "Massing, plans, sections, facade, light, and material are developed together through focused options." },
      { text: "Regular reviews keep the design legible and decisions timely." },
    ],
    detailsTitle: "Key outputs",
    tags: ["Concept", "Massing", "Plans", "Material direction"].map((label) => ({ label })),
    image: mediaId(processImages[1]),
  },
  technical: {
    title: "Technical development",
    subtitle: "Resolve the building",
    paragraphs: [
      { text: "The selected design is coordinated with structure, building systems, details, specifications, and approvals." },
      { text: "We protect the core idea while making it precise, compliant, and buildable." },
    ],
    detailsTitle: "Key outputs",
    tags: ["Coordination", "Details", "Documentation", "Approvals"].map((label) => ({ label })),
    image: mediaId(processImages[2]),
  },
  execution: {
    title: "Execution and supervision",
    subtitle: "Carry intent to site",
    paragraphs: [
      { text: "During construction we review materials, details, samples, and site conditions with the project team." },
      { text: "Close observation helps resolve change without losing architectural quality." },
    ],
    detailsTitle: "Key outputs",
    tags: ["Site observation", "Submittals", "Quality review", "Handover"].map((label) => ({ label })),
    image: mediaId(processImages[3]),
  },
};
await payload.updateGlobal({
  slug: "process-page",
  locale: "en",
  data: processEn,
  context: seedContext,
  overrideAccess: true,
});
await payload.updateGlobal({
  slug: "process-page",
  locale: "fa",
  data: {
    hero: {
      title: "فرایند ما",
      description:
        "مسیری شفاف که نیازها و محدودیت‌های پروژه را به یک ایده معماری قابل ساخت تبدیل می‌کند.",
    },
    vision: {
      title: "چشم‌انداز و راهبرد",
      subtitle: "تعریف مسئله درست",
      paragraphs: [
        { text: "کار را با شناخت سایت، برنامه، ضوابط، بودجه و اولویت‌های بلندمدت کارفرما آغاز می‌کنیم." },
        { text: "خروجی این مرحله، راهبردی روشن و تعریف مشترکی از موفقیت پروژه است." },
      ],
      detailsTitle: "خروجی‌های اصلی",
      tags: ["برنامه پروژه", "تحلیل سایت", "امکان‌سنجی", "راهبرد طراحی"].map((label) => ({ label })),
    },
    design: {
      title: "ایده و طراحی",
      subtitle: "تبدیل راهبرد به فضا",
      paragraphs: [
        { text: "حجم، پلان، مقطع، نما، نور و مصالح به‌صورت هم‌زمان و در گزینه‌های متمرکز توسعه می‌یابند." },
        { text: "جلسات منظم، خوانایی طرح و به‌موقع بودن تصمیم‌ها را حفظ می‌کنند." },
      ],
      detailsTitle: "خروجی‌های اصلی",
      tags: ["کانسپت", "حجم‌گذاری", "پلان‌ها", "رویکرد مصالح"].map((label) => ({ label })),
    },
    technical: {
      title: "توسعه فنی",
      subtitle: "حل دقیق ساختمان",
      paragraphs: [
        { text: "طرح منتخب با سازه، تأسیسات، جزئیات، مشخصات فنی و الزامات تأیید هماهنگ می‌شود." },
        { text: "ایده اصلی را در مسیر تبدیل شدن به بنایی دقیق، منطبق و قابل اجرا حفظ می‌کنیم." },
      ],
      detailsTitle: "خروجی‌های اصلی",
      tags: ["هماهنگی", "جزئیات", "مدارک اجرایی", "تأییدها"].map((label) => ({ label })),
    },
    execution: {
      title: "اجرا و نظارت",
      subtitle: "انتقال ایده به کارگاه",
      paragraphs: [
        { text: "در زمان ساخت، مصالح، جزئیات، نمونه‌ها و شرایط کارگاه را همراه تیم پروژه بررسی می‌کنیم." },
        { text: "نظارت نزدیک کمک می‌کند تغییرات بدون از دست رفتن کیفیت معماری حل شوند." },
      ],
      detailsTitle: "خروجی‌های اصلی",
      tags: ["نظارت کارگاهی", "بررسی مدارک", "کنترل کیفیت", "تحویل"].map((label) => ({ label })),
    },
  },
  context: seedContext,
  overrideAccess: true,
});

console.log(
  `Seeded ${projects.length} projects, ${projectMedia.size} project galleries, one CEO, and all homepage/services/process media. Upload host verified.`,
);

if (payload.db.destroy) {
  await payload.db.destroy();
}
