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
    ethAddress,
    currentRoundId,
    vaultType,
    lockedBalance,
    unlockedBalance,
    stashedBalance,
  } = useContractReads({
    contractData,
    states: [
      { functionName: "eth_address", key: "ethAddress" },
      {
        functionName: "get_current_round_id",
        key: "currentRoundId",
      },
      { functionName: "get_vault_type", key: "vaultType" },
      {
        functionName: "get_vault_locked_balance",
        key: "lockedBalance",
      },
      {
        functionName: "get_vault_unlocked_balance",
        key: "unlockedBalance",
      },
      {
        functionName: "get_vault_stashed_balance",
        key: "stashedBalance",
      }
    ],
  }) as unknown as VaultStateType;

  console.log("VAULT LOCKED", lockedBalance, "UNLOCKED", unlockedBalance, "STASHED", stashedBalance);
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
    stashedBalance:stashedBalance,
    currentRoundId,
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
