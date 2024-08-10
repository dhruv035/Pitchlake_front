import { Button } from "antd";
import buttons from "@/styles/Button.module.css";
import { VaultActionsType, VaultStateType } from "@/lib/types";

const StateTransition = ({
  vaultActions,
  vaultState,
}: {
  vaultActions: VaultActionsType;
  vaultState: VaultStateType;
}) => {
  return (
    <div>
      State Transitions
      <Button
        style={{ flex: 1 }}
        className={[buttons.button, buttons.confirm].join(" ")}
        title="deposit"
        disabled={
          //!isDepositClickable || displayInsufficientBalance
          false
        }
        onClick={async () => {
          await vaultActions.startAuction();
        }}
      >
        Start Auction
      </Button>
      <Button
        style={{ flex: 1 }}
        className={[buttons.button, buttons.confirm].join(" ")}
        title="deposit"
        disabled={
          //!isDepositClickable || displayInsufficientBalance
          false
        }
        onClick={async () => {
          await vaultActions.endAuction();
        }}
      >
        End Auction
      </Button>
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
      </Button>
    </div>
  );
};
export default StateTransition;
