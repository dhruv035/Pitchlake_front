import { optionRoundABI } from "@/abi";
import { PlaceBidArgs, RefundableBidsArgs, UpdateBidArgs } from "@/lib/types";
import { useAccount, useContract, useContractRead } from "@starknet-react/core";
import { useCallback, useMemo } from "react";
import { LibraryError } from "starknet";

const useOptionRound = (address: string | undefined) => {
  const contractData = useMemo(() => {
    return { abi: optionRoundABI, address };
  }, [address]);
  const { account } = useAccount();
  const typedContract = useContract({
    ...contractData,
  }).contract?.typedv2(optionRoundABI);

  //Read States
  const { data: reservePrice } = useContractRead({
    ...contractData,
    functionName: "get_reserve_price",
    watch: true,
    args:[],
  });

  const { data: strikePrice } = useContractRead({
    ...contractData,
    functionName: "get_strike_price",
    watch: true,
    args:[],
  });

  const biddingNonce = useContractRead({
    ...contractData,
    functionName: "get_bidding_nonce_for",
    args: [account?.address as string],
    watch: true,
  });

  const { data: bids } = useContractRead({
    ...contractData,
    functionName: "get_bids_for",
    args: [account?.address as string],
    watch: true,
  });
  const { data: refundableBids } = useContractRead({
    ...contractData,
    functionName: "get_refundable_bids_for",
    args: [account?.address as string],
    watch: true,
  });

  const { data: optionsBalance } = useContractRead({
    ...contractData,
    functionName: "get_total_options_balance_for",
    args: [account?.address as string],
    watch: true,
  });
  const { data: tokenizableOptions } = useContractRead({
    ...contractData,
    functionName: "get_tokenizable_options_for",
    args: [account?.address as string],
    watch: true,
  });
  //  const { data:  } = useMemo(
  //   () =>
  //     useContractRead({ ...contractData, functionName: "get_reserve_price" }),
  //   [typedContract]
  // );
  //Write Calls
  const placeBid = useCallback(
    async ({ amount, price }: PlaceBidArgs) => {
      if (!typedContract) return;
      try {
        const res = await typedContract.place_bid(amount, price);
        //process res.transaction hash
      } catch (err) {
        const error = err as LibraryError;
        //Notify Error error.name and error.msg
      }
    },
    [typedContract]
  );

  const updateBid = useCallback(
    async ({ bidId, amount, price }: UpdateBidArgs) => {
      if (!typedContract) return;
      try {
        const res = await typedContract.update_bid(bidId, amount, price);
        //process res.transaction hash
      } catch (err) {
        console.log(err);
      }
    },
    [typedContract]
  );

  const refundUnusedBids = useCallback(
    async ({ optionBuyer }: RefundableBidsArgs) => {
      if (!typedContract) return;
      try {
        const res = await typedContract.refund_unused_bids(optionBuyer);
        //process res.transaction hash
      } catch (err) {
        const error = err as LibraryError;
        //Notify Error error.name and error.msg
      }
    },
    [typedContract]
  );

  const tokenizeOptions = useCallback(async () => {
    if (!typedContract) return;
    try {
      const data = await typedContract.tokenize_options();
      //process res.transaction hash
    } catch (err) {
      //Notify Error error.name and error.msg
    }
  }, [typedContract]);

  const exerciseOptions = useCallback(async () => {
    if (!typedContract) return;

    try {
      const data = await typedContract.exercise_options();
      //process res.transaction hash
    } catch (err) {
      //Notify Error error.name and error.msg
    }
  }, [typedContract]);

  return {
    state: {
      reservePrice,
      strikePrice,
      refundableBids,
      tokenizableOptions,
      biddingNonce,
    },
    placeBid,
    updateBid,
    refundUnusedBids,
    tokenizeOptions,
    exerciseOptions,
  };
};

export default useOptionRound;
