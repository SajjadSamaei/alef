import {
  pgTable,
  serial,
  text,
  timestamp,
  numeric,
  uuid,
  index,
  jsonb,
  boolean,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { sql } from "drizzle-orm";
import { projects } from "@/src/db/schema/projects/projects";
import { user } from "@/db/schema/auth/users";
import { vendors } from "@/src/db/schema/people/vendors"; // Import vendors
import {
  approvalStatusEnum,
  paymentMethodEnum,
} from "@/db/schema/common/enums";
import { transactionTypeEnum } from "@/db/schema/common/enums";

// Define a TypeScript interface for type safety (optional but recommended)
interface ReceiptImage {
  url: string;
  name: string;
  // You could add other metadata here, like size, upload time, etc.
  // size?: number;
  // uploadedAt?: string; // ISO date string
}

export const transactions = pgTable(
  "transactions",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    dateSubmitted: timestamp("date_submitted").defaultNow().notNull(),
    // Sender ID
    userId: uuid("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "restrict" }), // Restrict deletion if user has receipts
    // Project
    projectId: uuid("project_id")
      .notNull()
      .references(() => projects.id, { onDelete: "cascade" }), // Delete receipts if project is deleted
    project: text("project"), // Keep as text, or normalize further if needed
    // Category
    categoryId: uuid("category_id").references(() => transactionCategories.id, {
      onDelete: "set null", // Keep receipt even if category deleted? Or 'restrict'?
    }),
    category: text("category"), // Keep as text, or normalize further if needed
    // Vendor
    vendorId: uuid("vendor_id").references(() => vendors.id, {
      onDelete: "set null", // Keep receipt even if vendor deleted? Or 'restrict'?
    }),
    vendor: text("vendor_name"),
    // Receipt Info
    amount: numeric("amount").notNull(),
    description: text("description"),
    dateOfTransaction: timestamp("date_of_expense").notNull(),
    paymentMethod: paymentMethodEnum("payment_method"),
    // Receipt Images
    // imageURL: text("image_url"),
    // imageName: text("image_name"),
    receiptImages: jsonb("receipt_images")
      .$type<ReceiptImage[]>() // Apply TypeScript type
      .notNull()
      .default(sql`'[]'::jsonb`), // Default to an empty JSONB array
    // Approvals
    approvedById: uuid("approved_by_id").references(() => user.id),
    approvalStatus: approvalStatusEnum("approval_status"),
    approvalDate: timestamp("approval_date"),
    rejectionReason: text("rejection_reason"),
    // Notes on changes fro admin
    notes: text("notes"),
  },
  (table) => {
    return {
      dateSubmittedIdx: index("date_submitted_idx").on(table.dateSubmitted),
      userIdx: index("senderId_idx").on(table.userId),
      projectIdx: index("project_idx").on(table.projectId),
      categoryIdx: index("category_idx").on(table.categoryId),
      vendorIdIdx: index("receipt_vendor_id_idx").on(table.vendorId),
      amounIdx: index("amount_idx").on(table.amount),
      descriptionIdx: index("description_idx").on(table.description),
      dateOfExpenseIdx: index("date_of_expense_idx").on(
        table.dateOfTransaction,
      ),
      // imageUrlIdx: index("image_url_idx").on(table.imageURL),
      receiptImagesIdx: index("receipt_images_gin_idx").using(
        "gin",
        table.receiptImages,
      ),

      approvalStatusIdx: index("approval_status_idx").on(table.approvalStatus),
    };
  },
);

export const receiptsRelations = relations(transactions, ({ one }) => ({
  project: one(projects, {
    fields: [transactions.projectId],
    references: [projects.id],
  }),
  user: one(user, { fields: [transactions.userId], references: [user.id] }),
}));

// Transaction Categories (For detailed reporting)
export const transactionCategories = pgTable("transaction_categories", {
  id: uuid("id").primaryKey(),
  name: text("name").notNull().unique(), // e.g., "Labor", "Materials", "Utilities", "Investor Payment", "Loan"
  isCostPlus: boolean("is_cost_plus").default(false), // Is this a cost-plus category?
  type: transactionTypeEnum("type").notNull(), // deposit or withdrawal
  description: text("description"),
});

export const subcategories = pgTable("subcategories", {
  id: uuid("id").primaryKey(),
  name: text("name").notNull(), // e.g., "Plumbing", "Electrical", "Software License", "Interest Payment"
  description: text("description"),
  // Optional: You could add a foreign key to transaction_categories here
  // if you want a subcategory to *only* belong to one primary category.
  // categoryId: integer("category_id").references(() => transactionCategories.id),
});

export const categorySpecificSubcategories = pgTable(
  "category_specific_subcategories",
  {
    id: uuid("id").primaryKey(),
    categoryId: uuid("category_id")
      .notNull()
      .references(() => transactionCategories.id, { onDelete: "cascade" }), // Link to the parent category
    name: text("name").notNull(), // e.g., "Labor", "Permits", "Software"
    description: text("description"),
  },
  (table) => {
    return {
      // This constraint ensures that a subcategory name is unique *within* a specific parent category.
      // So, Category A can have a "Labor" subcategory, and Category B can also have a "Labor" subcategory,
      // but Category A cannot have two subcategories named "Labor".
      categorySubcategoryNameUk: uniqueIndex("category_subcategory_name_uk").on(
        table.categoryId,
        table.name,
      ),
    };
  },
);
