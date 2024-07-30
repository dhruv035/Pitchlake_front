import {
  useAccount,
  useContract,
  useContractRead,
  useNetwork,
  useProvider,
} from "@starknet-react/core";
import { vaultABI } from "@/abi";
import { DepositArgs } from "@/lib/types";
import { CairoCustomEnum, LibraryError } from "starknet";
import { use, useCallback, useEffect, useMemo } from "react";
import useOptionRound from "./optionRound/useOptionRound";
import { stringToHex } from "@/lib/utils";

const useVault = (address: string) => {
  const contractData = {
    abi: vaultABI,
    address,
  };

  const { contract } = useContract({
    ...contractData,
  });

  const typedContract = useMemo(() => contract?.typedv2(vaultABI), [contract]);
  const { address: accountAddress } = useAccount();
  const { chain } = useNetwork();
  const { provider } = useProvider();
  //Read States



  const { data: currentRoundId } = useContractRead({
    ...contractData,
    functionName: "current_option_round_id",
    args: [],
    watch: true,
  });
  const { data: currentRoundAddress } = useContractRead({
    ...contractData,
    functionName: "get_option_round_address",
    args:currentRoundId?[Number(currentRoundId)]:undefined
  });

  const { data: previousRoundAddress } = useContractRead({
    ...contractData,
    functionName: "get_option_round_address",
    args:currentRoundId &&Number(currentRoundId)>0?[Number(currentRoundId)-1]:undefined
  });
  const currentRound = useOptionRound(currentRoundAddress?stringToHex(currentRoundAddress.toString()):undefined);
  const previousRound = useOptionRound(previousRoundAddress?stringToHex(previousRoundAddress.toString()):undefined);




  const {data:vaultType} = useContractRead({
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
  const {
    data: vaultLockedAmount
  } = useContractRead({
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

  //Write Calls
  const depositLiquidity = useCallback(
    async (depositArgs: DepositArgs) => {
      if (!typedContract) {
        //Throw toast here
        return;
      }
      try {
        const data = await typedContract.deposit_liquidity(
          depositArgs.amount,
          depositArgs.beneficiary
        );
        return data as { transaction_hash: string };
        //Use data.transaction hash to watch for updates
      } catch (err) {
        const error = err as LibraryError;
        //Throw toast with library error
        return;
      }
    },
    [typedContract]
  );

  const withdrawLiquidity = useCallback(
    async (withdrawAmount: number | bigint) => {
      if (!typedContract) {
        //Throw toast here
        return;
      }
      try {
        const data = await typedContract.withdraw_liquidity(withdrawAmount);
        //Use data.transaction hash to watch for updates
      } catch (err) {
        const error = err as LibraryError;
        //Throw toast with library error
      }
    },
    [typedContract]
  );

  //State Transition

  const startAuction = useCallback(async () => {
    if (!typedContract) {
      //Throw toast here
      return;
    }
    try {
      const data = await typedContract.start_auction();
      //Use data.transaction hash to watch for updates
    } catch (err) {
      const error = err as LibraryError;
      //Throw toast with library error
    }
  }, [typedContract]);

  const endAuction = useCallback(async () => {
    if (!typedContract) {
      //Throw toast here
      return;
    }
    try {
      const data = await typedContract.end_auction();
      //Use data.transaction hash to watch for updates
    } catch (err) {
      const error = err as LibraryError;
      //Throw toast with library error
    }
  }, [typedContract]);

  const settleOptionRound = useCallback(async () => {
    if (!typedContract) {
      //Throw toast here
      return;
    }
    try {
      const data = await typedContract.settle_option_round();
      //Use data.transaction hash to watch for updates
    } catch (err) {
      const error = err as LibraryError;
      //Throw toast with library error
    }
  }, [typedContract]);

  return {
    state: {
      vaultType:vaultType as CairoCustomEnum,
      vaultLockedAmount,
      vaultUnlockedAmount,
      lpLockedAmount,
      lpUnlockedAmount,
      currentRoundId,
      auctionRunTime,
      optionRunTime,
      roundTransitionPeriod,
    },
    currentRound,
    previousRound,
    depositLiquidity,
    withdrawLiquidity,
    startAuction,
    endAuction,
    settleOptionRound,
  };
};

export default useVault;
