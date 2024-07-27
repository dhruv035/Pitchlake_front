import { optionRoundABI } from "@/abi";
import { PlaceBidArgs, RefundableBidsArgs, UpdateBidArgs } from "@/lib/types";
import { useContract } from "@starknet-react/core";
import { LibraryError } from "starknet";

const useOptionRound = ({ address }: { address: string }) => {
  const typedContract = useContract({
    abi: optionRoundABI,
    address,
  }).contract?.typedv2(optionRoundABI);


  const placeBid = async ({ amount, price }: PlaceBidArgs) => {
    if (!typedContract) return;
    try {
      const res = await typedContract.place_bid(amount, price);
      //process res.transaction hash
    } catch (err) {
      const error = err as LibraryError;
      //Notify Error error.name and error.msg
    }
  };

  const updateBid = async ({ bidId, amount, price }: UpdateBidArgs) => {
    if (!typedContract) return;
    try {
      const res = await typedContract.update_bid(bidId, amount, price);
      //process res.transaction hash
    } catch (err) {
      console.log(err);
    }
  };

  const refundUnusedBids = async ({ optionBuyer }: RefundableBidsArgs) => {
    if (!typedContract) return;
    try {
      const res = await typedContract.refund_unused_bids(optionBuyer);
      //process res.transaction hash
    } catch (err) {
      const error = err as LibraryError;
      //Notify Error error.name and error.msg
    }
  };

  const tokenizeOptions = async () => {
    
    if (!typedContract) return;
    try {
      const data = await typedContract.tokenize_options();
      //process res.transaction hash

    } catch (err) {
      //Notify Error error.name and error.msg
    }
  };

  const exerciseOptions = async () => {
    if (!typedContract) return;

    try {
      const data = await typedContract.exercise_options();
      //process res.transaction hash
    } catch (err) {
      //Notify Error error.name and error.msg
    }
  };

  

  return {
    placeBid,updateBid,refundUnusedBids,tokenizeOptions,exerciseOptions
  }
};

export default useOptionRound;