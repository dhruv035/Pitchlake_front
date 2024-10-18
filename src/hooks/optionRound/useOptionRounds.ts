import { useState, useEffect } from 'react';
import { useContractRead } from '@starknet-react/core';
import { OptionBuyerStateType, OptionRoundStateType } from '@/lib/types';
import { vaultABI } from '@/abi';
import useOptionRoundState from './useOptionRoundState';
import { useMemo } from 'react';


const useOptionRounds = ({ currentRoundId, vaultAddress }: { currentRoundId: string | number | bigint, vaultAddress?: string }) => {
  const [roundStates, setRoundStates] = useState<OptionRoundStateType[]>([]);
  const [buyerStates, setBuyerStates] = useState<OptionBuyerStateType[]>([]);

  useEffect(() => {
    const fetchRoundStates = async () => {
      const roundStates: OptionRoundStateType[] = [];
      const buyerStates: OptionBuyerStateType[] = [];

      // Loop through the rounds based on currentRoundId
      for (let i = 0; i < Number(currentRoundId); i++) {
        // Using try-catch to avoid breaking on an error and checking for undefined
        try {
          const { data: optionAddress } = await useContractRead({
            abi: vaultABI,
            address: vaultAddress,
            functionName: "get_option_round_address",
            args: [i],
          });

          // If optionAddress is valid, fetch the round and buyer state
          if (optionAddress) {
            const { optionRoundState, optionBuyerState } = await useOptionRoundState(optionAddress as string);
            roundStates.push(optionRoundState);
            buyerStates.push(optionBuyerState);
          } else {
            console.warn(`Option address not found for round: ${i}`);
          }
        } catch (error) {
          console.error(`Error fetching data for round ${i}:`, error);
        }
      }

      // Once all round states are fetched, update the state
      setRoundStates(roundStates);
      setBuyerStates(buyerStates);
    };

    // Only fetch if vaultAddress and currentRoundId are defined
    if (vaultAddress && currentRoundId) {
      fetchRoundStates();
    }
  }, [currentRoundId, vaultAddress]);

  return { roundStates, buyerStates };
};
export default useOptionRounds