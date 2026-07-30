// src/hooks/populateAuthors.ts
import type { CollectionAfterReadHook, TypedLocale } from "payload";
import type { Author, Post } from "@/src/payload-types";

export const populateAuthors: CollectionAfterReadHook<Post> = async ({
  doc,
  req,
  req: { payload, locale, fallbackLocale },
}) => {
  // 1. Admin UI Fix (Keep this)
  if (req.user) {
    return doc;
  }

  // 2. Check if there are authors to populate
  if (doc?.authors && doc.authors.length > 0) {
    const authorIDs = doc.authors.map((author) =>
      typeof author === "object" ? author.id : author,
    );

    try {
      // 3. Fetch authors
      const authorDocs = await payload.find({
        collection: "authors",
        where: {
          id: {
            in: authorIDs,
          },
        },
        locale: locale as TypedLocale,
        fallbackLocale: fallbackLocale as TypedLocale,
        depth: 1, // Ensure this depth is high enough to resolve the Team relationship
        pagination: false,
      });

      // 4. Map the full docs
      if (authorDocs.docs.length > 0) {
        doc.populatedAuthors = authorDocs.docs.map((authorDoc: Author) => ({
          id: authorDoc.id.toString(),
          name: authorDoc.name,
          role: authorDoc.role,
          bio: authorDoc.bio,
          image: authorDoc.image,
          twitter: authorDoc.twitter,
          linkedin: authorDoc.linkedin,
          instagram: authorDoc.instagram,
          website: authorDoc.website,

          // 👇 ADD THIS LINE
          // This passes the Team relationship object to the frontend
          associatedTeamMember: authorDoc.associatedTeamMember,
        }));
      }
    } catch (e) {
      console.error("Error populating authors:", e);
    }
  }

  return doc;
};
