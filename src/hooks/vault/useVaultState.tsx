import { useAccount, useContractRead } from "@starknet-react/core";
import { vaultABI } from "@/abi";
import { VaultState } from "@/lib/types";
import { CairoCustomEnum } from "starknet";
import useOptionRound from "../optionRound/useOptionRound";
import { stringToHex } from "@/lib/utils";
import { useMemo } from "react";

const useVaultState = (address: string) => {
  const contractData = {
    abi: vaultABI,
    address,
  };
  console.log("ADDRESS",address)

  const { address: accountAddress } = useAccount();
  //Read States

  const ethAddress = useContractRead({
    ...contractData,
    functionName: "eth_address",
    args: [],
    watch: true,
  });
  const currentRoundId = useContractRead({
    ...contractData,
    functionName: "current_option_round_id",
    args: [],
    watch: true,
  });
  const { data: currentRoundAddress } = useContractRead({
    ...contractData,
    functionName: "get_option_round_address",
    args: currentRoundId?.data ? [Number(currentRoundId.data)] : undefined,
    watch:true,
  });

  const { data: previousRoundAddress } = useContractRead({
    ...contractData,
    functionName: "get_option_round_address",
    args:
      currentRoundId?.data && Number(currentRoundId.data) > 0
        ? [Number(currentRoundId.data) - 1]
        : undefined,
    watch:true,
  });
  const currentRound = useOptionRound(
    currentRoundAddress
      ? stringToHex(currentRoundAddress.toString())
      : undefined
  );
  const previousRound = useOptionRound(
    previousRoundAddress
      ? stringToHex(previousRoundAddress.toString())
      : undefined
  );

  const { data: vaultType } = useContractRead({
    ...contractData,
    functionName: "vault_type",
    args: [],
    watch: true,
  });

  const { data: auctionRunTime } = useContractRead({
    ...contractData,
    functionName: "get_auction_run_time",
    args: [],
    watch: true,
  });
  const { data: optionRunTime } = useContractRead({
    ...contractData,
    functionName: "get_option_run_time",
    args: [],
    watch: true,
  });
  const { data: roundTransitionPeriod } = useContractRead({
    ...contractData,
    functionName: "get_round_transition_period",
    args: [],
    watch: true,
  });

  const { data: lpLockedAmount } = useContractRead({
    ...contractData,
    functionName: "get_lp_locked_balance",
    args: [accountAddress as string],
    watch: true,
  });

  const { data: lpUnlockedAmount } = useContractRead({
    ...contractData,
    functionName: "get_lp_unlocked_balance",
    args: [accountAddress as string],
    watch: true,
  });
  const { data: vaultLockedAmount } = useContractRead({
    ...contractData,
    functionName: "get_total_locked_balance",
    watch: true,
    args: [],
  });

  const { data: vaultUnlockedAmount } = useContractRead({
    ...contractData,
    functionName: "get_total_unlocked_balance",
    watch: true,
    args: [],
  });
  return {
    state: {
      ethAddress: ethAddress.data?stringToHex(ethAddress.data.toString()):undefined,
      address,
      vaultType: vaultType as CairoCustomEnum,
      vaultLockedAmount: vaultLockedAmount
        ? Number(vaultLockedAmount)
        : undefined,
      vaultUnlockedAmount,
      lpLockedAmount,
      lpUnlockedAmount,
      currentRoundId: currentRoundId.isSuccess
        ? Number(currentRoundId.data)
        : 0,
      auctionRunTime,
      optionRunTime,
      roundTransitionPeriod,
    } as VaultState,
    currentRoundAddress,
    previousRoundAddress,
    currentRound,
    previousRound,
  };
};

export default useVaultState;
