// src/payload/collections/search/beforeSync.ts

import { BeforeSync, DocToSync } from "@payloadcms/plugin-search/types";

export const beforeSyncWithSearch: BeforeSync = async ({
  req,
  originalDoc,
  searchDoc,
}) => {
  const collection = searchDoc.doc?.relationTo;

  let title = originalDoc.title || "";
  let description = "";
  let image: { value: string | number; relationTo: string } | null = null;

  // This array will hold ALL the extra text we want to be searchable
  let extraKeywords: string[] = [];

  // Helper to extract ID safely whether populated or not
  const getId = (doc: any) =>
    typeof doc === "object" && doc !== null ? doc.id : doc;

  // --- HELPER: Resolve Relationship Titles (Tags/Categories) ---
  const resolveRelationshipTitles = async (
    ids: any[],
    collectionSlug: string,
    fieldToSelect: string = "title", // 'title' for categories, 'name' for tags
  ) => {
    if (!ids || !Array.isArray(ids) || ids.length === 0) return;

    // Fetch all related docs in parallel
    const docs = await Promise.all(
      ids.map(async (id) => {
        // If it's already populated (object), just use it
        if (typeof id === "object" && id !== null) return id;

        // If it's just an ID, fetch it from Payload
        try {
          return await req.payload.findByID({
            collection: collectionSlug as any,
            id,
            depth: 0,
          });
        } catch (e) {
          return null; // Handle deleted/missing docs gracefully
        }
      }),
    );

    // Extract the text (e.g. "Technology", "Design") and push to keywords
    docs.forEach((doc: any) => {
      if (doc && doc[fieldToSelect]) {
        extraKeywords.push(doc[fieldToSelect]);
      }
    });
  };

  // --- COLLECTION SPECIFIC LOGIC ---

  switch (collection) {
    case "posts": {
      title = originalDoc.title;
      description = originalDoc.subtitle || "";
      if (originalDoc.heroImage) {
        image = {
          value: getId(originalDoc.heroImage),
          relationTo: "blog-media",
        };
      }

      // 1. Flatten "Keywords" Array (Array of objects)
      if (originalDoc.keywords && Array.isArray(originalDoc.keywords)) {
        originalDoc.keywords.forEach((k: any) => {
          if (k.keyword) extraKeywords.push(k.keyword);
        });
      }

      // 2. Resolve "Categories" (Relationship)
      await resolveRelationshipTitles(
        originalDoc.categories,
        "categories",
        "title",
      );

      // 3. Resolve "Tags" (Relationship) - Assuming you have a 'tags' collection
      await resolveRelationshipTitles(originalDoc.tags, "tags", "name");

      break;
    }

    case "team": {
      title = originalDoc.name;
      description = originalDoc.role || "";
      if (originalDoc.profilePicture) {
        image = {
          value: getId(originalDoc.profilePicture),
          relationTo: "team-media",
        };
      }

      // 4. Flatten "Skills" Array (Array of objects)
      if (originalDoc.skills && Array.isArray(originalDoc.skills)) {
        originalDoc.skills.forEach((s: any) => {
          if (s.skill) extraKeywords.push(s.skill);
        });
      }
      break;
    }

    case "projects": {
      title = originalDoc.title;
      description = originalDoc.subtitle || "";
      if (originalDoc.featuredImage) {
        image = {
          value: getId(originalDoc.featuredImage),
          relationTo: "project-media",
        };
      }

      // If projects have tags/categories, add logic here too:
      await resolveRelationshipTitles(originalDoc.tags, "tags", "name");
      break;
    }

    case "case-studies": {
      title = originalDoc.title;
      description = originalDoc.subtitle || "";
      if (originalDoc.featuredImage) {
        image = {
          value: getId(originalDoc.featuredImage),
          relationTo: "case-study-media",
        };
      }
      await resolveRelationshipTitles(originalDoc.tags, "tags", "name");
      break;
    }
    case "static-pages": {
      title = originalDoc.title;
      // Use the manual 'path' field if present, otherwise fallback to slug
      const route = originalDoc.path || originalDoc.slug;
      // Important: Ensure it starts with / for the router
      searchDoc.slug = route.startsWith("/") ? route : `/${route}`;

      description = originalDoc.searchSummary || "";
      break;
    }
  }

  const modifiedDoc: DocToSync = {
    ...searchDoc,
    title,
    slug: originalDoc.slug,
    description,
    heroImage: image,
    // Join all collected keywords into one lowercase string for easy searching
    keywords: [title, description, ...extraKeywords]
      .filter(Boolean)
      .join(" ")
      .toLowerCase(),
  };

  return modifiedDoc;
};
