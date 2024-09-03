import React, { useState, useEffect } from "react";
import { useAtomValue } from "jotai";
import { vaultUserType } from "@/lib/atom/user-tab";
import {
  TabType,
  SidePanelState,
  VaultDetailsProps,
  VaultUserType,
} from "@/lib/types";
import Tabs from "@/components/Vault/VaultActions/Tabs/Tabs";
import Deposit from "@/components/Vault/VaultActions/Tabs/Provider/Deposit/Deposit";
import Withdraw from "@/components/Vault/VaultActions/Tabs/Provider/Withdraw/Withdraw";
import MyInfo from "@/components/Vault/VaultActions/Tabs/Provider/MyInfo/MyInfo";
import { RoundState } from "@/lib/types";
import ActionButton from "@/components/Vault/Utils/ActionButton";
import ConfirmationModal from "@/components/Vault/Utils/ConfirmationModal";
import SuccessModal from "@/components/Vault/Utils/SuccessModal";

const SidePanel: React.FC<VaultDetailsProps> = (details) => {
  const vaultUser = useAtomValue(vaultUserType);
  const [state, setState] = useState<SidePanelState>({
    activeTab: getInitialActiveTab(vaultUser, details.status),
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
      activeTab: getInitialActiveTab(vaultUser, details.status),
      isButtonDisabled:
        prevState.amount === "" || parseFloat(prevState.amount) <= 0,
    }));
  }, [vaultUser, details.status, state.amount]);

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

  const getTabs = (): TabType[] => {
    if (vaultUser === VaultUserType.Provider) {
      return ["Deposit", "Withdraw", "My Info"];
    } else {
      switch (details.status) {
        case RoundState.Open: // return empty component
        case RoundState.Auctioning:
          return ["Place Bid", "History", "My Info"];
        case RoundState.Running:
          return ["Refund", "Mint", "My Info"];
        case RoundState.Settled:
          return ["Refund", "Exercise", "My Info"];
        default:
          return ["My Info"];
      }
    }
  };

  // Placeholder components for Buyer views
  const PlaceBid = () => <div>Place Bid Content</div>;
  const History = () => <div>History Content</div>;
  const Refund = () => <div>Refund Content</div>;
  const Mint = () => <div>Mint Content</div>;
  const Exercise = () => <div>Exercise Content</div>;

  const renderContent = () => {
    if (vaultUser === VaultUserType.Provider) {
      switch (state.activeTab) {
        case "Deposit":
          return <Deposit state={state} updateState={updateState} />;
        case "Withdraw":
          return <Withdraw state={state} updateState={updateState} />;
        case "My Info":
          return <MyInfo />;
        default:
          return null;
      }
    } else {
      // Buyer view
      switch (details.status) {
        case RoundState.Open:
        case RoundState.Auctioning:
          switch (state.activeTab) {
            case "Place Bid":
              return <PlaceBid />;
            case "History":
              return <History />;
            case "My Info":
              return <MyInfo />;
            default:
              return null;
          }
        case RoundState.Running:
          switch (state.activeTab) {
            case "Refund":
              return <Refund />;
            case "Mint":
              return <Mint />;
            case "My Info":
              return <MyInfo />;
            default:
              return null;
          }
        case RoundState.Settled:
          switch (state.activeTab) {
            case "Refund":
              return <Refund />;
            case "Exercise":
              return <Exercise />;
            case "My Info":
              return <MyInfo />;
            default:
              return null;
          }
        default:
          return <MyInfo />;
      }
    }
  };

  const getActionButtonText = () => {
    if (vaultUser === VaultUserType.Provider) {
      return state.activeTab === "Withdraw"
        ? `${
            state.activeWithdrawTab === "Queue"
              ? "Queue"
              : state.activeWithdrawTab
          } Withdrawal`
        : "Deposit";
    } else {
      return state.activeTab;
    }
  };

  return (
    <div className="bg-[#121212] border border-[#262626] rounded-lg p-4 w-full flex flex-col h-full">
      <Tabs
        tabs={getTabs()}
        activeTab={state.activeTab}
        setActiveTab={(tab) => updateState({ activeTab: tab as TabType })}
      />

      <div className="flex-grow">{renderContent()}</div>

      {state.activeTab !== "My Info" && state.activeTab !== "History" && (
        <div className="mt-4 pt-4 border-t border-gray-700">
          <ActionButton
            onClick={handleSubmit}
            disabled={state.isButtonDisabled}
            text={getActionButtonText()}
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

// Helper function to determine the initial active tab
function getInitialActiveTab(
  userType: VaultUserType,
  status: RoundState
): TabType {
  if (userType === VaultUserType.Provider) {
    return "Deposit";
  } else {
    switch (status) {
      case RoundState.Open:
      case RoundState.Auctioning:
        return "Place Bid";
      case RoundState.Running:
        return "Refund";
      case RoundState.Settled:
        return "Refund";
      default:
        return "My Info";
    }
  }
}

export default SidePanel;
