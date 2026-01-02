import {
  pgTable,
  uuid,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";

// Represents individual administrative staff members, distinct from auth.users potentially
export const personnel = pgTable("personnel", {
  id: uuid("id").defaultRandom().primaryKey(),
  createdAt: timestamp("created_at", { withTimezone: true, precision: 6 })
    .defaultNow()
    .notNull(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  phone: text("phone"),
  jobTitle: text("job_title"), // e.g., Project Manager, Site Admin
  // ... other relevant personnel details
});
