import { useProtocolContext } from "@/context/ProtocolProvider";
import { useProvider } from "@starknet-react/core";
import useLatestTimestamp from "@/hooks/chain/useLatestTimestamp";
import {
  LineChartDownIcon,
  LineChartUpIcon,
  BriefCaseIcon,
} from "@/components/Icons";
import { useEffect } from "react";

const StateTransition = ({
  isPanelOpen,
  setModalState,
}: {
  isPanelOpen: boolean;
  setModalState: any;
}) => {
  const { vaultState, vaultActions, selectedRoundState } = useProtocolContext();
  // No data
  if (!vaultState || !vaultActions || !selectedRoundState) {
    return;
  }
  const { provider } = useProvider();
  const { timestamp } = useLatestTimestamp(provider);
  const now = Number(timestamp);

  const roundState = selectedRoundState.roundState;

  const canAuctionStart = () => {
    if (
      roundState === "Open" &&
      now > Number(selectedRoundState.auctionStartDate)
    ) {
      return true;
    } else return false;
  };

  const canAuctionEnd = () => {
    if (
      roundState === "Auctioning" &&
      now > Number(selectedRoundState.auctionEndDate)
    ) {
      return true;
    } else return false;
  };

  const canRoundSettle = () => {
    if (
      roundState === "Running" &&
      now > Number(selectedRoundState.optionSettleDate)
    ) {
      return true;
    } else {
      return false;
    }
  };

  const isButtonDisabled = () => {
    if (roundState === "Open") {
      return !canAuctionStart();
    } else if (roundState === "Auctioning") {
      return !canAuctionEnd();
    } else if (roundState === "Running") {
      return !canRoundSettle();
    } else return false;
  };

  const actions: { Open: string; Auctioning: string; Running: string } = {
    Open: "Start Auction",
    Auctioning: "End Auction",
    Running: "Settle Round",
  };

  type State = "Open" | "Auctioning" | "Running";

  const setModalStateConditionally = () => {
    const state = roundState;
    setModalState({
      show: true,
      action: actions[state as State],
      onConfirm: async () => {
        if (state == "Open") {
          await vaultActions.startAuction();
        } else if (state == "Auctioning") {
          await vaultActions.endAuction();
        } else if (state == "Running") {
          await vaultActions.settleOptionRound();
        }

        setModalState((prev: any) => ({
          ...prev,
          show: false,
        }));
      },
    });
  };

  const getIcon = () => {
    const state = selectedRoundState?.roundState;
    const stroke =
      !selectedRoundState || isButtonDisabled()
        ? "var(--greyscale)"
        : "var(--primary)";

    if (state === "Open") {
      return <LineChartUpIcon classname="w-4 h-4 ml-2" stroke={stroke} />;
    } else if (state === "Auctioning") {
      return <LineChartDownIcon classname="w-4 h-4 ml-2" stroke={stroke} />;
    } else if (state === "Running") {
      return <BriefCaseIcon classname="w-4 h-4 ml-2" stroke={stroke} />;
    }
  };

  useEffect(() => {}, [selectedRoundState]);

  // Only the current round can transition states
  if (vaultState.currentRoundId !== selectedRoundState.roundId) {
    return;
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
    return;
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
            //                break;
          }}
        >
          <p>{actions[roundState as State]}</p>
          {getIcon()}
        </button>
      </div>
    </>
  );

  // Starting Auction
  //  if (selectedRoundState.roundState === "Open") {
  //    // Check now is >= auction start date
  //
  //    // Check pricing data set (if round 1)
  //
  //    return (
  //      <Button
  //        style={{ flex: 1 }}
  //        className={[buttons.button, buttons.confirm].join(" ")}
  //        title="Start Auction"
  //        disabled={false}
  //        onClick={async () => {
  //          await vaultActions.startAuction();
  //        }}
  //      >
  //        Start Auction
  //      </Button>
  //    );
  //  }
  //
  //  // Ending Auction
  //  if (selectedRoundState.roundState === "Auctioning") {
  //    // check now is >= auction end date
  ///
  //    return (
  //      <Button
  //        style={{ flex: 1 }}
  //        className={[buttons.button, buttons.confirm].join(" ")}
  //        title="End Auction"
  //        disabled={false}
  //        onClick={async () => {
  //          await vaultActions.endAuction();
  //        }}
  //      >
  //        End Auction )
  //      </Button>
  //    );
  //  }
  //
  //  // Settling Option Round
  //
  //  // Step 1: Trigger Fossil Request (if not already done)
  //
  //  // Step 2: Call settle round
  //
  //  if (selectedRoundState.roundState === "Running") {
  //    // check now >= round end date
  //
  //    // check fossil data was set
  ///
  //    return (
  //      <Button
  //        style={{ flex: 1 }}
  //        className={[buttons.button, buttons.confirm].join(" ")}
  //        title="Settle Round"
  //        disabled={
  //          //!isDepositClickable || displayInsufficientBalance
  //          false
  //        }
  //        onClick={async () => {
  //          await vaultActions.settleOptionRound();
  //        }}
  //      >
  //        Settle Round
  //      </Button>
  //    );
  //  }
  //
  //  return (
  //    <div>
  //      State Transitions
  //      {selectedRoundState?.roundState === "Open" && (
  //        <Button
  //          style={{ flex: 1 }}
  //          className={[buttons.button, buttons.confirm].join(" ")}
  //          title="Start Auction"
  //          disabled={false}
  //          onClick={async () => {
  //            await vaultActions.startAuction();
  //          }}
  //        >
  //          Start Auction
  //        </Button>
  //      )}
  //      {selectedRoundState?.roundState === "Auctioning" && (
  //        <Button
  //          style={{ flex: 1 }}
  //          className={[buttons.button, buttons.confirm].join(" ")}
  //          title="End Auction"
  //          disabled={false}
  //          onClick={async () => {
  //            await vaultActions.endAuction();
  //          }}
  //        >
  //          End Auction
  //        </Button>
  //      )}
  //      {selectedRoundState?.roundState === "Settled" && (
  //        <Button
  //          style={{ flex: 1 }}
  //          className={[buttons.button, buttons.confirm].join(" ")}
  //          title="Settle Round"
  //          disabled={false}
  //          onClick={async () => {
  //            await vaultActions.settleOptionRound();
  //          }}
  //        >
  //          Settle Option Round
  //        </Button>
  //      )}
  //    </div>
  //  );
};
//
export default StateTransition;
