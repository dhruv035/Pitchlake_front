import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useProtocolContext } from "@/context/ProtocolProvider";

// Define the response data structure
interface GasDataPoint {
  block_number: number;
  base_fee_per_gas: string;
  timestamp: number;
  twap: string;
}

// Define the hook parameters
interface UseGasDataParams {
  lowerTimestamp: number;
  upperTimestamp: number;
  maxDataPoints: number;
  twapRange: number; // in seconds
}

// Define the API response type
type GetGasDataResponse = GasDataPoint[];

// Define the fetch function
const fetchGasData = async (
  fromTimestamp: number,
  toTimestamp: number,
  twapRange: number,
): Promise<GetGasDataResponse> => {
  const response = await axios.get("/api/getGasData", {
    params: {
      from_timestamp: fromTimestamp,
      to_timestamp: toTimestamp,
      twap_range: twapRange,
      // You can add maxReturnBlocks and twapBlockLimit as query params if your API supports them
    },
  });
  return response.data;
};

export const useGasData = ({
  lowerTimestamp,
  upperTimestamp,
  maxDataPoints,
  twapRange,
}: UseGasDataParams): {
  gasData: GasDataPoint[] | undefined;
  isLoading: boolean;
  isError: boolean;
  error: any;
} => {
  const { conn } = useProtocolContext();

  // Define a unique query key based on parameters
  const queryKey = [
    "gasData",
    lowerTimestamp,
    upperTimestamp,
    twapRange,
    maxDataPoints,
  ];

  // Use React Query's useQuery
  const { data, isLoading, isError, error } = useQuery({
    queryKey,
    queryFn: () => fetchGasData(lowerTimestamp, upperTimestamp, twapRange),

    enabled:
      typeof lowerTimestamp === "number" &&
      typeof upperTimestamp === "number" &&
      typeof twapRange === "number" &&
      lowerTimestamp > 1 &&
      upperTimestamp > 1,
  });

  return {
    gasData: data,
    isLoading,
    isError,
    error,
  };
};
//import { useMemo } from "react";
//import { useProtocolContext } from "@/context/ProtocolProvider";
//import { formatUnits, parseUnits } from "ethers";
//
//interface GasDataPoint {
//  timestamp: number;
//  baseFeePerGas: number | null;
//  TWAP: number | null;
//}
//
//interface UseGasDataParams {
//  lowerTimestamp: number;
//  upperTimestamp: number;
//  maxDataPoints: number;
//  twapRange: number; // in seconds
//}
//
//export const useGasData = ({
//  lowerTimestamp,
//  upperTimestamp,
//  maxDataPoints,
//  twapRange,
//}: UseGasDataParams): GasDataPoint[] => {
//  const { basefeeData } = useProtocolContext();
//
//  const gasData = useMemo(() => {
//    console.log("computing for", lowerTimestamp, upperTimestamp);
//
//    if (!basefeeData || basefeeData.length === 0) {
//      return [];
//    }
///
//    // Calculate the interval between points
//    const interval = Math.floor(
//      (upperTimestamp - lowerTimestamp) / (maxDataPoints - 1),
//    );
//
//    // Generate evenly spaced timestamps across the range
//    const allTimestamps = Array.from(
//      { length: maxDataPoints },
//      (_, index) => lowerTimestamp + index * interval,
//    );
//
//    // Helper function to find the closest block for a given timestamp
//    const findClosestBlock = (timestamp: number) => {
//      return basefeeData.reduce((closest, block) => {
//        const closestDiff = Math.abs(closest.timestamp - timestamp);
//        const blockDiff = Math.abs(block.timestamp - timestamp);
//
//        return blockDiff < closestDiff ? block : closest;
//      }, basefeeData[0]); // Start with the first block as the initial closest
//    };
//
//    // Fill data with the closest blocks or placeholders
//    const filledData = allTimestamps.map((timestamp) => {
//      const closestBlock = findClosestBlock(timestamp);
//
//      // Use the closest block if it's within ±6 seconds of the target timestamp
//      if (Math.abs(closestBlock.timestamp - timestamp) <= 6) {
//        return {
//          ...closestBlock,
//          BASEFEE: formatUnits(
//            Number(closestBlock.base_fee_per_gas).toString(),
//            "gwei",
//          ),
//        };
//      }
//
//      // Otherwise, return a placeholder with only the timestamp
//      return {
//        timestamp,
//        base_fee_per_gas: null,
//        BASEFEE: null,
//      };
//    });
//
//    // Create cumulative sum of baseFeePerGas for TWAP calculation
//    const cumulativeSum: number[] = [];
//    basefeeData.forEach((item, index) => {
//      const currentBaseFee = Number(item.base_fee_per_gas);
//      if (index === 0) {
//        cumulativeSum.push(currentBaseFee);
//      } else {
//        cumulativeSum.push(cumulativeSum[index - 1] + currentBaseFee);
//      }
//    });
//
//    // Create a map for quick timestamp-to-index lookup
//    const timestampIndexMap = new Map<number, number>();
//    basefeeData.forEach((item, index) => {
//      timestampIndexMap.set(item.timestamp, index);
//    });
//
//    // Calculate TWAP for each data point
//    const twapData = filledData.map((item) => {
//      if (item.base_fee_per_gas === null) {
//        return {
//          ...item,
//          TWAP: null,
//        };
//      }
//
//      const endTime = item.timestamp;
//      const startTime = endTime - twapRange;
//
//      // Find the closest indices for startTime and endTime
//      const endIndex = timestampIndexMap.get(endTime) ?? -1;
//      const startIndex = basefeeData.findIndex((d) => d.timestamp >= startTime);
//
//      if (endIndex === -1 || startIndex === -1 || startIndex > endIndex) {
//        return {
//          ...item,
//          TWAP: null,
//        };
//      }
//
//      // Calculate TWAP
//      const totalSum =
//        cumulativeSum[endIndex] -
//        (startIndex > 0 ? cumulativeSum[startIndex - 1] : 0);
//      const count = endIndex - startIndex + 1;
//
//      if (count <= 0) {
//        return {
//          ...item,
//          TWAP: null,
//        };
//      }
//
//      const twap = totalSum / count;
//
//      return {
//        ...item,
//        TWAP: formatUnits(Math.floor(twap).toString(), "gwei"),
//        timestamp: item.timestamp.toString(),
//      };
//    });
//
//    return twapData.map((item) => ({
//      ...item,
//      timestamp: item.timestamp.toString(),
//    }));
//  }, [basefeeData, lowerTimestamp, upperTimestamp, maxDataPoints, twapRange]);
//
//  return gasData;
//};
