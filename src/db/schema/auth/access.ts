import {
  pgTable,
  timestamp,
  integer,
  primaryKey,
  index,
  uuid, // Import uuid for the user ID
} from "drizzle-orm/pg-core";
import { user } from "@/db/schema/auth/users"; // Import the users table
import { projects } from "@/db/schema/projects/projects"; // Import the projects table
import { accounts } from "@/db/schema/projects/bankAccounts"; // Import the accounts table
import { userRoleEnum } from "@/db/schema/common/enums"; // Import the user role enum

export const userRoles = pgTable(
  "user_roles",
  {
    userId: uuid("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    role: userRoleEnum("role").notNull(),
    assignedAt: timestamp("assigned_at").defaultNow().notNull(),
    // assignedByUserId: uuid('assigned_by_user_id').references(() => users.id), // Optional: Track who assigned the role
  },
  (table) => ({
    compoundKey: primaryKey({ columns: [table.userId, table.role] }), // User can only have each role once
    userIdx: index("user_roles_user_idx").on(table.userId),
    roleIdx: index("user_roles_role_idx").on(table.role),
  }),
);

// You can add multiple rows to this table for the same userId, each with a different projectId.
// This allows a single procurement user to be granted access to manage multiple distinct projects.
// The primary key compoundKey: primaryKey({ columns: [table.userId, table.projectId] }) just ensures that you don't accidentally grant the same user access to the same project twice; each user-project link must be unique.
export const projectAccess = pgTable(
  "project_access",
  {
    userId: uuid("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    projectId: uuid("project_id")
      .notNull()
      .references(() => projects.id, { onDelete: "cascade" }),
    assignedAt: timestamp("assigned_at").defaultNow().notNull(),
    // Add assignedByUserId if you want to track who granted access
    // assignedByUserId: uuid('assigned_by_user_id').references(() => users.id),
  },
  (table) => ({
    compoundKey: primaryKey({ columns: [table.userId, table.projectId] }), // Ensure unique user-project pair
    userIdx: index("proj_user_idx").on(table.userId),
    projectIdx: index("proj_project_idx").on(table.projectId),
  }),
);

// Link Procurement Users to Accounts they can access
export const bankAccountAccess = pgTable(
  "bank_account_access",
  {
    userId: uuid("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    accountId: uuid("account_id")
      .notNull()
      .references(() => accounts.id, { onDelete: "cascade" }),
    assignedAt: timestamp("assigned_at").defaultNow().notNull(),
    // Add assignedByUserId if you want to track who granted access
    // assignedByUserId: uuid('assigned_by_user_id').references(() => users.id),
  },
  (table) => ({
    compoundKey: primaryKey({ columns: [table.userId, table.accountId] }), // Ensure unique user-account pair
    userIdx: index("bnk_acc_user_idx").on(table.userId),
    accountIdx: index("bnk_acc_account_idx").on(table.accountId),
  }),
);

export const adminAccess = pgTable(
  "admin_access",
  {
    userId: uuid("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    assignedAt: timestamp("assigned_at").defaultNow().notNull(),
    // Add assignedByUserId if you want to track who granted access
    // assignedByUserId: uuid('assigned_by_user_id').references(() => users.id),
  },
  (table) => ({
    userIdx: index("admin_acc_idx").on(table.userId),
  }),
);

export const procurementAccess = pgTable(
  "procurement_access",
  {
    userId: uuid("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    assignedAt: timestamp("assigned_at").defaultNow().notNull(),
    projectId: uuid("project_id")
      .notNull()
      .references(() => projects.id, { onDelete: "cascade" }),
    // Add assignedByUserId if you want to track who granted access
    // assignedByUserId: uuid('assigned_by_user_id').references(() => users.id),
  },
  (table) => ({
    userIdx: index("procurement_acc_idx").on(table.userId),
  }),
);

export const financeAccess = pgTable(
  "finance_access",
  {
    userId: uuid("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    assignedAt: timestamp("assigned_at").defaultNow().notNull(),
    // Add assignedByUserId if you want to track who granted access
    // assignedByUserId: uuid('assigned_by_user_id').references(() => users.id),
  },
  (table) => ({
    userIdx: index("finance_acc_idx").on(table.userId),
  }),
);
export const investorAccess = pgTable(
  "investor_access",
  {
    userId: uuid("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    assignedAt: timestamp("assigned_at").defaultNow().notNull(),
    // Add assignedByUserId if you want to track who granted access
    // assignedByUserId: uuid('assigned_by_user_id').references(() => users.id),
  },
  (table) => ({
    userIdx: index("investor_acc_idx").on(table.userId),
  }),
);

export const humanResourceAccess = pgTable(
  "hr_access",
  {
    userId: uuid("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    assignedAt: timestamp("assigned_at").defaultNow().notNull(),
    // Add assignedByUserId if you want to track who granted access
    // assignedByUserId: uuid('assigned_by_user_id').references(() => users.id),
  },
  (table) => ({
    userIdx: index("hr_acc_idx").on(table.userId),
  }),
);
