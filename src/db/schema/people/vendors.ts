import {
  pgTable,
  uuid,
  text,
  pgEnum,
  jsonb,
  timestamp,
  index,
} from "drizzle-orm/pg-core";
import { relations, sql } from "drizzle-orm";

export const vendorTypeEnum = pgEnum("vendor_type", [
  "supplier", // Supplies materials/goods
  "contractor", // Performs work/services
  "service_provider", // Provides other services (e.g., IT, consulting)
  "manufacturer",
  "other",
]);

export const vendors = pgTable(
  "vendors",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    vendorName: text("name").notNull(),
    vendorType: text("type").notNull(),
    phone: text("phone"),
    website: text("website"),
    city: text("city"),
    specialtyTags: jsonb("specialty_tags")
      .$type<string[]>() // Store as an array of strings
      .notNull()
      .default(sql`'[]'::jsonb`), // Default to an empty array
    contactPerson: text("contact_person"),
    notes: text("notes"), // General internal notes
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdateFn(() => new Date()),
  },
  (table) => {
    return {
      // Unique constraint per user (if userId is not null) or globally
      vendorNameIdx: index("vendor_name_idx").on(table.vendorName),
      vendorTypeIdx: index("vendor_type_idx").on(table.vendorType),
      specialtyTagsGinIdx: index("vendor_tags_gin_idx").using("gin", table.specialtyTags),
    }
  },
);

export const vendorsRelations = relations(vendors, ({ many }) => ({
  // Add relations if needed
}));
