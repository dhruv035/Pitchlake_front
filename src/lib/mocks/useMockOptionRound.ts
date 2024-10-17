import { useState } from "react";
import {
  OptionBuyerStateType,
  OptionRoundActionsType,
  OptionRoundStateType,
  PlaceBidArgs,
  RefundBidsArgs,
  UpdateBidArgs,
} from "@/lib/types";
import { Bid } from "@/lib/types";
import { useAccount } from "@starknet-react/core";
const useMockOptionRound = (roundId: number) => {
  const { address } = useAccount();
  const [optionRoundState, setOptionRoundState] =
    useState<OptionRoundStateType>(
      // Initial mock data for option round states
      {
        roundId: roundId,
        clearingPrice: "0",
        strikePrice: "0",
        address: "0x1",
        capLevel: "24800",
        startingLiquidity: "",
        availableOptions: "",
        settlementPrice: "",
        optionsSold: "",
        roundState: "OPEN",
        premiums: "",
        queuedLiquidity: "",
        payoutPerOption: "",
        vaultAddress: "",
        reservePrice: "",
        auctionStartDate: "",
        auctionEndDate: "",
        optionSettleDate: "",
        // Add other fields as necessary
      }
      // Add more mock states as needed
    );

  const [optionBuyerState, setOptionBuyerState] =
    useState<OptionBuyerStateType>({
      address: "",
      roundId: "",
      tokenizableOptions: "",
      refundableBalance: "",
      bids: [],
    });

  // Function to update a specific field in the option round state

  // Function to update a specific field in the OptionBuyerState
  const placeBid = async (placeBidArgs: PlaceBidArgs) => {
    setOptionBuyerState((prevState) => {
      const newBid: Bid = {
        bidId: "3",
        address: address ?? "",
        roundId: optionRoundState.roundId,

        treeNonce: "2",
        amount: placeBidArgs.amount,
        price: placeBidArgs.price,
      };
      return {
        ...prevState,
        bids: [...prevState.bids, newBid.bidId],
      };
    });
  };

  const refundUnusedBids = async (refundBidsArgs: RefundBidsArgs) => {
    await new Promise((resolve) => setTimeout(resolve, 2000));
  };

  const updateBid = async (updateBidArgs: UpdateBidArgs) => {
    await new Promise((resolve) => setTimeout(resolve, 2000));
  };
  const tokenizeOptions = async () => {
    await new Promise((resolve) => setTimeout(resolve, 2000));
  };
  const exerciseOptions = async () => {
    await new Promise((resolve) => setTimeout(resolve, 2000));
  };

  const roundActions: OptionRoundActionsType = {
    placeBid,
    refundUnusedBids,
    updateBid,
    tokenizeOptions,
    exerciseOptions,
  };
  return {
    optionBuyerState,
    optionRoundState,
    roundActions,
    setOptionRoundState, // Expose the function for updating option round fields
  };
};

export default useMockOptionRound;
