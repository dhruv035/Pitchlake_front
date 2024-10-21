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
import { toast } from "react-toastify";
import { displayToastError } from "@/lib/toasts";

const useVaultActions = (address?: string) => {
  const { contract } = useContract({
    abi: vaultABI,
    address,
  });

  const { isDev, devAccount } = useTransactionContext();
  const { account: connectorAccount } = useAccount();
  const { setPendingTx } = useTransactionContext();

  const account = useMemo(() => {
    if (isDev === true) {
      return devAccount;
    } else return connectorAccount;
  }, [connectorAccount, isDev, devAccount]);

  const typedContract = useMemo(() => {
    if (!contract) return;
    const typedContract = contract.typedv2(vaultABI);
    if (account) typedContract.connect(account as Account);
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

  const depositLiquidity = async (depositArgs: DepositArgs) => {
    await callContract("deposit_liquidity")(depositArgs);
  };

  const withdrawLiquidity = async (withdrawArgs: WithdrawArgs) => {
    await callContract("withdraw_liquidity")(withdrawArgs);
  };

  const startAuction = async () => {
    await callContract("start_auction")();
  };

  const endAuction = async () => {
    await callContract("end_auction")();
  };

  const settleOptionRound = async () => {
    await callContract("settle_option_round")();
  };

  const callContract = useCallback(
    (functionName: string) => async (args?: DepositArgs | WithdrawArgs) => {
      if (!typedContract) return;
      let argsData;
      if (args) argsData = Object.values(args).map((value) => value);
      let data;
      if (argsData) {
        data = await typedContract?.[functionName](...argsData);
      } else {
        data = await typedContract?.[functionName]();
      }
      const typedData = data as TransactionResult;
      setPendingTx(typedData.transaction_hash);
      // const data = await writeAsync({ calls: [callData] });
      return typedData;
    },
    [typedContract, setPendingTx],
  );

  //State Transition

  return {
    depositLiquidity,
    withdrawLiquidity,
    startAuction,
    endAuction,
    settleOptionRound,
  } as VaultActionsType;
};

export default useVaultActions;
