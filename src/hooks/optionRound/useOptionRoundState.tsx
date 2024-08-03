import { optionRoundABI } from "@/abi";
import {
  OptionRoundState,
} from "@/lib/types";
import { useAccount, useContract, useContractRead } from "@starknet-react/core";
import { useMemo } from "react";
import { CairoCustomEnum } from "starknet";

const useOptionRoundState = (address: string | undefined) => {
  const contractData = useMemo(() => {
    return { abi: optionRoundABI, address };
  }, [address]);
  const { account } = useAccount();
  //Read States

  const { data: auctionStartDate } = useContractRead({
    ...contractData,
    functionName: "get_auction_start_date",
    args: [],
    watch: true,
  });

  const { data: auctionEndDate } = useContractRead({
    ...contractData,
    functionName: "get_auction_end_date",
    args: [],
    watch: true,
  });
  const { data: optionSettleDate } = useContractRead({
    ...contractData,
    functionName: "get_option_settlement_date",
    args: [],
    watch: true,
  });

  const { data: optionSettleTime } = useContractRead({
    ...contractData,
    functionName: "get_auction_clearing_price",
    args: [],
    watch: true,
  });

  const { data: clearingPrice } = useContractRead({
    ...contractData,
    functionName: "get_auction_clearing_price",
    args: [],
    watch: true,
  });
  const { data: optionsSold } = useContractRead({
    ...contractData,
    functionName: "total_options_sold",
    args: [],
    watch: true,
  });

  const { data: roundId } = useContractRead({
    ...contractData,
    functionName: "get_round_id",
    args: [],
    watch: true,
  });
  const { data: totalOptionsAvailable } = useContractRead({
    ...contractData,
    functionName: "get_total_options_available",
    args: [],
    watch: true,
  });
  const { data: roundState } = useContractRead({
    ...contractData,
    functionName: "get_state",
    args: [],
    watch: true,
  });

  const { data: capLevel } = useContractRead({
    ...contractData,
    functionName: "get_cap_level",
    args: [],
    watch: true,
  });
  const { data: reservePrice } = useContractRead({
    ...contractData,
    functionName: "get_reserve_price",
    watch: true,
    args: [],
  });

  const { data: strikePrice } = useContractRead({
    ...contractData,
    functionName: "get_strike_price",
    watch: true,
    args: [],
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

  return {
    reservePrice,
    strikePrice,
    capLevel,
    refundableBids,
    tokenizableOptions,
    roundId,
    totalOptionsAvailable,
    roundState: roundState as CairoCustomEnum,
    clearingPrice,
    optionsSold,
    auctionStartDate: new Date(Number(auctionStartDate) * 1000),
    auctionEndDate: new Date(Number(auctionEndDate) * 1000),
    optionSettleDate: new Date(Number(optionSettleDate) * 1000),
  } as OptionRoundState;
};

export default useOptionRoundState;
