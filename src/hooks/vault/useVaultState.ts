import { useAccount } from "@starknet-react/core";
import { vaultABI } from "@/abi";
import { LiquidityProviderStateType, VaultStateType } from "@/lib/types";
import { stringToHex } from "@/lib/utils";
import { useMemo } from "react";
import useContractReads from "../../lib/useContractReads";

const useVaultState = (isRPC: boolean, address: string) => {
  const contractData = useMemo(() => {
    return {
      abi: vaultABI,
      address: isRPC ? "" : address,
    };
  }, [address, isRPC]);

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
      },
    ],
  }) as unknown as VaultStateType;

  //Wallet states
  const lpState = useContractReads({
    contractData,
    states: [
      {
        functionName: "get_account_locked_balance",
        args: [accountAddress as string],
        key: "lockedBalance",
      },
      {
        functionName: "get_account_unlocked_balance",
        args: [accountAddress as string],
        key: "unlockedBalance",
      },
      {
        functionName: "get_account_stashed_balance",
        args: [accountAddress as string],
        key: "stashedBalance",
      },
    ],
  }) as unknown as LiquidityProviderStateType;

  //Round Addresses and States
  const { currentRoundAddress } = useContractReads({
    contractData,
    states: [
      {
        functionName: "get_option_round_address",
        args: currentRoundId ? [Number(currentRoundId)] : undefined,
        key: "currentRoundAddress",
      },
    ],
  }) as unknown as {
    currentRoundAddress: string;
  };

  const vaultState = {
    ethAddress: ethAddress ? stringToHex(ethAddress?.toString()) : "",
    address,
    vaultType: vaultType,
    lockedBalance,
    unlockedBalance,
    stashedBalance: stashedBalance,
    currentRoundId,
  } as VaultStateType;

  return {
    vaultState,
    lpState,
    currentRoundAddress,
  };
};

export default useVaultState;
