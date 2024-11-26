import { useMemo, useRef, useEffect } from "react";
import { OptionRoundStateType } from "@/lib/types";
import { StatusData } from "@/hooks/fossil/useFossilStatus";

const getRoundState = ({
  selectedRoundState,
  fossilStatus,
  fossilError,
  isPendingTx,
  isAwaitingRoundStateUpdate,
}: {
  selectedRoundState: OptionRoundStateType | undefined;
  fossilStatus: StatusData | null;
  fossilError: string | null;
  isPendingTx: boolean;
  isAwaitingRoundStateUpdate: boolean;
}): string => {
  if (
    isPendingTx ||
    isAwaitingRoundStateUpdate ||
    fossilStatus?.status === "Pending"
  )
    return "Pending";

  if (!selectedRoundState) return "Settled";

  const rawState = selectedRoundState.roundState.toString();
  if (
    rawState === "Open" ||
    rawState === "Auctioning" ||
    rawState === "Settled"
  )
    return rawState;

  if (rawState === "Running") {
    if (fossilStatus?.status === "Completed") return rawState;
    if (
      fossilError ||
      fossilStatus === null ||
      fossilStatus.status === "Failed"
    )
      return "FossilReady";
  }

  return "Settled";
};

export const useRoundState = ({
  selectedRoundState,
  fossilStatus,
  fossilError,
  pendingTx,
  isAwaitingRoundStateUpdate,
}: {
  selectedRoundState: OptionRoundStateType | undefined;
  fossilStatus: StatusData | null;
  fossilError: string | null;
  pendingTx: string | undefined;
  isAwaitingRoundStateUpdate: boolean;
}) => {
  const roundState = useMemo(() => {
    return getRoundState({
      selectedRoundState,
      fossilStatus,
      fossilError,
      isPendingTx: pendingTx ? true : false,
      isAwaitingRoundStateUpdate,
    });
  }, [
    selectedRoundState,
    fossilStatus,
    fossilError,
    pendingTx,
    isAwaitingRoundStateUpdate,
  ]);

  // Previous roundState to detect changes
  const prevRoundStateRef = useRef(roundState);

  useEffect(() => {
    prevRoundStateRef.current = roundState;
  }, [roundState]);

  return { roundState, prevRoundState: prevRoundStateRef.current };
};
