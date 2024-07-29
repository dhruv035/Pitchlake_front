import {
  useAccount,
  useContract,
  useContractRead,
  useNetwork,
  useProvider,
} from "@starknet-react/core";
import { vaultABI } from "@/abi";
import { DepositArgs } from "@/lib/types";
import { LibraryError } from "starknet";
import { use, useCallback, useMemo } from "react";

const useVault = (address: string) => {
  const contractData = {
    abi: vaultABI,
    address,
  };

  const { contract } = useContract({
    ...contractData,
  });

  const typedContract = contract?.typedv2(vaultABI);
  const { address: accountAddress } = useAccount();

  const data = typedContract?.populate("get_total_balance");
  console.log("data", data);
  const { chain } = useNetwork();
  const { provider } = useProvider();
  const selector = console.log("PROVIDER", provider, typedContract, chain);
  //Read States
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
  });

  const { data: vaultUnlockedAmount } = useContractRead({
    ...contractData,
    functionName: "get_total_unlocked_balance",
    watch: true,
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
      vaultLockedAmount,
      vaultUnlockedAmount,
      lpLockedAmount,
      lpUnlockedAmount,
    },
    depositLiquidity,
    withdrawLiquidity,
    startAuction,
    endAuction,
    settleOptionRound,
  };
};

export default useVault;
