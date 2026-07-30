import {
  pgTable,
  uuid,
  text,
  timestamp,
  index,
  jsonb,
} from "drizzle-orm/pg-core";
import { units } from "@/db/schema/projects/units"; // Adjust the import path as necessary
import { user } from "@/db/schema/auth/users"; // Adjust the import path as necessary

// Logs significant events in a unit's lifecycle
export const unitHistory = pgTable(
  "unit_history",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    eventTimestamp: timestamp("event_timestamp", {
      withTimezone: true,
      precision: 6,
    })
      .defaultNow()
      .notNull(),
    unitId: uuid("unit_id")
      .notNull()
      .references(() => units.id, { onDelete: "cascade" }), // Delete history if unit deleted
    eventType: text("event_type").notNull(), // e.g., 'Listed', 'Reserved', 'Sold', 'Status Changed', 'Price Changed', 'Sale Cancelled'
    // Optional related entities for context
    relatedUserId: uuid("related_user_id").references(() => user.id, {
      onDelete: "set null",
    }),
    // Changed By? Link to auth.users?
    // userId: uuid('user_id').references(() => authUsers.id),
    details: text("details"), // Simple text description
    // OR use JSONB for structured details:
    // eventData: jsonb('event_data'), // e.g., { oldStatus: 'Available', newStatus: 'Reserved', price: 500000 }
  },
  (table) => {
    return {
      unitTimestampIdx: index("uh_unit_timestamp_idx").on(
        table.unitId,
        table.eventTimestamp,
      ),
    };
  },
);
