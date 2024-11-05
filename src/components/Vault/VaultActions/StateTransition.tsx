import { useProtocolContext } from "@/context/ProtocolProvider";
import { useProvider, useAccount } from "@starknet-react/core";
import useLatestTimestamp from "@/hooks/chain/useLatestTimestamp";
import {
  LineChartDownIcon,
  LineChartUpIcon,
  BriefCaseIcon,
} from "@/components/Icons";
import { useEffect, useRef, useState } from "react";
import useFossil from "@/hooks/fossil/useFossil";
import useFossilStatus from "@/hooks/fossil/useFossilStatus";
import { Cog } from "lucide-react";
import { createJobId, createJobRequest } from "@/lib/utils";

const StateTransition = ({
  isPanelOpen,
  setModalState,
}: {
  isPanelOpen: boolean;
  setModalState: any;
}) => {
  const { vaultState, vaultActions, selectedRoundState } = useProtocolContext();
  const { provider } = useProvider();
  const { timestamp } = useLatestTimestamp(provider);
  const now = Number(timestamp);
  const { account } = useAccount();

  const jobId = createJobId(selectedRoundState);
  const { status, error, loading } = useFossilStatus(jobId);
  const { fossilCallback } = useFossil(vaultState?.fossilClientAddress);

  const roundStateRaw = selectedRoundState
    ? selectedRoundState.roundState.toString()
    : "Settled";

  const [statePreReq, setStatePreReq] = useState<any>(roundStateRaw);
  const getActionState = () => {
    if (
      roundStateRaw === "Open" ||
      roundStateRaw === "Auctioning" ||
      roundStateRaw === "Settled"
    )
      return roundStateRaw;

    if (!error && !status) return statePreReq;
    if (error || status.status == "Failed") return "FossilReady";

    if (status?.status === "Pending") {
      return "FossilPending";
    }
    if (status?.status === "Completed") return "Running";

    return roundStateRaw;
  };
  const roundState: any = getActionState();

  useEffect(() => {
    setStatePreReq(roundState);
  }, [roundState]);

  useEffect(() => {}, [selectedRoundState]);

  // No data
  if (!vaultState || !vaultActions || !selectedRoundState) {
    return null;
  }

  const canAuctionStart = () => {
    if (
      roundState === "Open" &&
      now >= Number(selectedRoundState.auctionStartDate)
    ) {
      return true;
    } else return false;
  };

  const canAuctionEnd = () => {
    if (
      roundState === "Auctioning" &&
      now >= Number(selectedRoundState.auctionEndDate)
    ) {
      return true;
    } else return false;
  };

  const canRoundSettle = () => {
    if (
      roundState === "Running" &&
      now >= Number(selectedRoundState.optionSettleDate)
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
      timestamp >= Number(selectedRoundState?.optionSettleDate)
    )
      return true;
    else return false;
  };

  const isButtonDisabled = () => {
    if (!account) return true;
    if (roundState === "Open") return !canAuctionStart();
    if (roundState === "Auctioning") return !canAuctionEnd();
    if (roundState === "Running") return !canRoundSettle();
    if (roundState === "FossilPending") return true;
    if (roundState === "FossilReady") return !canFossilRequest();
    return false;
  };

  const actions: {
    Open: string;
    Auctioning: string;
    FossilPending: string;
    FossilReady: string;
    Running: string;
  } = {
    Open: "Start Auction",
    Auctioning: "End Auction",
    FossilPending: "Fossil Pending...",
    FossilReady: "Request Fossil",
    Running: "Settle Round",
  };

  type State =
    | "Open"
    | "Auctioning"
    | "FossilPending"
    | "FossilReady"
    | "Running";

  const makeFossilCall = async () => {
    // Fossil request
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_FOSSIL_API_URL}/pricing_data`,
        createJobRequest(
          vaultState,
          selectedRoundState.optionSettleDate.toString(),
        ),
      );
    } catch (error) {
      console.log("Error sending Fossil request:", error);
    }

    return;
  };

  const setModalStateConditionally = () => {
    setModalState({
      show: true,
      action: actions[roundState as State],
      onConfirm: async () => {
        if (roundState === "Open") await vaultActions.startAuction();
        else if (roundState === "Auctioning") await vaultActions.endAuction();
        else if (roundState === "FossilReady") {
          makeFossilCall();
        } else if (roundState === "Running")
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

    if (roundState === "Open") {
      return <LineChartUpIcon classname="w-4 h-4 ml-2" stroke={stroke} />;
    } else if (roundState === "Auctioning") {
      return <LineChartDownIcon classname="w-4 h-4 ml-2" stroke={stroke} />;
    } else if (roundState === "FossilReady") {
      return <Cog className="w-4 h-4 ml-2" stroke={stroke} />;
    } else if (roundState === "FossilPending") {
      return;
    } else if (roundState === "Running") {
      return (
        <BriefCaseIcon
          classname="w-4 h-4 ml-2"
          fill="transparent"
          stroke={stroke}
        />
      );
    }
  };

  // Only the current round can transition states
  if (vaultState.currentRoundId !== selectedRoundState.roundId) {
    return null;
  }

  // For first round only
  // First round needs Fossil request before auction starts
  //if (vaultState.currentRoundId === 1) {
  //  if (selectedRoundState.roundState === "Open") {
  //    // if fossil job not already started

  //    // do we care if it is delayed
  //    return (
  //      <Button
  //        style={{ flex: 1 }}
  //        className={[buttons.button, buttons.confirm].join(" ")}
  //        title="Send Request to Fossil"
  //        disabled={false}
  //        onClick={async () => {
  //          console.log("Sending request to fossil...");
  //        }}
  //      >
  //        Request Fossil Data (TODO)
  //      </Button>
  //    );
  //  }
  //}

  if (roundState === "Settled") {
    return null;
  }

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
          <p>{actions[roundState as State]}</p>
          {getIcon()}
        </button>
      </div>
    </>
  );
};
export default StateTransition;
