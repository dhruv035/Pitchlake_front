import React, { useState } from "react";
import {
  LiquidityProviderStateType,
  VaultStateType,
  WithdrawSubTabs,
} from "@/lib/types";
import ButtonTabs from "../../../ButtonTabs";
import WithdrawLiquidity from "@/components/Vault/VaultActions/Tabs/Provider/Withdraw/WithdrawLiquidity";
import QueueWithdrawal from "@/components/Vault/VaultActions/Tabs/Provider/Withdraw/QueueWithdrawal";
import WithdrawStash from "@/components/Vault/VaultActions/Tabs/Provider/Withdraw/WithdrawStash";
import { ProtocolContext } from "@/context/ProtocolProvider";
import { CairoCustomEnum } from "starknet";

interface WithdrawProps {
  showConfirmation: (
    modalHeader: string,
    action: string,
    onConfirm: () => Promise<void>,
  ) => void;
}

const Withdraw: React.FC<WithdrawProps> = ({ showConfirmation }) => {
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
          <WithdrawLiquidity showConfirmation={showConfirmation} />
        )}
        {state.activeWithdrawTab === "Queue" && (
          <QueueWithdrawal showConfirmation={showConfirmation} />
        )}
        {state.activeWithdrawTab === "Collect" && (
          <WithdrawStash showConfirmation={showConfirmation} />
        )}
      </div>
    </div>
  );
};

export default Withdraw;
