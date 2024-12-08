import { useMemo } from "react";
import { num } from "starknet";
import { OptionRoundStateType } from "@/lib/types";

export const useRoundPermissions = (
  timestamp: string,
  selectedRoundState: OptionRoundStateType | undefined,
  FOSSIL_DELAY: number,
) => {
  const canAuctionStart = useMemo(() => {
    console.log("TIMESTAMPS",timestamp,selectedRoundState?.auctionStartDate )
    return (
      num.toBigInt(timestamp) >= Number(selectedRoundState?.auctionStartDate)
    );
  }, [timestamp, selectedRoundState]);

  const canAuctionEnd = useMemo(() => {
    return (
      num.toBigInt(timestamp) >= Number(selectedRoundState?.auctionEndDate)
    );
  }, [timestamp, selectedRoundState]);

  const canRoundSettle = useMemo(() => {
    return (
      num.toBigInt(timestamp) >=
      Number(selectedRoundState?.optionSettleDate) + FOSSIL_DELAY
    );
  }, [timestamp, selectedRoundState]);

  const canSendFossilRequest = useMemo(() => {
    // account for fossil delay
    return (
      num.toBigInt(timestamp) >=
      Number(selectedRoundState?.optionSettleDate) + FOSSIL_DELAY
    );
  }, [timestamp, selectedRoundState]);

  return {
    canAuctionStart,
    canAuctionEnd,
    canRoundSettle,
    canSendFossilRequest,
  };
};
