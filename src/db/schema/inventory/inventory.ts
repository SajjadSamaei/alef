import {
  pgTable,
  uuid,
  integer,
  text,
  timestamp,
  numeric,
  jsonb,
  pgEnum,
  index,
} from "drizzle-orm/pg-core";
import { relations, sql } from "drizzle-orm";
import { projects } from "@/db/schema/projects/projects";
import { vendors } from "@/src/db/schema/people/vendors";
import { itemStatusEnum, unitEnum } from "@/db/schema/common/enums";

// --- Interface for JSONB Images ---
interface ItemImage {
  url: string;
  altText?: string;
  isPrimary?: boolean;
}

// --- Interface for JSONB Attributes ---
interface ItemAttributes {
  [key: string]: any; // Flexible key-value pairs
  // Examples:
  // color?: string;
  // size?: string; // e.g., "L", "XL"
  // dimensions?: { length: number; width: number; height: number; unit: string };
  // weight?: { value: number; unit: 'kg' | 'g' | 'lb' };
  // material?: string;
}

export const inventoryCategories = pgTable("inventory_categories", {
  id: uuid("id").defaultRandom().primaryKey(), // Use defaultRandom for UUID generation
  name: text("name").notNull().unique(), // Added unique constraint to category name
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow(), // Added createdAt
  updatedAt: timestamp("updated_at") // Added updatedAt
    .defaultNow()
    .$onUpdateFn(() => new Date()),
});

export const inventoryCategoriesRelations = relations(
  inventoryCategories,
  ({ many }) => ({
    items: many(inventoryItems),
  }),
);

export const inventoryItems = pgTable(
  "inventory_items",
  {
    id: uuid("id").defaultRandom().primaryKey(), // Use defaultRandom

    // --- Relationships ---
    categoryId: uuid("category_id") // *** CORRECTED TYPE TO UUID ***
      .notNull()
      .references(() => inventoryCategories.id, { onDelete: "restrict" }), // Restrict deleting category if items exist

    projectId: uuid("project_id") // Added Project FK (Nullable)
      .references(() => projects.id, { onDelete: "set null" }), // Item remains if project deleted, but link removed
    preferredVendorId: uuid("preferred_vendor_id") // Added Vendor FK (Nullable)
      .references(() => vendors.id, { onDelete: "set null" }), // Item remains if vendor deleted

    // --- Core Item Details ---
    name: text("name").notNull(),
    // sku: text("sku").unique(), // Stock Keeping Unit (optional but recommended, unique)
    // barcode: text("barcode").unique(), // Barcode (UPC/EAN, optional, unique)
    brand: text("brand"),

    // --- Specifications / Attributes ---
    // specification: text("specification"), // Keep if simple text is needed
    attributes: jsonb("attributes") // Use JSONB for structured/flexible specs
      .$type<ItemAttributes>()
      .notNull()
      .default(sql`'{}'::jsonb`),

    // --- Stock & Units ---
    quantity: integer("quantity").notNull().default(0), // Current stock level
    unit: unitEnum("unit").notNull().default("pcs"), // Use Enum for consistency
    reorderLevel: integer("reorder_level"), // Optional: Threshold for reordering

    // --- Location ---
    location: text("location"), // Optional: Where the item is stored

    // --- Status ---
    status: itemStatusEnum("status").notNull().default("active"), // Use Enum

    // --- Images ---
    images: jsonb("images")
      .$type<ItemImage[]>()
      .notNull()
      .default(sql`'[]'::jsonb`),

    // --- Timestamps ---
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdateFn(() => new Date()),

    // --- Optional: Soft Delete ---
    // deletedAt: timestamp("deleted_at"),
  },
  // --- Indexes ---
  (table) => {
    return {
      itemNameIdx: index("item_name_idx").on(table.name),
      categoryIdIdx: index("item_category_id_idx").on(table.categoryId),
      projectIdIdx: index("item_project_id_idx").on(table.projectId),
      vendorIdIdx: index("item_vendor_id_idx").on(table.preferredVendorId),
      statusIdx: index("item_status_idx").on(table.status),
      attributesGinIdx: index("item_attributes_gin_idx").using(
        "gin",
        table.attributes,
      ), // Specify the GIN method
    };
  },
);

export const inventoryItemsRelations = relations(inventoryItems, ({ one }) => ({
  category: one(inventoryCategories, {
    fields: [inventoryItems.categoryId],
    references: [inventoryCategories.id],
  }),
  // Added relations for project and vendor
  project: one(projects, {
    fields: [inventoryItems.projectId],
    references: [projects.id],
  }),
  preferredVendor: one(vendors, {
    fields: [inventoryItems.preferredVendorId],
    references: [vendors.id],
  }),
}));
