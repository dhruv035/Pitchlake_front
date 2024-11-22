import React, { useState, ReactNode } from "react";
import { WithdrawSubTabs } from "@/lib/types";
import ButtonTabs from "../../ButtonTabs";
import WithdrawLiquidity from "@/components/Vault/VaultActions/Tabs/Provider/Withdraw/WithdrawLiquidity";
import QueueWithdrawal from "@/components/Vault/VaultActions/Tabs/Provider/Withdraw/QueueWithdrawal";
import WithdrawStash from "@/components/Vault/VaultActions/Tabs/Provider/Withdraw/WithdrawStash";
import { useProtocolContext } from "@/context/ProtocolProvider";

interface WithdrawProps {
  showConfirmation: (
    modalHeader: string,
    action: ReactNode,
    onConfirm: () => Promise<void>,
  ) => void;
}

const Withdraw: React.FC<WithdrawProps> = ({ showConfirmation }) => {
  const { selectedRoundState } = useProtocolContext();
  const [state, setState] = useState({
    activeWithdrawTab: "Liquidity" as WithdrawSubTabs,
  });

  const updateState = (updates: Partial<typeof state>) => {
    setState((prevState) => ({ ...prevState, ...updates }));
  };

  return (
    <>
      <div className="flex-col space-y-6 p-6 pb-2">
        <ButtonTabs
          tabs={
            selectedRoundState?.roundState.toString() === "Auctioning" ||
            selectedRoundState?.roundState.toString() === "Running"
              ? ["Liquidity", "Queue", "Collect"]
              : ["Liquidity", "Collect"]
          }
          activeTab={state.activeWithdrawTab}
          setActiveTab={(tab) =>
            updateState({ activeWithdrawTab: tab as WithdrawSubTabs })
          }
        />
      </div>
      <div className="h-full flex flex-col">
        {state.activeWithdrawTab === "Liquidity" && (
          <WithdrawLiquidity showConfirmation={showConfirmation} />
        )}

        {state.activeWithdrawTab === "Queue" && (
          <QueueWithdrawal showConfirmation={showConfirmation} />
        )}
        {state.activeWithdrawTab === "Collect" && (
          <WithdrawStash showConfirmation={showConfirmation} />
        )}
      </div>
    </>
  );
};

export default Withdraw;
