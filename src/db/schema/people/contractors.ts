import { pgTable, uuid, text, varchar, timestamp } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { projects } from "@/db/schema/projects/projects";

export const contractors = pgTable("contractors", {
  id: uuid("id").primaryKey(),
  name: text("name").notNull(),
  phone: varchar("phone", { length: 15 }),
  company: text("company"),
  service: text("service"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdateFn(() => new Date()),
});

export const contractorsRelations = relations(contractors, ({ many }) => ({
  projects: many(projects),
}));
