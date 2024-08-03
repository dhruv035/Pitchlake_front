import {
  useAccount,
  useContract,
  useContractWrite,
  useNetwork,
  useProvider,
} from "@starknet-react/core";
import { vaultABI } from "@/abi";
import {
  DepositArgs,
  TransactionResult,
  VaultActionsType,
  WithdrawArgs,
} from "@/lib/types";
import { Account, LibraryError, Provider, RpcProvider } from "starknet";
import { useCallback, useMemo, useState } from "react";
import { stringToHex } from "@/lib/utils";
import { getDevAccount } from "@/lib/constants";
import { useTransactionContext } from "@/context/TransactionProvider";

const useVaultActions = (address: string) => {
  const { contract } = useContract({
    abi: vaultABI,
    address,
  });

  const { isDev,devAccount } = useTransactionContext();
  const { account: connectorAccount } = useAccount();
  const { setPendingTx } = useTransactionContext();

  const account = useMemo(() => {
    if (isDev === true) {
     
      return devAccount;
    } else return connectorAccount;
  }, [connectorAccount, isDev]);

  const typedContract = useMemo(() => {
    const typedContract = contract?.typedv2(vaultABI);
    if (account) typedContract?.connect(account as Account);
    return typedContract;
  }, [contract, account]);

  //Maybe used later to rewrite calls as useMemos with and writeAsync
  //May not be required if we watch our transactions off the plugin
  // const { writeAsync } = useContractWrite({});
  // const contractData = {
  //   abi: vaultABI,
  //   address,
  // };

  //Write Calls
  const depositLiquidity = useCallback(
    async (depositArgs: DepositArgs) => {
      console.log("!")
      if (!typedContract) {
        console.log("123")
        //Throw toast here
        return;
      }
      console.log("ARGSDEP", depositArgs);
      try {
        console.log("HEXDD", stringToHex(depositArgs.beneficiary));
        const data = await typedContract?.deposit_liquidity(
          BigInt(depositArgs.amount),
          depositArgs.beneficiary
        );
        console.log("DATATAS",data)
        const typedData = data as TransactionResult;
        setPendingTx(typedData.transaction_hash);
        // const data = await writeAsync({ calls: [callData] });
        return typedData;
        //Use data.transaction hash to watch for updates
      } catch (err) {
        const error = err as LibraryError;
        console.log("ERROR", error);
        //Throw toast with library error
        return;
      }
    },
    [typedContract, account]
  );

  const withdrawLiquidity = useCallback(
    async (withdrawArgs: WithdrawArgs) => {
      if (!typedContract) {
        //Throw toast here
        return;
      }
      try {
        const data = await typedContract.withdraw_liquidity(
          withdrawArgs.amount
        );
        const typedData = data as TransactionResult;
        setPendingTx(typedData.transaction_hash);
        // const data = await writeAsync({ calls: [callData] });
        return typedData;
        //Use data.transaction hash to watch for updates
      } catch (err) {
        const error = err as LibraryError;
        //Throw toast with library error
      }
    },
    [typedContract, account]
  );

  //State Transition

  const startAuction = useCallback(async () => {
    if (!typedContract) {
      //Throw toast here
      return;
    }
    try {
      const data = await typedContract.start_auction();
      const typedData = data as TransactionResult;
      setPendingTx(typedData.transaction_hash);
      // const data = await writeAsync({ calls: [callData] });
      return typedData;
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
    depositLiquidity,
    withdrawLiquidity,
    startAuction,
    endAuction,
    settleOptionRound,
  } as VaultActionsType;
};

export default useVaultActions;
