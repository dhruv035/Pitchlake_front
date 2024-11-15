import { useProtocolContext } from "@/context/ProtocolProvider";
import { useProvider, useAccount } from "@starknet-react/core";
import useLatestTimestamp from "@/hooks/chain/useLatestTimestamp";
import {
  LineChartDownIcon,
  LineChartUpIcon,
  BriefCaseIcon,
} from "@/components/Icons";
import { Clock, Cog } from "lucide-react";
import { useMemo, useState, useEffect, useRef } from "react";
import useFossilStatus from "@/hooks/fossil/useFossilStatus";
import { getDurationForRound, getTargetTimestampForRound } from "@/lib/utils";
import { makeFossilCall } from "@/services/fossilRequest";
import { useTransactionContext } from "@/context/TransactionProvider";
import { num } from "starknet";
import { StatusData } from "@/hooks/fossil/useFossilStatus";
import { VaultStateType, OptionRoundStateType } from "@/lib/types";

const getRoundState = ({
  vaultState,
  selectedRoundState,
  fossilStatus,
  fossilError,
  pendingTx,
}: {
  vaultState: VaultStateType | undefined;
  selectedRoundState: OptionRoundStateType | undefined;
  fossilStatus: StatusData | null;
  fossilError: string | null;
  pendingTx: any;
}) => {
  //  console.log({ isAwaitingRoundStateUpdate });
  if (!vaultState || !selectedRoundState) return "Settled";

  const state = selectedRoundState.roundState.toString();
  if (state === "Settled" || state === "Auctioning") return state;

  const isFossilCompleted = fossilStatus?.status === "Completed";
  const isFossilPending = fossilStatus?.status === "Pending";
  const isFossilFailed = fossilStatus?.status === "Failed";
  const isFossilReqFailed = fossilError !== null || fossilStatus === null;
  // console.log({ isTransactionPending, isAwaitingRoundStateUpdate });

  //if (pendingTx) return "Pending";
  //if (isTransactionPending || isAwaitingRoundStateUpdate) return "Pending";

  //if (prevRoundStateRef.current === roundState) return "Pending";

  if (
    state === "Running" ||
    (state === "Open" && selectedRoundState.roundId === "1")
  ) {
    if (isFossilPending) return "Pending";
    if (isFossilCompleted) return "Running";
    if (isFossilFailed || !isFossilCompleted || isFossilReqFailed)
      return "FossilReady";
  }

  return state;
};

const StateTransition = ({
  isPanelOpen,
  setModalState,
}: {
  isPanelOpen: boolean;
  setModalState: any;
}) => {
  const { vaultState, vaultActions, selectedRoundState } = useProtocolContext();
  const { pendingTx, status } = useTransactionContext();
  const { account } = useAccount();
  const { provider } = useProvider();
  const { timestamp: timestampRaw } = useLatestTimestamp(provider);
  const timestamp = timestampRaw ? timestampRaw : "0";

  const { status: fossilStatus, error: fossilError } = useFossilStatus();

  // State to track if we're awaiting round state update
  const [isAwaitingRoundStateUpdate, setIsAwaitingRoundStateUpdate] =
    useState(false);

  const roundState = useMemo(() => {
    return getRoundState({
      vaultState,
      selectedRoundState,
      fossilStatus,
      fossilError,
      pendingTx,
    });
  }, [
    vaultState,
    selectedRoundState,
    fossilStatus,
    fossilError,
    //pendingTx,
    status,
  ]);

  // Previous roundState to detect changes
  const prevRoundStateRef = useRef(roundState);

  useEffect(() => {
    // roundState has changed, reset the awaiting state
    if (prevRoundStateRef.current !== roundState)
      setIsAwaitingRoundStateUpdate(false);

    prevRoundStateRef.current = roundState;
  }, [selectedRoundState?.roundState, roundState]);

  const canAuctionStart = useMemo(() => {
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
      num.toBigInt(timestamp) >= Number(selectedRoundState?.optionSettleDate)
    );
  }, [timestamp, selectedRoundState]);

  const canFossilRequest = useMemo(() => {
    return (
      num.toBigInt(timestamp) >= Number(selectedRoundState?.optionSettleDate)
    );
  }, [timestamp, selectedRoundState]);

  const isDisabled = useMemo(() => {
    if (!account) return true;
    if (pendingTx) return true;
    if (prevRoundStateRef.current !== roundState) return true;
    if (roundState === "Pending") return true;
    if (roundState === "FossilReady") return !canFossilRequest;
    if (roundState === "Open") return !canAuctionStart;
    if (roundState === "Auctioning") return !canAuctionEnd;
    if (roundState === "Running") return !canRoundSettle;
    return false;
  }, [
    account,
    //pendingTx,
    status,
    isAwaitingRoundStateUpdate,
    selectedRoundState,
    roundState,
    canFossilRequest,
    canAuctionStart,
    canAuctionEnd,
    canRoundSettle,
  ]);

  const actions: Record<string, string> = useMemo(
    () => ({
      Open: "Start Auction",
      Auctioning: "End Auction",
      FossilReady: "Request Fossil",
      Running: "Settle Round",
      Pending: "Pending",
    }),
    [],
  );

  const handleAction = async () => {
    if (roundState === "FossilReady") {
      await makeFossilCall({
        targetTimestamp: getTargetTimestampForRound(selectedRoundState),
        roundDuration: getDurationForRound(selectedRoundState),
        clientAddress: vaultState?.fossilClientAddress,
        vaultAddress: vaultState?.address,
      });
    } else if (roundState === "Open") {
      await vaultActions.startAuction();
    } else if (roundState === "Auctioning") {
      await vaultActions.endAuction();
    } else if (roundState === "Running") {
      await vaultActions.settleOptionRound();
    }

    setModalState((prev: any) => ({
      ...prev,
      show: false,
    }));
  };

  const getIcon = () => {
    const stroke = isDisabled ? "var(--greyscale)" : "var(--primary)";

    if (roundState === "Pending") return <Clock className="w-4 h-4 ml-2" />;
    if (roundState === "Open")
      return <LineChartUpIcon classname="w-4 h-4 ml-2" stroke={stroke} />;
    if (roundState === "Auctioning")
      return <LineChartDownIcon classname="w-4 h-4 ml-2" stroke={stroke} />;
    if (roundState === "FossilReady")
      return <Cog className="w-4 h-4 ml-2" stroke={stroke} />;
    if (roundState === "Running")
      return (
        <BriefCaseIcon
          classname="w-4 h-4 ml-2"
          fill="transparent"
          stroke={stroke}
        />
      );
  };

  // Early returns for certain conditions
  if (!vaultState?.currentRoundId || !selectedRoundState || !vaultActions)
    return null;

  if (
    roundState === "Settled" ||
    vaultState.currentRoundId !== selectedRoundState.roundId
  ) {
    return null;
  }

  return (
    <div
      className={`${
        isPanelOpen && roundState !== "Settled"
          ? "border border-transparent border-t-[#262626]"
          : ""
      } flex flex-col w-full mx-auto mt-auto mb-4`}
    >
      <div className="px-6">
        <button
          disabled={isDisabled}
          className={`${isPanelOpen ? "flex" : "hidden"} ${
            roundState === "Settled" ? "hidden" : ""
          } border border-greyscale-700 text-primary disabled:text-greyscale rounded-md mt-4 p-2 w-full justify-center items-center`}
          onClick={() => {
            setModalState({
              show: true,
              action: actions[roundState],
              onConfirm: handleAction,
            });
          }}
        >
          <p>
            {prevRoundStateRef.current !== roundState
              ? "Pending"
              : actions[roundState]}
          </p>
          {getIcon()}
        </button>
      </div>
    </div>
  );
};

export default StateTransition;
