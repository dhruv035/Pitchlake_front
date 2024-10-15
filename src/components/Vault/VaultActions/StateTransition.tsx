import { OptionRoundStateType, VaultActionsType, VaultStateType } from "@/lib/types";
import { Button } from "antd";
import buttons from "@/styles/Button.module.css";

const StateTransition = ({
  optionRoundState,
  vaultActions,
}: {
  optionRoundState: OptionRoundStateType;
  vaultActions: VaultActionsType;
}) => {
  return (
    <div>
      State Transitions
      {optionRoundState?.roundState==="Open" &&
      <Button
        style={{ flex: 1 }}
        className={[buttons.button, buttons.confirm].join(" ")}
        title="Start Auction"
        disabled={
          //!isDepositClickable || displayInsufficientBalance
          false
        }
        onClick={async () => {
          await vaultActions.startAuction();
        }}
      >
        Start Auction
      </Button>}
     { optionRoundState?.roundState==="Auctioning" &&
      <Button
        style={{ flex: 1 }}
        className={[buttons.button, buttons.confirm].join(" ")}
        title="endAuction"
        disabled={
          //!isDepositClickable || displayInsufficientBalance
          false
        }
        onClick={async () => {
          await vaultActions.endAuction();
        }}
      >
        End Auction
      </Button>}
      {optionRoundState?.roundState==="Settled" &&
        <Button
        style={{ flex: 1 }}
        className={[buttons.button, buttons.confirm].join(" ")}
        title="deposit"
        disabled={
          //!isDepositClickable || displayInsufficientBalance
          false
        }
        onClick={async () => {
          await vaultActions.settleOptionRound();
        }}
      >
        Settle Option Round
      </Button>}
    </div>
  );
};

export default StateTransition
