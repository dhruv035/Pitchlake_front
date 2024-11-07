import { useProtocolContext } from "@/context/ProtocolProvider";
import { useProvider, useAccount } from "@starknet-react/core";
import useLatestTimestamp from "@/hooks/chain/useLatestTimestamp";
import {
  LineChartDownIcon,
  LineChartUpIcon,
  BriefCaseIcon,
} from "@/components/Icons";
import { Clock } from "lucide-react";
import { useMemo, useEffect, useRef, useState } from "react";
import useFossilStatus from "@/hooks/fossil/useFossilStatus";
import { Cog } from "lucide-react";
import { createJobId, createJobRequest } from "@/lib/utils";
import { makeFossilCall, makeFossilCallR1 } from "@/services/fossilRequest";
import { useTransactionContext } from "@/context/TransactionProvider";
import { num } from "starknet";

const StateTransition = ({
  isPanelOpen,
  setModalState,
}: {
  isPanelOpen: boolean;
  setModalState: any;
}) => {
  const { vaultState, vaultActions, selectedRound, selectedRoundState } =
    useProtocolContext();
  const { pendingTx, status: txStatus } = useTransactionContext();
  const { account } = useAccount();
  const { provider } = useProvider();
  const { timestamp: timestampRaw } = useLatestTimestamp(provider);
  const timestamp = timestampRaw ? timestampRaw : "0";
  const { status, error, loading } = useFossilStatus(
    createJobId(
      selectedRoundState?.optionSettleDate
        ? selectedRoundState.optionSettleDate.toString()
        : "",
    ),
  );
  const {
    status: statusR1,
    error: errorR1,
    loading: loadingR1,
  } = useFossilStatus(
    createJobId(
      vaultState?.deploymentDate ? vaultState.deploymentDate.toString() : "",
    ),
  );
  const [transactionComplete, setTransactionComplete] = useState(false);
  // to trigger btn disabled
  const [isFossilReqSent, setIsFossilReqSent] = useState<boolean>(false);
  const [isFossilReqSentR1, setIsFossilReqSentR1] = useState<boolean>(false);

  const roundState = useMemo(() => {
    if (!vaultState || !selectedRoundState || !selectedRound) return "Settled";

    const state = selectedRoundState.roundState.toString();

    // No Fossil required
    if (["Auctioning", "Settled"].includes(state)) return state;
    // Check if the round data has been set (for Settlement)
    else if (state === "Running") {
      // Hook not running
      if (!status && !error && !loading) return "FossilReady";

      // Request was just sent before the hoook refreshes
      if (isFossilReqSent || isFossilReqSentR1) return "FossilPending";

      // Request failed to finish (needs to be tried again)
      if (status?.status === "Failed") return "FossilReady";
      // Request failed to send
      if (error) return "FossilReady";
      // Request is pending
      if (status?.status === "Pending") return "FossilPending";
      // Request is complete
      if (status?.status === "Completed") return "Running";

      //  if (status?.status === "Failed" || error || status?.error) {
      //    setIsFossilReqSent(false);
      //    return "FossilReady";
      //  }
    }
    // Check if it's the first round data has been set
    else {
      if (selectedRound === 1) {
        // Pre-Auction Fossil Request for Round 1
        if (!statusR1 && !errorR1 && !loadingR1) return "FossilReadyR1";
        if (statusR1?.status === "Failed" || errorR1 || statusR1?.error)
          return "FossilReadyR1";
        if (statusR1?.status === "Pending") return "FossilPending";
        if (statusR1?.status === "Completed") return "Open";
      } else if (state === "Open") return state;
    }
  }, [selectedRoundState?.roundState, error, status, statusR1, errorR1]);

  // No data
  if (!vaultState || !vaultActions || !selectedRoundState) {
    return null;
  }

  const canAuctionStart = () => {
    if (
      roundState === "Open" &&
      num.toBigInt(timestamp) >=
        num.toBigInt(selectedRoundState.auctionStartDate)
    ) {
      return true;
    } else return false;
  };

  const canAuctionEnd = () => {
    if (
      roundState === "Auctioning" &&
      num.toBigInt(timestamp) >= num.toBigInt(selectedRoundState.auctionEndDate)
    ) {
      return true;
    } else return false;
  };

  const canRoundSettle = () => {
    if (!selectedRoundState) return false;
    if (
      roundState === "Running" &&
      num.toBigInt(timestamp) >=
        num.toBigInt(selectedRoundState.optionSettleDate)
    ) {
      return true;
    } else {
      return false;
    }
  };

  const canFossilRequest = () => {
    if (
      roundState === "FossilReady" &&
      status?.status !== "Completed" &&
      num.toBigInt(timestamp) >=
        num.toBigInt(selectedRoundState?.optionSettleDate)
    )
      return true;
    else return false;
  };

  const canFossilRequestR1 = () => {
    if (roundState === "FossilReadyR1" && status?.status !== "Completed")
      return true;
    else return false;
  };

  const isButtonDisabled = () => {
    if (!account) return true;
    if (pendingTx) return true;
    if (roundState === "Open") return !canAuctionStart();
    if (roundState === "Auctioning") return !canAuctionEnd();
    if (roundState === "Running") return !canRoundSettle();
    if (roundState === "FossilPending") return true;
    if (roundState === "FossilReady") return !canFossilRequest();
    if (roundState === "FossilReadyR1") return !canFossilRequestR1();
    return false;
  };

  const actions: {
    Open: string;
    Auctioning: string;
    FossilPending: string;
    FossilReady: string;
    FossilReadyR1: string;
    Running: string;
  } = {
    Open: "Start Auction",
    Auctioning: "End Auction",
    FossilPending: "Pending",
    FossilReady: "Request Fossil",
    FossilReadyR1: "Request Fossil (1)",
    Running: "Settle Round",
  };

  type State =
    | "Open"
    | "Auctioning"
    | "FossilPending"
    | "FossilReady"
    | "FossilReadyR1"
    | "Running";

  const setModalStateConditionally = () => {
    setModalState({
      show: true,
      action: actions[roundState as State],
      onConfirm: async () => {
        // Send Fossil request to set round 1's pricing data
        if (roundState === "FossilReadyR1") makeFossilCallR1(vaultState);
        // Send Fossil request to set the settlement/next round's pricing data
        else if (roundState === "FossilReady") {
          makeFossilCall(vaultState, selectedRoundState);
        }
        // Start the auction
        else if (roundState === "Open") await vaultActions.startAuction();
        // End the auction
        else if (roundState === "Auctioning") await vaultActions.endAuction();
        // Settle the round
        else if (roundState === "Running")
          await vaultActions.settleOptionRound();

        setModalState((prev: any) => ({
          ...prev,
          show: false,
        }));
      },
    });
  };

  const getIcon = () => {
    const stroke =
      !selectedRoundState || isButtonDisabled()
        ? "var(--greyscale)"
        : "var(--primary)";

    if (
      pendingTx ||
      roundState === "FossilPending" ||
      roundState === "FossilPendingR1"
    )
      return <Clock className="w-4 h-4 ml-2" />;

    if (roundState === "Open")
      return <LineChartUpIcon classname="w-4 h-4 ml-2" stroke={stroke} />;
    else if (roundState === "Auctioning")
      return <LineChartDownIcon classname="w-4 h-4 ml-2" stroke={stroke} />;
    else if (roundState === "FossilReady")
      return <Cog className="w-4 h-4 ml-2" stroke={stroke} />;
    else if (roundState === "Running")
      return (
        <BriefCaseIcon
          classname="w-4 h-4 ml-2"
          fill="transparent"
          stroke={stroke}
        />
      );
  };

  useEffect(() => {
    if (!pendingTx && !transactionComplete) {
      setTransactionComplete(true);
      // Delay setting transaction complete to allow state changes to finalize
      //const timer = setTimeout(() => setTransactionComplete(true), 1);
      //return () => clearTimeout(timer);
    }
  }, [pendingTx, txStatus]);

  // No action
  if (
    !transactionComplete ||
    roundState === "Settled" ||
    vaultState.currentRoundId !== selectedRoundState.roundId
  ) {
    return null;
  } else
    return (
      <>
        <div className="px-6">
          <button
            disabled={isButtonDisabled()}
            className={`${isPanelOpen ? "flex" : "hidden"} ${
              roundState === "Settled" ? "hidden" : ""
            } border border-greyscale-700 text-primary disabled:text-greyscale rounded-md mt-4 p-2 w-full justify-center items-center`}
            onClick={async () => {
              setModalStateConditionally();
            }}
          >
            <p>{pendingTx ? "Pending" : actions[roundState as State]}</p>
            {getIcon()}
          </button>
        </div>
      </>
    );
};
export default StateTransition;
