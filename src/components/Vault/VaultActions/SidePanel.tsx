// SidePanel.tsx
import React, { useState, useEffect } from "react";
import { TabType, WithdrawTabType, SidePanelState } from "@/lib/types";
import Tabs from "@/components/Vault/VaultActions/Tabs/Tabs";
import DepositContent from "@/components/Vault/VaultActions/Tabs/Deposit/Deposit";
import WithdrawContent from "@/components/Vault/VaultActions/Tabs/Withdraw/Withdraw";
import MyInfoContent from "@/components/Vault/VaultActions/Tabs/MyInfo/MyInfo";
import ActionButton from "@/components/Vault/Utils/ActionButton";
import ConfirmationModal from "@/components/Vault/Utils/ConfirmationModal";
import SuccessModal from "@/components/Vault/Utils/SuccessModal";

const SidePanel: React.FC = () => {
  const [state, setState] = useState<SidePanelState>({
    activeTab: "Deposit",
    activeWithdrawTab: "Liquidity",
    amount: "",
    isDepositAsBeneficiary: false,
    showConfirmation: false,
    showSuccess: false,
    isButtonDisabled: true,
    percentage: 25,
    queuedPercentage: 5,
  });

  useEffect(() => {
    setState((prevState) => ({
      ...prevState,
      isButtonDisabled:
        prevState.amount === "" || parseFloat(prevState.amount) <= 0,
    }));
  }, [state.amount]);

  const updateState = (updates: Partial<SidePanelState>): void => {
    setState((prevState) => ({ ...prevState, ...updates }));
  };

  const handleSubmit = (): void => {
    if (!state.isButtonDisabled) {
      updateState({ showConfirmation: true });
    }
  };

  const handleConfirm = (): void => {
    updateState({ showConfirmation: false, showSuccess: true });
  };

  return (
    <div className="bg-[#121212] border border-[#262626] rounded-lg p-4 w-full flex flex-col h-full">
      <Tabs
        tabs={["Deposit", "Withdraw", "My Info"]}
        activeTab={state.activeTab}
        setActiveTab={(tab) => updateState({ activeTab: tab as TabType })}
      />

      <div className="flex-grow">
        {state.activeTab === "Deposit" && (
          <DepositContent state={state} updateState={updateState} />
        )}
        {state.activeTab === "Withdraw" && (
          <WithdrawContent state={state} updateState={updateState} />
        )}
        {state.activeTab === "My Info" && <MyInfoContent />}
      </div>

      {state.activeTab !== "My Info" && (
        <div className="mt-4 pt-4 border-t border-gray-700">
          <ActionButton
            onClick={handleSubmit}
            disabled={state.isButtonDisabled}
            text={
              state.activeTab === "Withdraw"
                ? `${
                    state.activeWithdrawTab === "Queue"
                      ? "Queue"
                      : state.activeWithdrawTab
                  } Withdrawal`
                : "Deposit"
            }
          />
        </div>
      )}

      {state.showConfirmation && (
        <ConfirmationModal
          activeTab={state.activeTab}
          amount={state.amount}
          onConfirm={handleConfirm}
          onClose={() => updateState({ showConfirmation: false })}
        />
      )}

      {state.showSuccess && (
        <SuccessModal
          activeTab={state.activeTab}
          amount={state.amount}
          onClose={() => updateState({ showSuccess: false })}
        />
      )}
    </div>
  );
};

export default SidePanel;