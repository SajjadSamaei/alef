import {
  pgTable,
  text,
  timestamp,
  boolean,
  numeric,
  index,
  uuid,
  decimal,
} from "drizzle-orm/pg-core";

import { projectStatusEnum } from "@/db/schema/common/enums";

export const projects = pgTable(
  "projects",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    projectName: text("project_name").notNull(),
    description: text("description"),
    startDate: timestamp("start_date").notNull(),
    endDate: timestamp("end_date"),
    actualEndDate: timestamp("actual_end_date"),
    isFinished: boolean("is_finished").default(false),
    status: projectStatusEnum("status").default("planning").notNull(),
    estimatedCost: numeric("estimated_cost"),
    actualCost: numeric("actual_cost"),
    fee: decimal("fee", { precision: 10, scale: 2 }), // Fee for the project
    budget: numeric("budget"),
    totalBuildingShares: numeric("total_building_shares", {
      precision: 10, // Total number of digits
      scale: 4, // Number of digits after the decimal point
    }), // e.g., can store 49.0000. Set .notNull() if always required.
    siteAddress: text("site_address"),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdateFn(() => new Date()),
  },
  (table) => {
    return {
      projectNameIdx: index("project_number_idx").on(table.projectName),
      feeIdx: index("fee_idx").on(table.fee),
      isProjectFinishedIdx: index("is_finished_idx").on(table.isFinished),
    };
  },
);

// export const projectRelations = relations(projects, ({ many }) => ({
//   accounts: many(accounts),
//   transactions: many(transactions),
//   units: many(units),
//   monthlyRates: many(monthlyRates),
//   investorMonthlyPayments: many(investorMonthlyPayments),
//   payments: many(payments),
//   checksReceived: many(checksReceived),
// }));
