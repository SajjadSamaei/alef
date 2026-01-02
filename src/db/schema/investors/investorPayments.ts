import {
  pgTable,
  uuid,
  text,
  timestamp,
  date,
  numeric,
  index,
} from "drizzle-orm/pg-core";
import { projectInvestments } from "@/db/schema/investors/projectInvestments"; // Link payment to specific investment

// Log payments received FROM investors FOR specific investments/projects
export const investorPayments = pgTable(
  "investor_payments",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    createdAt: timestamp("created_at", { withTimezone: true, precision: 6 })
      .defaultNow()
      .notNull(),
    // Link to the specific investment this payment is towards
    projectInvestmentId: uuid("project_investment_id")
      .notNull()
      .references(() => projectInvestments.id, { onDelete: "restrict" }), // Don't delete investment if payments exist
    paymentDate: date("payment_date").notNull(),
    amountPaid: numeric("amount_paid").notNull(),
    paymentMethod: text("payment_method"),
    periodCovered: text("period_covered"), // e.g., '2025-05'
    referenceNumber: text("reference_number"),
    notes: text("notes"),
  },
  (table) => {
    return {
      investmentIdx: index("ip_investment_id_idx").on(
        table.projectInvestmentId,
      ),
    };
  },
);
