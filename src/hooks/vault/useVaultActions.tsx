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
import { Account, LibraryError } from "starknet";
import { useCallback, useMemo } from "react";
import { stringToHex } from "@/lib/utils";

const useVaultActions = (address: string) => {
  const { contract } = useContract({
    abi: vaultABI,
    address,
  });
  const { writeAsync } = useContractWrite({});
  const contractData = {
    abi: vaultABI,
    address,
  };
  const { account } = useAccount();

  const typedContract = useMemo(() => contract?.typedv2(vaultABI), [contract]);

  //Write Calls
  const depositLiquidity = useCallback(
    async (depositArgs: DepositArgs) => {
      if (!contract) {
        //Throw toast here
        return;
      }
      try {

        console.log("HEXDD",stringToHex(depositArgs.beneficiary))
        typedContract?.connect(account as Account);
        const data = await typedContract?.deposit_liquidity(
          BigInt(2),
          (depositArgs.beneficiary)
          
        );
        // const data = await writeAsync({ calls: [callData] });
        return data as TransactionResult;
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
        return data as TransactionResult;
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
    depositLiquidity,
    withdrawLiquidity,
    startAuction,
    endAuction,
    settleOptionRound,
  } as VaultActionsType;
};

export default useVaultActions;
