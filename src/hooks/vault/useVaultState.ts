import { useAccount, useContractRead, useNetwork } from "@starknet-react/core";
import { vaultABI } from "@/abi";
import { LiquidityProviderStateType, VaultStateType } from "@/lib/types";
import { stringToHex } from "@/lib/utils";
import { useMemo } from "react";
import useContractReads from "../../lib/useContractReads";
import useOptionRoundActions from "../optionRound/useOptionRoundActions";
import { CairoCustomEnum, RpcProvider } from "starknet";
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
  //const account = getDevAccount(
  //  new RpcProvider({ nodeUrl: "http://localhost:5050/rpc" }),
  //);

  const contractData = useMemo(() => {
    return {
      abi: vaultABI,
      address: conn === "rpc" ? address : "",
    };
  }, [address, conn]);

  const { account } = useAccount();
  //const { address: accountAddress } = useAccount();
  console.log("account in state read", account?.address);
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

      { functionName: "get_eth_address", key: "ethAddress" },
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
        args: [account?.address as string],
        key: "lockedBalance",
      },
      {
        functionName: "get_account_unlocked_balance",
        args: [account?.address as string],
        key: "unlockedBalance",
      },
      {
        functionName: "get_account_stashed_balance",
        args: [account?.address as string],
        key: "stashedBalance",
      },
      {
        functionName: "get_account_queued_bps",
        args: [account?.address as string],
        key: "queuedBps",
      },
    ],
  }) as unknown as LiquidityProviderStateType;

  const { data: currentRoundAddress } = useContractRead({
    ...contractData,
    functionName: "get_round_address",
    args: currentRoundId ? [currentRoundId.toString()] : [],
  });
  // console.log("selectedRound", selectedRound);
  const { data: selectedRoundAddress } = useContractRead({
    ...contractData,
    functionName: "get_round_address",
    args:
      selectedRound && selectedRound !== 0
        ? [selectedRound.toString()]
        : undefined,
  });
  const usableString = useMemo(() => {
    return stringToHex(selectedRoundAddress?.toString());
  }, [selectedRoundAddress]);
  const { optionRoundState, optionBuyerState } =
    useOptionRoundState(usableString);

  const roundAction = useOptionRoundActions(usableString);

  // Memoize the states and actions
  const selectedRoundState = useMemo(
    () => optionRoundState,
    [optionRoundState],
  );
  const selectedRoundBuyerState = useMemo(
    () => optionBuyerState,
    [optionBuyerState],
  );
  const roundActions = useMemo(() => roundAction, [roundAction]);

  console.log("VAULT STATE TEST: ", {
    address,
    vaultType,
    alpha,
    strikeLevel,
    ethAddress,
    currentRoundId,
    lockedBalance,
    unlockedBalance,
    stashedBalance,
    queuedBps,
    lpState,
    currentRoundAddress,
    roundActions,
    selectedRoundState,
    selectedRoundBuyerState,
  });

  return {
    vaultState: {
      address,
      alpha: alpha ? alpha.toString() : 0,
      strikeLevel: strikeLevel ? strikeLevel.toString() : 0,
      ethAddress: ethAddress ? stringToHex(ethAddress?.toString()) : "",
      currentRoundId: currentRoundId ? currentRoundId.toString() : 0,
      lockedBalance: lockedBalance ? lockedBalance.toString() : 0,
      unlockedBalance: unlockedBalance ? unlockedBalance.toString() : 0,
      stashedBalance: stashedBalance ? stashedBalance.toString() : 0,
      queuedBps: queuedBps ? queuedBps.toString() : 0,
      vaultType: vaultType
        ? (vaultType as CairoCustomEnum).activeVariant()
        : "",
    } as VaultStateType,
    lpState,
    currentRoundAddress,
    roundActions: getRounds ? roundActions : undefined,
    selectedRoundState,
    selectedRoundBuyerState,
  };
};

export default useVaultState;
