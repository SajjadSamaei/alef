import "dotenv/config";

import { getPayload } from "payload";
import config from "../src/payload.config";
import fs from "node:fs";
import path from "node:path";

type ImgInfo = {
  role: "featured" | "gallery" | "drawing";
  caption?: string | null;
  id: number | string;
  filename?: string | null;
  url?: string | null;
  width?: number | null;
  height?: number | null;
  aspectRatio?: number | null;
  orientation?: "landscape" | "portrait" | "square" | "unknown";
};

const toImgInfo = (
  role: ImgInfo["role"],
  media: any,
  caption?: string | null,
): ImgInfo | null => {
  if (!media || typeof media !== "object") return null;
  const width = media.width ?? null;
  const height = media.height ?? null;
  const aspectRatio = width && height ? +(width / height).toFixed(3) : null;
  let orientation: ImgInfo["orientation"] = "unknown";
  if (aspectRatio) {
    if (aspectRatio > 1.05) orientation = "landscape";
    else if (aspectRatio < 0.95) orientation = "portrait";
    else orientation = "square";
  }
  return {
    role,
    caption: caption ?? null,
    id: media.id,
    filename: media.filename ?? null,
    url: media.url ?? null,
    width,
    height,
    aspectRatio,
    orientation,
  };
};

const main = async () => {
  const payload = await getPayload({ config });

  const projects = await payload.find({
    collection: "case-studies",
    limit: 200,
    locale: "fa",
    depth: 2,
    overrideAccess: true,
  });

  const report = (projects.docs as any[]).map((project) => {
    const images: ImgInfo[] = [];

    const featured = toImgInfo("featured", project.featuredImage);
    if (featured) images.push(featured);

    for (const item of project.projectGallery || []) {
      const info = toImgInfo("gallery", item.image, item.caption);
      if (info) images.push(info);
    }

    for (const item of project.projectDrawings || []) {
      const info = toImgInfo("drawing", item.drawing, item.caption);
      if (info) images.push(info);
    }

    const portraitCount = images.filter((i) => i.orientation === "portrait").length;
    const landscapeCount = images.filter((i) => i.orientation === "landscape").length;

    return {
      id: project.id,
      title: project.title,
      slug: project.slug,
      imageCount: images.length,
      portraitCount,
      landscapeCount,
      squareOrUnknownCount: images.length - portraitCount - landscapeCount,
      images,
    };
  });

  const outDir = path.resolve(process.cwd(), "images-to-upload", "reports");
  fs.mkdirSync(outDir, { recursive: true });
  const outPath = path.join(outDir, "gallery-image-report.json");
  fs.writeFileSync(outPath, JSON.stringify(report, null, 2), "utf-8");

  console.log(`\nWrote report for ${report.length} projects to:\n${outPath}\n`);
  for (const p of report) {
    console.log(
      `${p.slug}: ${p.imageCount} images (portrait=${p.portraitCount}, landscape=${p.landscapeCount}, other=${p.squareOrUnknownCount})`,
    );
  }

  process.exit(0);
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
