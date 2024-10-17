import { useAccount } from "@starknet-react/core";
import { vaultABI } from "@/abi";
import { LiquidityProviderStateType, OptionRoundActionsType, VaultStateType } from "@/lib/types";
import { stringToHex } from "@/lib/utils";
import { useMemo } from "react";
import useContractReads from "../../lib/useContractReads";
import useOptionRounds from "../optionRound/useOptionRounds";
import useOptionRoundActions from "../optionRound/useOptionRoundActions";

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
      {
        functionName: "get_account_queued_bps",
        args: [accountAddress as string],
        key: "queuedBps",
      },
    ],
  }) as unknown as LiquidityProviderStateType;

  let roundArgs=[];
  if(currentRoundId){
    for (let i = 0; i < Number(currentRoundId); i++) {
      roundArgs.push({
        functionName: "get_option_round_address",
        args: [i],
        key: "currentRoundAddress",
      });
    }
  }
  //Round Addresses and States
  const roundAddresses = useContractReads({
    contractData,
    states: roundArgs,
  }) as unknown as string[];

  const { roundStates, buyerStates } = useOptionRounds(
    getRounds ? roundAddresses : []
  );

  const roundActions = useOptionRoundActions(
    getRounds && roundAddresses.length > Number(selectedRound) - 1
      ? roundAddresses[Number(selectedRound) - 1]
      : undefined
  );
  const vaultState = {
    address,
    vaultType,
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
    currentRoundAddress: roundAddresses
      ? roundAddresses[roundAddresses.length - 1]
      : "",
    roundActions: getRounds ? roundActions : undefined,
    roundStates: getRounds ? roundStates : [],
    buyerStates: getRounds ? buyerStates : [],
  };
};

export default useVaultState;
