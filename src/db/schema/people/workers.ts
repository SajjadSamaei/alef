import { pgTable, uuid, text, timestamp, numeric } from "drizzle-orm/pg-core";
import { projects } from "../projects/projects";

export const workers = pgTable("workers", {
  id: uuid("id").defaultRandom().primaryKey(),
  createdAt: timestamp("created_at", { withTimezone: true, precision: 6 })
    .defaultNow()
    .notNull(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  jobTitle: text("job_title"),
  payRate: numeric("pay_rate"), // Hourly rate?
  payType: text("pay_type"), // e.g., 'hourly', 'salary', 'contract'
  project: uuid("project_id").references(() => projects.id, {
    onDelete: "set null", // Keep receipt even if vendor deleted? Or 'restrict'?
  }),
  // ... other relevant worker details (contact, etc.)
  // Optional: Link to user who added/manages this worker
  // managedByUserId: uuid('managed_by_user_id').references(() => authUsers.id),
});
