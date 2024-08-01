import {
  useAccount,
  useContract,
  useContractRead,
  useContractWrite,
} from "@starknet-react/core";
import { useCallback, useMemo } from "react";
import { ApprovalArgs } from "@/lib/types";
import { erc20ABI } from "@/abi";
import { Account } from "starknet";

const useERC20 = (tokenAddress: string | undefined, target?: string) => {
  //   const typedContract = useContract({abi:erc20ABI,address}).contract?.typedv2(erc20ABI)
  const contractData = {
    abi: erc20ABI,
    address: tokenAddress,
  };
  console.log("tokenAddress",tokenAddress)

  const {contract} = useContract({ ...contractData });
  const typedContract = useMemo(() => contract?.typedv2(erc20ABI), [contract]);

  const { writeAsync } = useContractWrite({});
  const { account, address: accountAddress } = useAccount();
  //Read States

  const balance = useContractRead({
    abi: erc20ABI,
    address: tokenAddress ? tokenAddress : undefined,
    functionName: "balance_of",
    args: accountAddress ? [accountAddress] : undefined,
    watch: true,
  });

  const allowance = useContractRead({
    abi: erc20ABI,
    address: tokenAddress ? tokenAddress : undefined,
    functionName: "allowance",
    args: accountAddress && target ? [accountAddress, target] : undefined,
    watch: true,
  });
  const approve = useCallback(
    async (approvalArgs: ApprovalArgs) => {
        console.log("TYPEDCONTRACT",typedContract)
      if (!typedContract) return;
      try {
        console.log("HEY", approvalArgs.spender, approvalArgs.amount);
        typedContract?.connect(account as Account);
        await typedContract.approve(approvalArgs.spender,approvalArgs.amount)
      } catch (err) {
        console.log("ERR", err);
      }
    },
    [typedContract, accountAddress]
  );

  return {
    balance: balance.data ? BigInt(balance.data.toString()) : undefined,
    allowance: allowance.data ? BigInt(allowance.data.toString()) : undefined,
    approve,
  };
};

export default useERC20;
