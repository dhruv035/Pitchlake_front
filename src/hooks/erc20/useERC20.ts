import {
  useAccount,
  useContract,
  useContractRead,
  useContractWrite,
} from "@starknet-react/core";
import { useCallback, useMemo } from "react";
import { ApprovalArgs, TransactionResult } from "@/lib/types";
import { erc20ABI } from "@/abi";
import { Account, RpcProvider } from "starknet";
import { useTransactionContext } from "@/context/TransactionProvider";
import { getDevAccount } from "@/lib/constants";

const useERC20 = (tokenAddress: string | undefined, target?: string) => {
  //   const typedContract = useContract({abi:erc20ABI,address}).contract?.typedv2(erc20ABI)
  const contractData = {
    abi: erc20ABI,
    address: tokenAddress,
  };

  const { contract } = useContract({ ...contractData });
  const { isDev, devAccount, setPendingTx } = useTransactionContext();
  const { account: connectorAccount } = useAccount();

  // const { writeAsync } = useContractWrite({});

  const account = useMemo(() => {
    if (isDev === true) {
      return devAccount;
    } else return connectorAccount;
  }, [connectorAccount, isDev, devAccount]);

  const typedContract = useMemo(() => {
    if (!contract) return;
    const typedContract = contract.typedv2(erc20ABI);
    if (account) typedContract.connect(account as Account);

    return typedContract;
  }, [contract, account]);
  // const { writeAsync } = useContractWrite({});

  //Read States

  const balance = useContractRead({
    abi: erc20ABI,
    address: tokenAddress ? tokenAddress : undefined,
    functionName: "balance_of",
    args: account ? [account.address] : undefined,
    watch: true,
  });

  const allowance = useContractRead({
    abi: erc20ABI,
    address: tokenAddress ? tokenAddress : undefined,
    functionName: "allowance",
    args: account?.address && target ? [account.address, target] : undefined,
    watch: true,
  });

  const increaseAllowance = useCallback(
    async (approvalArgs: ApprovalArgs) => {
      if (!typedContract) return;
      try {
        const data = await typedContract.increaseAllowance(
          approvalArgs.spender,
          approvalArgs.amount,
        );
        const typedData = data as TransactionResult;
        setPendingTx(typedData.transaction_hash);
      } catch (err) {
        console.log("ERR", err);
      }
    },
    [typedContract, setPendingTx],
  );

  return {
    balance,
    allowance,
    increaseAllowance,
  };
};

export default useERC20;
