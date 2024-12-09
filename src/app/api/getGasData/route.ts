"use server";

import { NextResponse } from "next/server";
import { formatUnits } from "ethers";
import { Pool } from "pg";

const MAX_RETURN_BLOCKS = 100;
const TWAP_BLOCK_LIMIT = 100;

interface BlockData {
  block_number: number | undefined;
  base_fee_per_gas: string | undefined;
  timestamp: number;
  twap: string | undefined;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const timestampFrom = searchParams.get("from_timestamp");
  const timestampTo = searchParams.get("to_timestamp");
  const twapRangeParam = searchParams.get("twap_range");
  const roundStart = searchParams.get("round_start");

  if (!timestampFrom || !timestampTo || !twapRangeParam || !roundStart) {
    return NextResponse.json(
      {
        error:
          "Missing from_timestamp, to_timestamp, twap_range, or round_start parameter",
      },
      { status: 400 },
    );
  }

  const fromTimestamp = parseInt(timestampFrom, 10);
  const toTimestamp = parseInt(timestampTo, 10);
  const timestampRange = toTimestamp - fromTimestamp;
  const twapRange = parseInt(twapRangeParam, 10);

  if (timestampRange > 121 * 24 * 60 * 60) {
    return NextResponse.json(
      { error: "Invalid timestamp range; maximum 120 days allowed." },
      { status: 400 },
    );
  }

  if (twapRange < 0 || twapRange > 31 * 24 * 60 * 60) {
    return NextResponse.json(
      {
        error: "Invalid twap_range; must be between 0 and 30 days in seconds.",
      },
      { status: 400 },
    );
  }

  try {
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
      )
      SELECT number AS block_number, base_fee_per_gas, timestamp
      FROM selected_blocks
      ORDER BY timestamp ASC;
    `;

    const values = [MAX_RETURN_BLOCKS, fromTimestamp, toTimestamp];

    const pool = new Pool({
      connectionString: process.env.FOSSIL_DB_URL,
      ssl: {
        rejectUnauthorized: false,
      },
    });

    const result = await pool.query(query, values);
    await pool.end();

    if (result.rows.length == 0) {
      result.rows.push({
        block_number: undefined,
        base_fee_per_gas: undefined,
        timestamp: toTimestamp,
      });
      result.rows.push({
        block_number: undefined,
        base_fee_per_gas: undefined,
        timestamp: fromTimestamp,
      });
    }

    if (
      result.rows.length >= 1 &&
      result.rows[result.rows.length - 1].timestamp <= toTimestamp
    ) {
      const lastKnownTimestamp = parseInt(
        result.rows[result.rows.length - 1].timestamp,
      );
      if (lastKnownTimestamp <= Number(roundStart)) {
        result.rows.push({
          block_number: undefined,
          base_fee_per_gas: undefined,
          timestamp: Number(roundStart),
        });
      }

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
        });
      }
    }

    const sortedData = result.rows
      .map((r: any) => ({
        block_number: r.block_number || undefined,
        timestamp: Number(r.timestamp),
        base_fee_per_gas: r.base_fee_per_gas
          ? BigInt(r.base_fee_per_gas)
          : undefined,
      }))
      .sort((a, b) => a.timestamp - b.timestamp);

    // Find the last known block (where base_fee_per_gas is defined)
    let lastKnownBlockIndex = -1;
    for (let i = 0; i < sortedData.length; i++) {
      if (sortedData[i].base_fee_per_gas !== undefined) {
        lastKnownBlockIndex = i;
      }
    }

    let bfDeltaSum = BigInt(0);
    let timeDeltaSum = 0;
    let lastBaseFee =
      lastKnownBlockIndex >= 0
        ? sortedData[lastKnownBlockIndex].base_fee_per_gas
        : BigInt(0);
    let prevTimestamp = sortedData.length > 0 ? sortedData[0].timestamp : 0;

    const withTwap = sortedData.map((item, index) => {
      // If we're beyond the last known block index, no TWAP should be calculated
      if (index > lastKnownBlockIndex) {
        return { ...item, twap: undefined };
      }

      if (index === 0) {
        // TWAP = base fee at first point
        return {
          ...item,
          twap: item.base_fee_per_gas ? Number(item.base_fee_per_gas) : 0,
        };
      } else {
        const currentTimestamp = item.timestamp;
        const deltaTime = currentTimestamp - prevTimestamp;

        // Use current block's base fee if defined, otherwise use the last known one
        const currentBaseFee =
          item.base_fee_per_gas ?? lastBaseFee ?? BigInt(1);

        if (deltaTime > 0) {
          bfDeltaSum += currentBaseFee * BigInt(deltaTime);
          timeDeltaSum += deltaTime;
        }

        const currentTwap =
          timeDeltaSum > 0
            ? Number(bfDeltaSum / BigInt(timeDeltaSum))
            : Number(currentBaseFee);

        prevTimestamp = currentTimestamp;
        lastBaseFee = currentBaseFee;
        return {
          ...item,
          twap: currentTwap,
        };
      }
    });

    const data: any[] = withTwap.map((row) => ({
      block_number: row.block_number,
      timestamp: row.timestamp,
      BASEFEE: row.base_fee_per_gas
        ? formatUnits(row.base_fee_per_gas.toString(), "gwei")
        : undefined,
      TWAP:
        row.twap !== undefined
          ? formatUnits(Math.floor(row.twap).toString(), "gwei")
          : undefined,
    }));

    return NextResponse.json(data, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching data", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: process.env.FOSSIL_DB_URL ?? "Error",
      },
      { status: 500 },
    );
  }
}
