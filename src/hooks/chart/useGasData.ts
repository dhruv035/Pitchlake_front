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