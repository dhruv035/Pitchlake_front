import { optionRoundABI } from "@/abi";
import { useTransactionContext } from "@/context/TransactionProvider";
import {
  OptionRoundState,
  PlaceBidArgs,
  RefundableBidsArgs,
  RefundUnusedBidsArgs,
  RoundState,
  TransactionResult,
  UpdateBidArgs,
} from "@/lib/types";
import { useAccount, useContract, useContractRead } from "@starknet-react/core";
import { useCallback, useMemo } from "react";
import { CairoCustomEnum, LibraryError } from "starknet";

const useOptionRoundActions = (address: string | undefined) => {
  const contractData = useMemo(() => {
    return { abi: optionRoundABI, address };
  }, [address]);
  const { setPendingTx } = useTransactionContext();
  const { account } = useAccount();
  const typedContract = useContract({
    ...contractData,
  }).contract?.typedv2(optionRoundABI);

  //Write Calls

  const placeBid = async (args: PlaceBidArgs) => {
    await callContract("place_bid")(args);
  };

  const updateBid = async (args: UpdateBidArgs) => {
    await callContract("update_bid")(args);
  };

  const refundUnusedBids = async (args: RefundUnusedBidsArgs) => {
    await callContract("refund_unused_bids")(args);
  };

  const tokenizeOptions = async () => {
    await callContract("tokenize_options")();
  };

  const exerciseOptions = async () => {
    await callContract("exercise_options")();
  };

  const callContract = useCallback(
    (functionName: string) =>
      async (args?: PlaceBidArgs | UpdateBidArgs | RefundUnusedBidsArgs) => {
        if (!typedContract) return;
        let argsData;
        if (args) argsData = Object.values(args).map((value) => value);
        const callData = typedContract?.populate(
          functionName,
          argsData ? [...argsData] : undefined,
        );
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
    [typedContract, account],
  );

  return {
    placeBid,
    updateBid,
    refundUnusedBids,
    tokenizeOptions,
    exerciseOptions,
  };
};
export default useOptionRoundActions;
