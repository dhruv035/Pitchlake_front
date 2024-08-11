import { optionRoundABI } from "@/abi";
import { OptionRoundStateType } from "@/lib/types";
import useContractReads from "@/lib/useContractReads";
import { useAccount, useContract, useContractRead } from "@starknet-react/core";
import { useMemo } from "react";
import { CairoCustomEnum } from "starknet";

const useOptionRoundState = (address: string | undefined) => {
  const contractData = useMemo(() => {
    return { abi: optionRoundABI, address };
  }, [address]);
  const { account } = useAccount();
  //Read States

  const {
    auctionStartDate,
    auctionEndDate,
    optionSettleDate,
    clearingPrice,
    optionsSold,
    roundId,
    totalOptionsAvailable,
    roundState,
    capLevel,
    reservePrice,
    strikePrice,
  } = useContractReads({
    contractData,
    watch: true,
    states: [
      {
        functionName: "get_auction_start_date",
        key: "auctionStartDate",
      },
      {
        functionName: "get_auction_end_date",
        key: "auctionEndDate",
      },
      {
        functionName: "get_option_settlement_date",
        key: "optionSettleDate",
      },
      {
        functionName: "get_auction_clearing_price",
        key: "clearingPrice",
      },
      {
        functionName: "total_options_sold",
        key: "optionsSold",
      },
      {
        functionName: "get_round_id",
        key: "roundId",
      },
      {
        functionName: "get_total_options_available",
        key: "totalOptionsAvailable",
      },
      {
        functionName: "get_state",
        key: "roundState",
      },
      {
        functionName: "get_cap_level",
        key: "capLevel",
      },
      {
        functionName: "get_reserve_price",
        key: "reservePrice",
      },
      {
        functionName: "get_strike_price",
        key: "strikePrice",
      },
    ],
  }) as unknown as OptionRoundStateType;

  //Wallet States
  const {
    biddingNonce,
    bids,
    refundableBids,
    optionsBalance,
    tokenizableOptions,
  } = useContractReads({
    contractData,
    states: [
      {
        functionName: "get_bidding_nonce_for",
        args: [account?.address as string],
        key: "biddingNonce",
      },
      {
        functionName: "get_bids_for",
        args: [account?.address as string],
        key: "bids",
      },
      {
        functionName: "get_refundable_bids_for",
        args: [account?.address as string],
        key: "refundableBids",
      },
      {
        functionName: "get_total_options_balance_for",
        args: [account?.address as string],
        key: "optionsBalance",
      },
      {
        functionName: "get_tokenizable_options_for",
        args: [account?.address as string],
        key: "tokenizableOptions",
      },
    ],
  });

  //  const { data:  } = useMemo(
  //   () =>
  //     useContractRead({ ...contractData, functionName: "get_reserve_price" }),
  //   [typedContract]
  // );
  //Write Calls

  return {
    address,
    reservePrice: reservePrice ? reservePrice.toString() : 0,
    strikePrice: strikePrice ? strikePrice.toString() : 0,
    capLevel: capLevel ? capLevel.toString() : 0,
    refundableBids: refundableBids ? refundableBids.toString() : 0,
    tokenizableOptions: tokenizableOptions ? tokenizableOptions.toString() : 0,
    roundId: roundId ? roundId.toString() : 0,
    totalOptionsAvailable: totalOptionsAvailable
      ? totalOptionsAvailable.toString()
      : 0,
    roundState: roundState as CairoCustomEnum,
    clearingPrice: clearingPrice ? clearingPrice.toString() : 0,
    optionsSold: optionsSold ? optionsSold.toString() : 0,
    auctionStartDate: new Date(Number(auctionStartDate) * 1000),
    auctionEndDate: new Date(Number(auctionEndDate) * 1000),
    optionSettleDate: new Date(Number(optionSettleDate) * 1000),
  };
};

export default useOptionRoundState;
