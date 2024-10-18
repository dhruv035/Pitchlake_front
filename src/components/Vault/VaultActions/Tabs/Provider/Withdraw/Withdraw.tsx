import React, { useState } from "react";
import { LiquidityProviderStateType, VaultStateType, WithdrawArgs, WithdrawSubTabs } from "@/lib/types";
import ButtonTabs from "../../../ButtonTabs";
import WithdrawLiquidity from "@/components/Vault/VaultActions/Tabs/Provider/Withdraw/WithdrawLiquidity";
import WithdrawQueue from "@/components/Vault/VaultActions/Tabs/Provider/Withdraw/WithdrawQueue";
import WithdrawCollect from "@/components/Vault/VaultActions/Tabs/Provider/Withdraw/WithdrawCollect";

interface WithdrawProps {
  showConfirmation: (
    modalHeader: string,
    action: string,
    onConfirm: () => Promise<void>
  ) => void;
}

const Withdraw: React.FC<WithdrawProps> = ({
  showConfirmation,
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
            showConfirmation={showConfirmation}
          />
        )}
        {state.activeWithdrawTab === "Queue" && (
          <WithdrawQueue
            showConfirmation={showConfirmation}
          />
        )}
        {state.activeWithdrawTab === "Collect" && (
          <WithdrawCollect
            showConfirmation={showConfirmation}
          />
        )}
      </div>
    </div>
  );
};

export default Withdraw;
