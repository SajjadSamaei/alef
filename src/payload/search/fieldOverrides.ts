// src/payload/collections/search/searchFields.ts
import { Field } from "payload";

export const searchFields: Field[] = [
  {
    name: "slug",
    type: "text",
    index: true,
    admin: { readOnly: true },
  },
  {
    name: "description", // Normalized field for Subtitle / Bio / Summary
    type: "text",
    index: true,
    admin: { readOnly: true },
  },
  {
    name: "heroImage",
    // 1. CHANGE: Use 'relationship' instead of 'upload'
    type: "relationship",
    // 2. CHANGE: List EVERY media collection you have here
    relationTo: [
      "blog-media",
      "team-media",
      "project-media",
      "case-study-media",
    ],
    hasMany: false,
    index: true,
    admin: { readOnly: true },
  },
  {
    name: "keywords", // Flattened string of ALL searchable metadata
    type: "textarea", // Textarea allows more content
    index: true,
    admin: { readOnly: true },
  },
];
