// Import from auth
import * as authAccessSchema from "./schema/auth/access";
import * as authUsersSchema from "./schema/auth/users";

// Import from common
import * as commonEnumsSchema from "./schema/common/enums"; // Assuming enums might be used by tables

// Import from inventory
import * as inventorySchema from "./schema/inventory/inventory";

// Import from investors
import * as investorPaymentsSchema from "./schema/investors/investorPayments";
import * as investorsSchema from "./schema/investors/investors";
import * as projectInvestmentsSchema from "./schema/investors/projectInvestments";

// Import from people
import * as contractorsSchema from "./schema/people/contractors";
import * as personnelSchema from "./schema/people/personnel";
import * as vendorsSchema from "./schema/people/vendors";
import * as workersSchema from "./schema/people/workers";

// Import from projects
import * as projectBankAccountsSchema from "./schema/projects/bankAccounts";
import * as projectsSchema from "./schema/projects/projects";
import * as projectUnitHistorySchema from "./schema/projects/unitHistory";
import * as projectUnitsSchema from "./schema/projects/units";

// Import from transactions
import * as transactionsSchema from "./schema/transactions/transactions";
// Assuming your transactionCategories and categorySpecificSubcategories are also in transactions or a related file
// For example, if they are in transactions.ts:
// (If they are in separate files, import them similarly)

// If you had the transactionCategories and categorySpecificSubcategories in separate files like:
// src/db/schema/transactions/transactionCategories.ts
// src/db/schema/transactions/categorySpecificSubcategories.ts
// You would import them:
// import * as transactionCategoriesSchema from './schema/transactions/transactionCategories';
// import * as categorySpecificSubcategoriesSchema from './schema/transactions/categorySpecificSubcategories';

// Import from blog

// Combine and export all schemas
// Drizzle Kit will pick these up for migrations
// Re-export all named exports from individual schema files
export * from "./schema/auth/access";
export * from "./schema/auth/users";

export * from "./schema/common/enums"; // If enums are defined here and used in tables

export * from "./schema/inventory/inventory";

export * from "./schema/investors/investorPayments";
export * from "./schema/investors/investors";
export * from "./schema/investors/projectInvestments";

export * from "./schema/people/contractors";
export * from "./schema/people/personnel";
export * from "./schema/people/vendors";
export * from "./schema/people/workers";

export * from "./schema/projects/bankAccounts";
export * from "./schema/projects/projects";
export * from "./schema/projects/unitHistory";
export * from "./schema/projects/units";

export * from "./schema/transactions/transactions";
// If transactionCategories and categorySpecificSubcategories are in their own files:
// export * from "./schema/transactions/transactionCategories";
// export * from "./schema/transactions/categorySpecificSubcategories";

// It's also good practice to export enums if they are defined in common/enums.ts
// and used in your schemas, though they aren't "tables" themselves.
// Drizzle needs to know about them during generation.
// If commonEnumsSchema exports enums directly:
export {} from // exampleEnum1, exampleEnum2 // list your enums from commonEnumsSchema
"./schema/common/enums";
