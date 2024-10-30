import {
  OptionRoundStateType,
  VaultActionsType,
  VaultStateType,
} from "@/lib/types";
import { Button } from "antd";
import buttons from "@/styles/Button.module.css";
import { useProtocolContext } from "@/context/ProtocolProvider";

const StateTransition = () => {
  const { vaultState, vaultActions, selectedRoundState } = useProtocolContext();

  // No data
  if (!vaultState || !vaultActions || !selectedRoundState) {
    return;
  }

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

  // Starting Auction
  if (selectedRoundState.roundState === "Open") {
    // Check now is >= auction start date

    // Check pricing data set (if round 1)

    return (
      <Button
        style={{ flex: 1 }}
        className={[buttons.button, buttons.confirm].join(" ")}
        title="Start Auction"
        disabled={false}
        onClick={async () => {
          await vaultActions.startAuction();
        }}
      >
        Start Auction
      </Button>
    );
  }

  // Ending Auction
  if (selectedRoundState.roundState === "Auctioning") {
    // check now is >= auction end date

    return (
      <Button
        style={{ flex: 1 }}
        className={[buttons.button, buttons.confirm].join(" ")}
        title="End Auction"
        disabled={false}
        onClick={async () => {
          await vaultActions.endAuction();
        }}
      >
        End Auction )
      </Button>
    );
  }

  // Settling Option Round

  // Step 1: Trigger Fossil Request (if not already done)

  // Step 2: Call settle round

  if (selectedRoundState.roundState === "Running") {
    // check now >= round end date

    // check fossil data was set

    return (
      <Button
        style={{ flex: 1 }}
        className={[buttons.button, buttons.confirm].join(" ")}
        title="Settle Round"
        disabled={
          //!isDepositClickable || displayInsufficientBalance
          false
        }
        onClick={async () => {
          await vaultActions.settleOptionRound();
        }}
      >
        Settle Round
      </Button>
    );
  }

  return (
    <div>
      State Transitions
      {selectedRoundState?.roundState === "Open" && (
        <Button
          style={{ flex: 1 }}
          className={[buttons.button, buttons.confirm].join(" ")}
          title="Start Auction"
          disabled={false}
          onClick={async () => {
            await vaultActions.startAuction();
          }}
        >
          Start Auction
        </Button>
      )}
      {selectedRoundState?.roundState === "Auctioning" && (
        <Button
          style={{ flex: 1 }}
          className={[buttons.button, buttons.confirm].join(" ")}
          title="End Auction"
          disabled={false}
          onClick={async () => {
            await vaultActions.endAuction();
          }}
        >
          End Auction
        </Button>
      )}
      {selectedRoundState?.roundState === "Settled" && (
        <Button
          style={{ flex: 1 }}
          className={[buttons.button, buttons.confirm].join(" ")}
          title="Settle Round"
          disabled={false}
          onClick={async () => {
            await vaultActions.settleOptionRound();
          }}
        >
          Settle Option Round
        </Button>
      )}
    </div>
  );
};

export default StateTransition;
