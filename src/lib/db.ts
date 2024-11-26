import { Pool } from "pg";

declare global {
  // Allow global variables in TypeScript
  // eslint-disable-next-line no-var
  var pgPool: Pool | undefined;
}

const pool =
  global.pgPool ||
  new Pool({
    connectionString: process.env.FOSSIL_DB_URL,
    ssl: {
      rejectUnauthorized: false, // For testing purposes; consider proper SSL config in production
    },
  });

if (process.env.NODE_ENV !== "production") global.pgPool = pool;

export default pool;
