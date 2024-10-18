import React, { useState } from "react";
import {
  LiquidityProviderStateType,
  VaultStateType,
  WithdrawArgs,
  WithdrawSubTabs,
} from "@/lib/types";
import ButtonTabs from "../../../ButtonTabs";
import WithdrawLiquidity from "@/components/Vault/VaultActions/Tabs/Provider/Withdraw/WithdrawLiquidity";
import QueueWithdrawal from "@/components/Vault/VaultActions/Tabs/Provider/Withdraw/WithdrawQueue";
import WithdrawStash from "@/components/Vault/VaultActions/Tabs/Provider/Withdraw/WithdrawCollect";

interface WithdrawProps {
  vaultState: VaultStateType;
  lpState: LiquidityProviderStateType;
  withdraw: (withdrawArgs: WithdrawArgs) => Promise<void>;
  showConfirmation: (
    modalHeader: string,
    action: string,
    onConfirm: () => Promise<void>,
  ) => void;
}

const Withdraw: React.FC<WithdrawProps> = ({
  vaultState,
  lpState,
  showConfirmation,
  withdraw,
  //queueWithdrawal,
  //withdrawStash,
}) => {
  const [state, setState] = useState({
    activeWithdrawTab: "Liquidity" as WithdrawSubTabs,
  });

  const updateState = (updates: Partial<typeof state>) => {
    setState((prevState) => ({ ...prevState, ...updates }));
  };

  return (
    <div className="flex flex-col h-full">
      <ButtonTabs
        tabs={["Liquidity", "Queue", "Collect"]}
        activeTab={state.activeWithdrawTab}
        setActiveTab={(tab) =>
          updateState({ activeWithdrawTab: tab as WithdrawSubTabs })
        }
      />

      <div className="flex-grow">
        {state.activeWithdrawTab === "Liquidity" && (
          <WithdrawLiquidity
            lpState={lpState}
            vaultState={vaultState}
            showConfirmation={showConfirmation}
            withdraw={withdraw}
          />
        )}
        {state.activeWithdrawTab === "Queue" && (
          <QueueWithdrawal
            vaultState={vaultState}
            lpState={lpState}
            showConfirmation={showConfirmation}
            //queueWithdrawal={queueWithdrawal}
          />
        )}
        {state.activeWithdrawTab === "Collect" && (
          <WithdrawStash
            vaultState={vaultState}
            lpState={lpState}
            showConfirmation={showConfirmation}
            //withdrawStash={withdrawStash}
          />
        )}
      </div>
    </div>
  );
};

export default Withdraw;
