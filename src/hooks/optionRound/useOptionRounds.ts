import { useContractRead, UseContractReadProps } from "@starknet-react/core";
import { stat } from "fs";
import { Abi, Result } from "starknet";
import useOptionRoundState from "./useOptionRoundState";
import { OptionBuyerStateType, OptionRoundStateType } from "@/lib/types";

const useOptionRounds = (roundAddresses: string[]) => {
  const roundStates: OptionRoundStateType[] = [];
  const buyerStates: OptionBuyerStateType[] = [];
  console.log("roundAddresses",roundAddresses);
  roundAddresses?.length && roundAddresses?.forEach((round) => {
    //Looped hooks, need to disable rules, the sequentially declaration is ensured here
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { optionRoundState, optionBuyerState } = useOptionRoundState(round);
    roundStates.push(optionRoundState);
    buyerStates.push(optionBuyerState);
  });
  return { roundStates, buyerStates };
};

export default useOptionRounds;
