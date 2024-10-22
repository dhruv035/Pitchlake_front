import { useAccount, useContractRead, useNetwork } from "@starknet-react/core";
import { vaultABI } from "@/abi";
import { LiquidityProviderStateType, VaultStateType } from "@/lib/types";
import { stringToHex } from "@/lib/utils";
import { useMemo } from "react";
import useContractReads from "../../lib/useContractReads";
import useOptionRoundActions from "../optionRound/useOptionRoundActions";
import { CairoCustomEnum, RpcProvider } from "starknet";
import useOptionRoundState from "../optionRound/useOptionRoundState";
import { getDevAccount } from "@/lib/constants";
import { useProvider } from "@starknet-react/core";
import useERC20 from "../erc20/useERC20";

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
  const contractData = {
    abi: vaultABI,
    address,
    // "0x078c96c4238c1d0294b6cfacfbfdba1cc289e978685231284a3bd2ae00dd3f56",
  };

  //const { address: accountAddress } = useAccount();
  const account = getDevAccount(
    new RpcProvider({ nodeUrl: "http://localhost:5050/rpc" }),
  );

  //    {
  //    address: "0x8ef103ecee8d069b10ccdb8658e9dbced4da8160b51c37e517510d86ea21d9",
  //  };
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
        : currentRoundId
          ? [currentRoundId.toString()]
          : [1],
  });
  const usableString = useMemo(() => {
    return stringToHex(selectedRoundAddress?.toString());
  }, [selectedRoundAddress]);
  const {
    optionRoundState: selectedRoundState,
    optionBuyerState: selectedRoundBuyerState,
  } = useOptionRoundState(usableString);
  const roundActions = useOptionRoundActions(usableString);

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
