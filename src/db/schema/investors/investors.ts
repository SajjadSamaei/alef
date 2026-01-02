import {
  pgTable,
  uuid,
  text,
  timestamp,
  index,
  uniqueIndex, // Keep if email or other fields need unique index
} from "drizzle-orm/pg-core";
import { relations, sql } from "drizzle-orm";
// Import the new title enum along with others
import { entityStatusEnum, investorTypeEnum } from "@/db/schema/common/enums"; // Adjust path
import { projectInvestments } from "@/db/schema/investors/projectInvestments";

export interface InvestorDetails {
  firstName?: string; // Nullable: Only applicable to individuals
  lastName?: string; // Nullable: Only applicable to individuals
  companyName?: string; // Nullable: Only applicable to corporations
  investorType: "individual" | "corporation"; // Enum-like for stricter type checks
  status: "active" | "inactive"; // Enum-like for entity status
  phone?: string; // Nullable: Not all investors may provide a phone number
  address?: string; // Nullable: Optional address
  contactPerson?: string; // Nullable: Relevant for corporations
}

export const investors = pgTable(
  "investors",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    name: text("name").notNull(), // Full name for individuals or company name in English
    firstName: text("first_name"), // Full name for individuals or company name
    lastName: text("last_name"), // Full name for individuals or company name
    phone: text("phone"),
    status: entityStatusEnum("status").default("active").notNull(), // Status of the investor
    investorType: investorTypeEnum("investor_type"), // Type of investor (individual, corporation, etc.)

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
      // Index on names - adjust based on common search patterns

      دameIdx: index("investor_last_name_idx").on(table.name),
      statusIdx: index("investor_status_idx").on(table.status),
    };
  },
);

// Relations remain the same structurally
export const investorsRelations = relations(investors, ({ many }) => ({
  // An investor can have multiple investment commitments across various projects
  projectInvestments: many(projectInvestments),
}));
