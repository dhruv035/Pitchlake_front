import { Pool } from "pg";

declare global {
  // Allow global variables in TypeScript
  // eslint-disable-next-line no-var
  var pgPool: Pool | undefined;
}

if (!process.env.FOSSIL_DB_URL) {
  throw new Error("FOSSIL_DB_URL environment variable is not set");
}

const isProduction = process.env.NODE_ENV === "production";

const pool =
  global.pgPool ||
  new Pool({
    connectionString: process.env.FOSSIL_DB_URL,
    ssl: { rejectUnauthorized: false },
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
  });

pool.on("error", (err) => {
  console.error("Unexpected error on idle client", err);
  process.exit(-1);
});

if (!isProduction) global.pgPool = pool;

export default pool;