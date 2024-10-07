import {
  useAccount,
} from "@starknet-react/core";
import { vaultABI } from "@/abi";
import { LiquidityProviderStateType, VaultStateType } from "@/lib/types";
import { stringToHex } from "@/lib/utils";
import { useMemo } from "react";
import useOptionRoundState from "../optionRound/useOptionRoundState";
import useContractReads from "../../lib/useContractReads";

const useVaultState = (address: string) => {
  const contractData = useMemo(
    () => ({
      abi: vaultABI,
      address,
    }),
    [address]
  );

  const { address: accountAddress } = useAccount();
  //Read States

  //States without a param
  const {
    currentRoundId,
    auctionRunTime,
    optionRunTime,
    roundTransitionPeriod,
    ethAddress,
    vaultType,
    lockedBalance,
    unlockedBalance,
  } = useContractReads({
    contractData,
    states: [
      { functionName: "eth_address", key: "ethAddress" },
      {
        functionName: "current_option_round_id",
        key: "currentRoundId",
      },
      { functionName: "vault_type", key: "vaultType" },
      { functionName: "get_auction_run_time", key: "auctionRunTime" },
      { functionName: "get_option_run_time", key: "optionRunTime" },
      {
        functionName: "get_round_transition_period",
        key: "roundTransitionPeriod",
      },
      {
        functionName: "get_total_locked_balance",
        key: "lockedBalance",
      },
      {
        functionName: "get_total_unlocked_balance",
        key: "unlockedBalance",
      },
    ],
  }) as unknown as VaultStateType;

  //Wallet states
  const { lockedBalance:lpLockedAmount, unlockedBalance:lpUnlockedAmount } = useContractReads({
    contractData,
    states: [
      {
        functionName: "get_lp_locked_balance",
        args: [accountAddress as string],
        key: "lpLockedAmount",
      },
      {
        functionName: "get_lp_unlocked_balance",
        args: [accountAddress as string],
        key: "lpUnlockedAmount",
      },
    ],
  }) as unknown as LiquidityProviderStateType;

  //Round Addresses and States
  const { currentRoundAddress, previousRoundAddress } = useContractReads({
    contractData,
    states: [
      {
        functionName: "get_option_round_address",
        args: currentRoundId ? [Number(currentRoundId)] : undefined,
        key: "currentRoundAddress",
      },
      {
        functionName: "get_option_round_address",
        args: currentRoundId ? [Number(currentRoundId) - 1] : undefined,
        key: "previousRoundAddress",
      },
    ],
  }) as unknown as {
    currentRoundAddress: string;
    previousRoundAddress: string;
  };
  
  const currentRoundState = useOptionRoundState(
    currentRoundAddress
      ? stringToHex(currentRoundAddress.toString())
      : undefined
  );
  const previousRoundState = useOptionRoundState(
    previousRoundAddress
      ? stringToHex(previousRoundAddress.toString())
      : undefined
  );
  const vaultState = {
    ethAddress: ethAddress ? stringToHex(ethAddress?.toString()) : "",
    address,
    vaultType: vaultType,
    lockedBalance,
    unlockedBalance,
    stashedBalance:0,
    currentRoundId,
    auctionRunTime,
    optionRunTime,
    roundTransitionPeriod,
  } as VaultStateType;
  const lpState = {
    address:accountAddress,
    lockedBalance:lpLockedAmount,
    unlockedBalance:lpUnlockedAmount,
    stashedBalance:0
  } as LiquidityProviderStateType
  return {
    vaultState,
    lpState,
    currentRoundAddress
  };
};

export default useVaultState;
