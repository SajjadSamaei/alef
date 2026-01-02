import {
  pgTable,
  uuid,
  text,
  timestamp,
  integer,
  decimal,
  numeric,
  index,
  uniqueIndex,
  date,
} from "drizzle-orm/pg-core";
import { projects } from "@/src/db/schema/projects/projects";
import { unitStatusEnum } from "@/src/db/schema/common/enums";
import { user } from "@/src/db/schema/auth/users"; // Import the users table

// Represents individual apartments or units within a project
export const units = pgTable(
  "units",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    createdAt: timestamp("created_at", { withTimezone: true, precision: 6 })
      .defaultNow()
      .notNull(),
    projectId: uuid("project_id")
      .notNull()
      .references(() => projects.id, { onDelete: "cascade" }), // Delete unit if project deleted? Or restrict?
    unitNumber: text("unit_number").notNull(),
    floor: integer("floor"),
    unitType: text("unit_type"), // e.g., 'Studio', '1BR', 'Penthouse'
    squareFootage: integer("square_footage"),
    unitOrientation: text("unit_orientation"), // e.g., 'North', 'South', 'East', 'West'
    listPrice: numeric("list_price"),
    buildingShare: numeric("building_share", {
      precision: 10, // Must be compatible with totalBuildingShares
      scale: 4, // Must be compatible with totalBuildingShares
    }), // e.g., can store 0.7000. Set .notNull() if always required.
    status: unitStatusEnum("status").default("Available"),
    description: text("description"),
    // ... other unit features (bedrooms, bathrooms, balcony etc.)
  },
  (table) => {
    return {
      projectIdx: index("unit_idx").on(table.projectId),
      projectUnitUniqueIdx: uniqueIndex("project_unit_unique_idx").on(
        table.projectId,
        table.unitNumber,
      ), // Ensure unit number is unique within a project
    };
  },
);

export const unitOwnership = pgTable(
  "unit_ownership",
  {
    id: uuid("id").primaryKey(),
    unitId: uuid("unit_id")
      .references(() => units.id, { onDelete: "cascade" })
      .notNull(),
    userId: uuid("user_id")
      .references(() => user.id, { onDelete: "cascade" })
      .notNull(), // Links to the user (who must have INVESTOR role)
    ownershipPercentage: decimal("ownership_percentage", {
      precision: 5,
      scale: 2,
    }).notNull(),
    effectiveDate: date("effective_date").notNull(),
    endDate: date("end_date"),
    notes: text("notes"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    unitIdx: index("ownership_unit_idx").on(table.unitId),
    userIdx: index("ownership_user_idx").on(table.userId),
  }),
);

export const unitOwnershipTransfer = pgTable("unit_ownership_transfer", {
  unitId: uuid("unit_id")
    .references(() => units.id, { onDelete: "cascade" })
    .notNull(),
  eventType: text("event_type").notNull(), // e.g., 'Listed', 'Reserved', 'Sold', 'Status Changed', 'Price Changed', 'Sale Cancelled'
  eventTimestamp: timestamp("event_timestamp", {
    withTimezone: true,
    precision: 6,
  })
    .defaultNow()
    .notNull(),
  // Optional related entities for context
  relatedCustomerId: uuid("related_user_id").references(() => user.id, {
    onDelete: "set null",
  }),
  // Changed By? Link to auth.users?
  // userId: uuid('user_id').references(() => authUsers.id),
  details: text("details"), // Simple text description
  // OR use JSONB for structured details:
  // eventData: jsonb('event_data'), // e.g., { oldStatus: 'Available', newStatus: 'Reserved', price: 500000 }
});
