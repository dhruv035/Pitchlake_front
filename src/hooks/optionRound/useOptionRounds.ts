import { useContractRead, UseContractReadProps } from "@starknet-react/core";
import { stat } from "fs";
import { Abi, Result } from "starknet";
import useOptionRoundState from "./useOptionRoundState";
import { OptionBuyerStateType, OptionRoundStateType } from "@/lib/types";

const useOptionRounds = ({
  contractData,
  watch,
  roundAddresses,
  states,
}: {
  contractData: { abi?: Abi; address?: string };
  watch?: boolean;
  roundAddresses: string[];
  states: Array<{ functionName: string; args?: Array<any>; key: string }>;
}) => {
  const obj: Array<{
    optionRoundState: OptionRoundStateType;
    optionBuyerState: OptionBuyerStateType;
  }> = [];
  roundAddresses.forEach((round) => {
    //Looped hooks, need to disable rules, the sequentially declaration is ensured here
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { optionRoundState, optionBuyerState } = useOptionRoundState(round);
    obj.push({optionBuyerState,optionRoundState})
  });
  return obj;
};

export default useOptionRounds;
