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
  vaultAddress: string | undefined,
  fromRound: number | undefined,
  toRound: number | undefined,
): Promise<ReadVaultRoundsResponse> => {
  const response = await axios.get("/api/getHistoricalRoundParams", {
    params: {
      vaultAddress,
      fromRound,
      toRound,
    },
  });
  return response.data;
};

export const useHistoricalRoundParams = ({
  vaultAddress,
  fromRound,
  toRound,
}: {
  vaultAddress: string | undefined;
  fromRound: number | undefined;
  toRound: number | undefined;
}): UseVaultRoundsResult => {
  // Query UID
  const queryKey = ["roundHistoricalData", vaultAddress, fromRound, toRound];

  const { data, isLoading, isError, error } = useQuery({
    queryKey,
    queryFn: () => fetchVaultRounds(vaultAddress, fromRound, toRound),
    enabled: !!vaultAddress && !!fromRound && !!toRound,
  });

  useEffect(() => {}, [vaultAddress, toRound, fromRound]);

  return {
    vaultData: data,
    isLoading,
    isError,
    error,
  };
};
