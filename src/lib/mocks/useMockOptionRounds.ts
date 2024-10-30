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
const useMockOptionRounds = (selectedRound: number) => {
  const { address } = useAccount();
  const date = Date.now();
  console.log("HOOK DATE", date);
  const [rounds, setRounds] = useState<OptionRoundStateType[]>(
    // Initial mock data for option round states
    [
      {
        roundId: 0,
        clearingPrice: "0",
        strikePrice: "10000000000",
        address: "0x1",
        capLevel: "2480",
        startingLiquidity: "",
        availableOptions: "",
        settlementPrice: "",
        optionsSold: "",
        roundState: "Open",
        premiums: "",
        payoutPerOption: "",
        vaultAddress: "",
        reservePrice: "2000000000",
        auctionStartDate: date + 200000,
        auctionEndDate: date + 400000,
        optionSettleDate: date + 600000,
        deploymentDate: "",
        soldLiquidity: "",
        unsoldLiquidity: "",
        optionSold: "",
        totalPayout: "",
        treeNonce: "",
        performanceLP: 0,
        performanceOB: 0,
        // Add other fields as necessary
      },
    ],
    // Add more mock states as needed
  );

  const [buyerStates, setBuyerStates] = useState<OptionBuyerStateType[]>([
    {
      address: address ?? "0x1",
      roundId: 0,
      tokenizableOptions: 11,
      refundableBalance: 24,
      bids: [],
    },
  ]);

  // Function to update a specific field in the option round state

  // Function to update a specific field in the OptionBuyerState
  const placeBid = async (placeBidArgs: PlaceBidArgs) => {
    setBuyerStates((prevState) => {
      const newState = prevState;
      const newBid: Bid = {
        bidId: "3",
        address: address ?? "",
        roundId: selectedRound,

        treeNonce: "2",
        amount: placeBidArgs.amount,
        price: placeBidArgs.price,
      };
      newState[selectedRound].bids.push();
      return newState;
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
    rounds,
    setRounds,
    buyerStates,
    setBuyerStates,
    roundActions, // Expose the function for updating option round fields
  };
};

export default useMockOptionRounds;
