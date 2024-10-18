import { useAccount, useContractRead, useNetwork } from "@starknet-react/core";
import { vaultABI } from "@/abi";
import {
  LiquidityProviderStateType,
  OptionRoundActionsType,
  VaultStateType,
} from "@/lib/types";
import { stringToHex } from "@/lib/utils";
import { useMemo } from "react";
import useContractReads from "../../lib/useContractReads";
import useOptionRoundActions from "../optionRound/useOptionRoundActions";
import { CairoCustomEnum } from "starknet";
import useOptionRoundState from "../optionRound/useOptionRoundState";

const useVaultState = ({
  conn,
  address,
  selectedRound,
  getRounds,
}: {
  conn: string;
  address?: string;
  selectedRound?: number | string;
  getRounds: boolean;
}) => {
  const contractData = useMemo(() => {
    return {
      abi: vaultABI,
      address: conn === "rpc" ? address : "",
    };
  }, [address, conn]);

  const { address: accountAddress } = useAccount();
  const network = useNetwork();
  console.log("Network", network);
  //Read States

  //States without a param
  const {
    vaultType,
    alpha,
    strikeLevel,
    ethAddress,
    currentRoundId,
    lockedBalance,
    unlockedBalance,
    stashedBalance,
    queuedBps,
  } = useContractReads({
    contractData,
    states: [
      { functionName: "get_vault_type", key: "vaultType" }, // will rm
      {
        functionName: "get_alpha",
        key: "alpha",
      },
      {
        functionName: "get_strike_level",
        key: "strikeLevel",
      },

      { functionName: "eth_address", key: "ethAddress" },
      // fossil client address
      {
        functionName: "get_current_round_id",
        key: "currentRoundId",
      },
      // round addresses ?
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
      { functionName: "get_vault_queued_bps", key: "queuedBps" },
    ],
  });

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
      {
        functionName: "get_account_queued_bps",
        args: [accountAddress as string],
        key: "queuedBps",
      },
    ],
  }) as unknown as LiquidityProviderStateType;

  const { data: currentRoundAddress } = useContractRead({
    ...contractData,
    functionName: "get_option_round_address",
    args: currentRoundId ? [currentRoundId.toString()] : [],
  });
  const { data: selectedRoundAddress } = useContractRead({
    ...contractData,
    functionName: "get_option_round_address",
    args: selectedRound
      ? [selectedRound.toString()]
      : currentRoundId
      ? [currentRoundId as string]
      : [],
  });
  const {
    optionRoundState: selectedRoundState,
    optionBuyerState: selectedRoundBuyerState,
  } = useOptionRoundState(selectedRoundAddress as string);
  const roundActions = useOptionRoundActions(
    getRounds ? (selectedRoundAddress as string) : undefined
  );
  const vaultState = {
    address,
    vaultType: vaultType ? (vaultType as CairoCustomEnum).activeVariant() : "",
    alpha,
    strikeLevel,
    ethAddress: ethAddress ? stringToHex(ethAddress?.toString()) : "",
    currentRoundId,
    lockedBalance,
    unlockedBalance,
    stashedBalance,
    queuedBps,
  } as VaultStateType;

  return {
    vaultState,
    lpState,
    currentRoundAddress,
    roundActions: getRounds ? roundActions : undefined,
    selectedRoundState,
    selectedRoundBuyerState
  };
};

export default useVaultState;
