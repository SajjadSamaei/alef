import "dotenv/config";

import { getPayload } from "payload";
import config from "../src/payload.config";

const mediaName = (value: any) =>
  typeof value === "object" && value ? value.filename || value.url || value.id : value;

const main = async () => {
  const payload = await getPayload({ config });

  const projects = await payload.find({
    collection: "case-studies",
    limit: 100,
    locale: "fa",
    depth: 1,
    overrideAccess: true,
  });

  console.log("\nPROJECTS");
  for (const project of projects.docs as any[]) {
    console.log({
      id: project.id,
      title: project.title,
      slug: project.slug,
      type: mediaName(project.projectType),
      status: project.projectStatus,
      featuredImage: mediaName(project.featuredImage),
      galleryCount: project.projectGallery?.length || 0,
      gallery: (project.projectGallery || []).map((item: any) => mediaName(item.image)),
    });
  }

  const team = await payload.find({
    collection: "team",
    limit: 100,
    locale: "fa",
    depth: 1,
    overrideAccess: true,
  });

  console.log("\nTEAM");
  for (const member of team.docs as any[]) {
    console.log({
      id: member.id,
      name: member.name,
      slug: member.slug,
      role: member.role,
      orgRoles: member.orgRoles,
      image: mediaName(member.profilePicture),
    });
  }

  const settings = await payload.findGlobal({
    slug: "site-settings",
    locale: "fa",
    depth: 1,
    overrideAccess: true,
  });

  console.log("\nSITE SETTINGS");
  console.log(JSON.stringify(settings, null, 2));

  process.exit(0);
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
