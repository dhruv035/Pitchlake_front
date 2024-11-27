"use server";

import { NextResponse } from "next/server";
import { formatUnits } from "ethers";
import { Pool } from "pg";

// Maximum number of blocks to return
const MAX_RETURN_BLOCKS = 100;
// Maximum number of blocks to consider for TWAP
const TWAP_BLOCK_LIMIT = 100;

// Type to return
interface BlockData {
  block_number: number;
  base_fee_per_gas: string;
  timestamp: string;
  twap: string;
}

/// Get gas data (basefee & twap) for the blocks in a given range
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const timestampFrom = searchParams.get("from_timestamp");
  const timestampTo = searchParams.get("to_timestamp");
  const twapRangeParam = searchParams.get("twap_range");

  // Validate required parameters
  if (!timestampFrom || !timestampTo || !twapRangeParam) {
    return NextResponse.json(
      {
        error: "Missing from_timestamp, to_timestamp, or twap_range parameter",
      },
      { status: 400 },
    );
  }

  const fromTimestamp = parseInt(timestampFrom, 10);
  const toTimestamp = parseInt(timestampTo, 10);
  const timestampRange = toTimestamp - fromTimestamp;
  const twapRange = parseInt(twapRangeParam, 10); // in seconds

  // Validate timestamp range (maximum 121 days)
  if (timestampRange > 121 * 24 * 60 * 60) {
    return NextResponse.json(
      { error: "Invalid timestamp range; maximum 120 days allowed." },
      { status: 400 },
    );
  }

  // Validate TWAP range (0 to 31 days)
  if (twapRange < 0 || twapRange > 31 * 24 * 60 * 60) {
    return NextResponse.json(
      {
        error: "Invalid twap_range; must be between 0 and 30 days in seconds.",
      },
      { status: 400 },
    );
  }

  try {
    // SQL Query to select sampled blocks and calculate TWAP
    const query = `
      WITH selected_blocks AS (
        SELECT DISTINCT ON (bucket) number, base_fee_per_gas, timestamp
        FROM (
          SELECT number, base_fee_per_gas, timestamp,
                 NTILE($1) OVER (ORDER BY timestamp ASC) AS bucket
          FROM blockheaders
          WHERE timestamp BETWEEN $2 AND $3
        ) AS sub
        ORDER BY bucket, timestamp DESC
      ),
      twap_calculations AS (
        SELECT sb.number AS block_number,
               sb.base_fee_per_gas,
               sb.timestamp,
               SUM(tb.base_fee_per_gas_numeric * tb.duration) / SUM(tb.duration) AS twap
        FROM selected_blocks sb
        JOIN LATERAL (
          SELECT
            tb.base_fee_per_gas,
            LEAD(tb.timestamp) OVER (ORDER BY tb.timestamp ASC) - tb.timestamp AS duration,
            CAST(tb.base_fee_per_gas AS numeric) AS base_fee_per_gas_numeric
          FROM blockheaders tb
          WHERE tb.timestamp BETWEEN (sb.timestamp - $4) AND sb.timestamp
          ORDER BY tb.timestamp ASC
          LIMIT $5
        ) tb ON true
        WHERE tb.duration IS NOT NULL
        GROUP BY sb.number, sb.base_fee_per_gas, sb.timestamp
      )
      SELECT block_number, base_fee_per_gas, timestamp, twap
      FROM twap_calculations
      ORDER BY timestamp ASC;
    `;

    // Parameters for the SQL query
    const values = [
      MAX_RETURN_BLOCKS,
      fromTimestamp,
      toTimestamp,
      twapRange,
      TWAP_BLOCK_LIMIT,
    ];

    const pool =
    new Pool({
      connectionString: process.env.FOSSIL_DB_URL,
      ssl: {
        rejectUnauthorized: false, // For testing purposes; consider proper SSL config in production
      },
    });
    const result = await pool.query(query, values);
    pool.end();
    if (
      result.rows.length >= 1 &&
      result.rows[result?.rows?.length - 1].timestamp <= toTimestamp
    ) {
      const lastKnownTimestamp = parseInt(
        result.rows[result.rows.length - 1].timestamp,
      );
      if (
        lastKnownTimestamp <=
        toTimestamp -
          12 -
          Math.floor((toTimestamp - fromTimestamp) / MAX_RETURN_BLOCKS)
      ) {
        result.rows.push({
          block_number: undefined,
          base_fee_per_gas: undefined,
          timestamp: toTimestamp,
          twap: undefined,
        });
      }
    }

    const data: any[] = result.rows.map((row: any) => ({
      block_number: row.block_number ? row.block_number : undefined,
      timestamp: row.timestamp,
      BASEFEE: row.base_fee_per_gas
        ? formatUnits(row.base_fee_per_gas, "gwei")
        : undefined,
      TWAP: row.twap ? formatUnits(parseInt(row.twap), "gwei") : undefined,
    }));

    return NextResponse.json(data, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching data", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message, db_url: process.env.FOSSIL_DB_URL},
      { status: 500 },
    );
  }
}
