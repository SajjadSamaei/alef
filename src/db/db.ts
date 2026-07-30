import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { Pool } from "pg";
import * as schema from "@/db/schema"; // Import all tables

const pool = new Pool({
  connectionString: process.env.DATABASE_URI,
});

export const db = drizzle(pool, { schema, logger: true }); // Add schema here

// (async () => {
//   await migrate(db, { migrationsFolder: "../../drizzle" });
// })();
