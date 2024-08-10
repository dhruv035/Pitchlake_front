import {
  OptionRoundActionsType,
  OptionRoundStateType,
  VaultStateType,
} from "@/lib/types";
import classes from "./OptionRound.module.css"
import ExerciseOptions from "./OptionRoundActions/ExerciseOptions";
import MintOptions from "./OptionRoundActions/MintOptions";
import PlaceBid from "./OptionRoundActions/PlaceBid";
import RefundBids from "./OptionRoundActions/RefundBids";
import UpdateBid from "./OptionRoundActions/UpdateBid";

export const OptionRound = ({
  vaultState,
  roundActions,
  roundState,
}: {
  vaultState: VaultStateType;
  roundActions: OptionRoundActionsType;
  roundState: OptionRoundStateType;
}) => {
  return (
    <div className={classes.container}>
        <div>
      <div>Round Id {roundState?.roundId?.toString()}</div>
      <div>
        <PlaceBid
          vaultState={vaultState}
          placeBid={roundActions.placeBid}
          optionRoundState={roundState}
        />
        <UpdateBid
          vaultState={vaultState}
          updateBid={roundActions.updateBid}
          optionRoundState={roundState}
        />
        <RefundBids
          vaultState={vaultState}
          refundBids={roundActions.refundUnusedBids}
          optionRoundState={roundState}
        />
        <MintOptions
          vaultState={vaultState}
          mintOptions={roundActions.tokenizeOptions}
          optionRoundState={roundState}
        />
        <ExerciseOptions
          vaultState={vaultState}
          exerciseOptions={roundActions.exerciseOptions}
          optionRoundState={roundState}
        />
      </div>
      </div>
    </div>
  );
};

export default OptionRound