import {
  pgTable,
  text,
  timestamp,
  boolean,
  numeric,
  decimal,
  varchar,
  index,
  uuid,
} from "drizzle-orm/pg-core";

import { projects } from "@/db/schema/projects/projects";

export const accounts = pgTable(
  "accounts",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    projectId: uuid("project_id")
      .references(() => projects.id, { onDelete: "cascade" })
      .notNull(), // Link accounts to projects
    name: varchar("name", { length: 100 }).notNull(), // e.g., "Main Operating", "Petty Cash Site A"
    accountNumber: varchar("account_number", { length: 50 }), // Optional, might be sensitive
    bankName: varchar("bank_name", { length: 100 }),
    type: varchar("type", { length: 50 }).notNull(), // e.g., "checking", "savings", "petty_cash"
    balance: numeric("balance"), // Current balance
    balanceDate: timestamp("balance_date"), // When was the balance last checked
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    projectIdx: index("account_project_idx").on(table.projectId),
    accountNameIdx: index("account_name_idx").on(table.name),
    accountBalanceIdx: index("account_balance_idx").on(table.balance),
    accountBalanceDateIdx: index("account_balance_date_idx").on(
      table.balanceDate,
    ),
  }),
);
