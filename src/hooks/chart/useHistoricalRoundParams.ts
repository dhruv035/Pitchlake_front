import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useProtocolContext } from "@/context/ProtocolProvider";
import { useEffect } from "react";

// Return type(s) for data and hook
export interface ReadVaultRoundsResponse {
  vaultAddress: string;
  currentRoundId: number;
  rounds: RoundData[];
}

export interface RoundData {
  roundId: number;
  roundAddress: string;
  capLevel: string;
  strikePrice: string;
  error?: string;
}

interface UseVaultRoundsResult {
  vaultData: ReadVaultRoundsResponse | undefined;
  isLoading: boolean;
  isError: boolean;
  error: any;
}

const fetchVaultRounds = async (
  vaultAddress: string,
): Promise<ReadVaultRoundsResponse> => {
  const response = await axios.get(
    `/api/getHistoricalRoundParams?vaultAddress=${vaultAddress}`,
  );
  return response.data;
};

export const useHistoricalRoundParams = (): UseVaultRoundsResult => {
  const { vaultState } = useProtocolContext();

  // Query UID
  const queryKey = [
    "roundHistoricalData",
    vaultState?.address,
    vaultState?.currentRoundId,
  ];

  const { data, isLoading, isError, error } = useQuery({
    queryKey,
    queryFn: () => fetchVaultRounds(vaultState?.address ?? ""),
    enabled: vaultState?.address ? true : false,
  });

  useEffect(() => {}, [vaultState?.address, vaultState?.currentRoundId]);

  return {
    vaultData: data,
    isLoading,
    isError,
    error,
  };
};
