import { optionRoundABI } from "@/abi";
import { PlaceBidArgs, RefundableBidsArgs, RoundState, UpdateBidArgs } from "@/lib/types";
import { useAccount, useContract, useContractRead } from "@starknet-react/core";
import { useCallback, useMemo } from "react";
import { CairoCustomEnum, LibraryError } from "starknet";

const useOptionRound = (address: string | undefined) => {
  const contractData = useMemo(() => {
    return { abi: optionRoundABI, address };
  }, [address]);
  const { account } = useAccount();
  const typedContract = useContract({
    ...contractData,
  }).contract?.typedv2(optionRoundABI);

  //Read States

  const {data:clearingPrice} = useContractRead({
    ...contractData,
    functionName:"get_auction_clearing_price",
    args:[],
    watch:true,
  })
  const {data:optionsSold} = useContractRead({
    ...contractData,
    functionName:"total_options_sold",
    args:[],
    watch:true,
  })

  const {data:roundId} = useContractRead({
    ...contractData,
    functionName:"get_round_id",
    args:[],
    watch:true,
  })
  const {data: totalOptionsAvailable} = useContractRead({
    ...contractData,
    functionName:"get_total_options_available",
    args:[],
    watch:true,
  })
  const {data: roundState} = useContractRead({
    ...contractData,
    functionName:"get_state",
    args:[],
    watch:true,
  })

  const {data: capLevel} = useContractRead({
    ...contractData,
    functionName:"get_cap_level",
    args:[],
    watch:true,
  })
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
      capLevel,
      refundableBids,
      tokenizableOptions,
      biddingNonce,
      roundId,
      totalOptionsAvailable,
      roundState:roundState as CairoCustomEnum,
      clearingPrice,
      optionsSold,
    },
    placeBid,
    updateBid,
    refundUnusedBids,
    tokenizeOptions,
    exerciseOptions,
  };
};

export default useOptionRound;
