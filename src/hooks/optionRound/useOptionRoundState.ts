import { optionRoundABI } from "@/abi";
import { OptionBuyerStateType, OptionRoundStateType } from "@/lib/types";
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
    deploymentDate,

    auctionStartDate,
    auctionEndDate,
    optionSettleDate,

    startingLiquidity,
    soldLiquidity,
    unsoldLiquidity,

    clearingPrice,
    optionsSold,
    roundId,
    availableOptions,
    roundState,
    capLevel,
    reservePrice,
    strikePrice,
    premiums,
  } = useContractReads({
    contractData,
    watch: true,
    states: [
      {
        functionName: "get_round_id",
        key: "roundId",
      },
      {
        functionName: "get_state",
        key: "roundState",
      },
      {
        functionName: "get_deployment_date",
        key: "deploymentDate",
      },
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
        functionName: "get_starting_liquidity",
        key: "startingLiquidity",
      },
      // get sold liquidity and unsold liquidity
      {
        functionName: "get_sold_liquidity",
        key: "soldLiquidity",
      },
      {
        functionName: "get_unsold_liquidity",
        key: "unsoldLiquidity",
      },
      {
        functionName: "get_reserve_price",
        key: "reservePrice",
      },
      {
        functionName: "get_strike_price",
        key: "strikePrice",
      },
      {
        functionName: "get_cap_level",
        key: "capLevel",
      },
      {
        functionName: "get_options_available",
        key: "availableOptions",
      },
      {
        functionName: "get_options_sold",
        key: "optionsSold",
      },
      {
        functionName: "get_clearing_price",
        key: "clearingPrice",
      },
      {
        functionName: "get_total_premium",
        key: "premiums",
      },
      {
        functionName: "get_settlement_price",
        key: "settlementPrice",
      },
      {
        functionName: "get_total_payout",
        key: "payoutPerOption",
      },
    ],
  });
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
        functionName: "get_account_bidding_nonce",
        args: [account?.address as string],
        key: "biddingNonce",
      },
      {
        functionName: "get_bid_tree_nonce",
        key: "treeNonce",
      },
      {
        functionName: "get_account_bids",
        args: [account?.address as string],
        key: "bids",
      },
      {
        functionName: "get_account_refundable_balance",
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
    optionRoundState: {
      address,
      roundId: roundId ? roundId.toString() : 0,
      capLevel: capLevel ? capLevel.toString() : 0,
      auctionStartDate: auctionStartDate?.toString(),
      auctionEndDate: auctionEndDate?.toString(),
      optionSettleDate: optionSettleDate?.toString(),
      startingLiquidity: 0, //Add startingLiquidity
      availableOptions: availableOptions ? availableOptions.toString() : 0,
      clearingPrice: clearingPrice ? clearingPrice.toString() : 0,
      settlementPrice: 0, //Add settlementPrice
      strikePrice: strikePrice ? strikePrice.toString() : 0,
      optionsSold: optionsSold ? optionsSold.toString() : 0,
      roundState: (roundState as CairoCustomEnum).activeVariant(),
      premiums: 0, //Add premiums
      queuedLiquidity: 0, //Add queuedLiquidity
      payoutPerOption: 0, //Add payoutPerOption
      vaultAddress: "", //Add vaultAddress
      reservePrice: reservePrice ? reservePrice.toString() : 0,
    } as OptionRoundStateType,
    optionBuyerState: {
      address: account?.address as string,
      roundId: roundId ? roundId.toString() : 0,
      tokenizableOptions: tokenizableOptions
        ? tokenizableOptions.toString()
        : 0,
      refundableBalance: refundableBids ? refundableBids.toString() : 0,
    } as OptionBuyerStateType,
  };
};

export default useOptionRoundState;
