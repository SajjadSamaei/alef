import { pgEnum } from "drizzle-orm/pg-core";
// Auth Roles
export const userRoleEnum = pgEnum("user_role", [
  "SUPER_ADMIN",
  "ADMIN",
  "PROCUREMENT",
  "INVESTOR",
]);

// Transactions
export const transactionTypeEnum = pgEnum("transaction_type", [
  "deposit",
  "withdrawal",
]);
export const transactionStatusEnum = pgEnum("transaction_status", [
  "pending",
  "approved",
  "rejected",
  "reconciled",
]); // Added reconciled

export const titleEnum = pgEnum("title", [
  "Mr.",
  "Ms.",
  "Mrs.",
  "Miss",
  "Dr.",
  "Prof.",
  // Add other relevant titles
]);

// Enum for different types of receipts
export const approvalStatusEnum = pgEnum("approval_status", [
  "pending",
  "approved",
  "rejected",
]);

// Payments
export const paymentStatusEnum = pgEnum("payment_status", [
  "pending",
  "paid",
  "partially_paid",
  "overdue",
]);

export const paymentMethodEnum = pgEnum("payment_method", [
  "cash",
  "credit_card",
  "debit_card",
  "bank_transfer",
  "check",
  "internal_transfer",
  "crypto",
  "other",
]);

export const checkStatusEnum = pgEnum("check_status", [
  "received",
  "deposited",
  "bounced",
  "returned",
]);

// Project enum for construction projects
export const projectStatusEnum = pgEnum("project_status", [
  "lead",
  "proposal_submitted",
  "negotiation",
  "awaiting_award",
  "contract_signed",
  "planning",
  "design_development",
  "awaiting_permits",
  "permits_approved",
  "mobilization",
  "active_construction",
  "foundation",
  "framing",
  "rough_ins",
  "exterior_work",
  "interior_finishes",
  "landscaping",
  "final inspection",
  "completed",
  "on_hold",
  "cancelled",
]);

export const unitStatusEnum = pgEnum("unit_status", [
  "Available",
  "Reserved",
  "Sold",
  "Not Available",
]);

// Inventory Enums
// --- Enums for consistency ---
export const itemStatusEnum = pgEnum("item_status", [
  "active",
  "inactive",
  "discontinued",
  "on_order",
  "low_stock",
]);

export const unitEnum = pgEnum("item_unit", [
  "pcs", // Pieces (default)
  "bag",
  "roll",
  "sheet",
  "box", // Box
  "pack", // Pack
  "set", // Set (e.g., tool set)
  "pallet", // Pallet
  "pair", // Pair (e.g., gloves)
  "kg", // Kilograms
  "g", // Grams
  "ltr", // Liters
  "ml", // Milliliters
  "m", // Meters
  "cm", // Centimeters

  // Add other units relevant to your inventory
]);

export const entityStatusEnum = pgEnum("entity_status", [
  // Reusable status
  "active",
  "inactive",
  "pending",
  "potential",
]);

export const investorTypeEnum = pgEnum("investor_type", [
  "individual",
  "fund",
  "corporation",
  "trust",
  "other",
]);

export const investorFeeStatusEnum = pgEnum("investor_fee_status", [
  "current", // Payments are up-to-date
  "past_due", // One or more payments are overdue
  "paid_in_advance", // Payments made ahead of schedule
  "grace_period", // Payment is late but within an allowed grace period
  "delinquent", // Payments significantly overdue
  "not_applicable", // No recurring fees apply to this investment
  "paused", // Fee collection temporarily paused
]);

export const investmentStatusEnum = pgEnum("investment_status", [
  "pending", // Commitment made, not yet active/funded
  "active", // Funded and ongoing
  "funded", // Fully funded
  "closed", // Investment period ended/exited
  "cancelled",
]);

export const paymentFromInvestorTypeEnum = pgEnum(
  "payment_from_investor_type",
  ["initial_funding", "capital_call", "subsequent_funding", "other"],
);

export const paymentFromInvestorStatusEnum = pgEnum(
  "payment_from_investor_status",
  [
    "pending", // Payment initiated but not confirmed
    "cleared", // Payment received and confirmed
    "failed", // Payment failed
    "cancelled",
  ],
);

export const payeeTypeEnum = pgEnum("payee_type", [
  "executor",
  "subcontractor",
  "supplier",
  "worker",
  "personnel",
  "contractor_individual",
  "other",
]);
