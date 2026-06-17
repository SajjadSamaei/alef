import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const projectsRoot = path.resolve("Projects");
const outputRoot = path.join(projectsRoot, "optimized");
const allowedExtensions = new Set([".jpg", ".jpeg", ".png", ".webp"]);

await fs.rm(outputRoot, { recursive: true, force: true });
await fs.mkdir(outputRoot, { recursive: true });

const projectFolders = (await fs.readdir(projectsRoot, { withFileTypes: true }))
  .filter((entry) => entry.isDirectory() && entry.name !== "optimized")
  .sort((a, b) => a.name.localeCompare(b.name, "en"));

const manifest = [];

for (const projectFolder of projectFolders) {
  const sourceDir = path.join(projectsRoot, projectFolder.name);
  const destinationDir = path.join(outputRoot, projectFolder.name);
  await fs.mkdir(destinationDir, { recursive: true });

  const files = (await fs.readdir(sourceDir, { withFileTypes: true }))
    .filter(
      (entry) =>
        entry.isFile() &&
        allowedExtensions.has(path.extname(entry.name).toLowerCase()),
    )
    .sort((a, b) => a.name.localeCompare(b.name, "en", { numeric: true }));

  for (const [index, file] of files.entries()) {
    const source = path.join(sourceDir, file.name);
    const destination = path.join(
      destinationDir,
      `${String(index + 1).padStart(2, "0")}.webp`,
    );
    const sourceStats = await fs.stat(source);

    await sharp(source)
      .rotate()
      .resize({
        width: 2200,
        height: 2200,
        fit: "inside",
        withoutEnlargement: true,
      })
      .webp({ quality: 82, effort: 5, smartSubsample: true })
      .toFile(destination);

    const [outputStats, metadata] = await Promise.all([
      fs.stat(destination),
      sharp(destination).metadata(),
    ]);

    manifest.push({
      project: projectFolder.name,
      source: file.name,
      output: path.relative(projectsRoot, destination).replaceAll("\\", "/"),
      width: metadata.width,
      height: metadata.height,
      sourceBytes: sourceStats.size,
      outputBytes: outputStats.size,
      reduction: Number(
        ((1 - outputStats.size / sourceStats.size) * 100).toFixed(1),
      ),
    });
  }
}

await fs.writeFile(
  path.join(outputRoot, "manifest.json"),
  `${JSON.stringify(manifest, null, 2)}\n`,
);

const sourceBytes = manifest.reduce((total, item) => total + item.sourceBytes, 0);
const outputBytes = manifest.reduce((total, item) => total + item.outputBytes, 0);

console.log(
  `Prepared ${manifest.length} images: ${(sourceBytes / 1024 / 1024).toFixed(1)} MB -> ${(outputBytes / 1024 / 1024).toFixed(1)} MB`,
);
