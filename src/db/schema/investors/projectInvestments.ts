import {
  pgTable,
  uuid,
  text,
  timestamp,
  date,
  numeric,
  index,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { relations, sql } from "drizzle-orm";
import { investors } from "@/db/schema/investors/investors";
import { projects } from "@/src/db/schema/projects/projects";
import {
  investmentStatusEnum,
  investorFeeStatusEnum,
} from "@/db/schema/common/enums"; // Adjust path
import { investorPayments } from "@/db/schema/investors/investorPayments";

// Links investors to specific projects they are funding (many-to-many)
export const projectInvestments = pgTable(
  "project_investments",
  {
    id: uuid("id").defaultRandom().primaryKey(), // Represents a specific commitment/investment instance
    investorId: uuid("investor_id")
      .notNull()
      .references(() => investors.id, { onDelete: "restrict" }), // Don't delete investor if investments exist
    projectId: uuid("project_id")
      .notNull()
      .references(() => projects.id, { onDelete: "restrict" }), // Don't delete project if investments exist

    // Commitment Details
    commitmentDate: date("commitment_date"),
    committedAmount: numeric("committed_amount"), // Total amount investor committed

    // Status & Tracking
    status: investmentStatusEnum("status").notNull().default("pending"), // Status of the investment commitment itself

    // --- NEW: Fee Payment Status ---
    // Tracks the investor's payment standing for recurring fees related to THIS investment
    feePaymentStatus: investorFeeStatusEnum("fee_payment_status")
      .notNull()
      .default("not_applicable"), // Default assumes no fees unless specified

    // Optional: Track amount actually funded here, requires updates on payment.
    // amountFunded: decimal("amount_funded", { precision: 14, scale: 2 }).default('0.00'),

    notes: text("notes"),
    // Optional: Store complex terms as JSONB
    // termsData: jsonb("terms_data"),

    // Timestamps
    createdAt: timestamp("created_at", { withTimezone: true, precision: 6 })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true, precision: 6 }) // Added updatedAt
      .defaultNow()
      .$onUpdateFn(() => new Date()),
  },
  (table) => {
    return {
      investorIdx: index("pi_investor_id_idx").on(table.investorId),
      projectIdx: index("pi_project_id_idx").on(table.projectId),
      statusIdx: index("pi_status_idx").on(table.status),
      feeStatusIdx: index("pi_fee_status_idx").on(table.feePaymentStatus), // Added index for fee status
    };
  },
);

// Relations remain the same structurally
export const projectInvestmentsRelations = relations(
  projectInvestments,
  ({ one, many }) => ({
    // Link back to the investor
    investor: one(investors, {
      fields: [projectInvestments.investorId],
      references: [investors.id],
    }),
    // Link back to the project
    project: one(projects, {
      fields: [projectInvestments.projectId],
      references: [projects.id],
    }),
    // An investment commitment can receive multiple payments towards it
    paymentsReceived: many(investorPayments),
  }),
);
