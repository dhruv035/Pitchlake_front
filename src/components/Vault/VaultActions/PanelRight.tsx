import React, { useState, useEffect, ReactElement, useContext } from "react";
import {
  VaultStateType,
  OptionRoundStateType,
  LiquidityProviderStateType,
  VaultActionsType,
  OptionRoundActionsType,
} from "@/lib/types";
import Tabs from "./Tabs/Tabs";
import { useTabContent } from "@/hooks/vault/useTabContent";
import ConfirmationModal from "@/components/Vault/Utils/ConfirmationModal";
import SuccessModal from "@/components/Vault/Utils/SuccessModal";
import { useTransactionContext } from "@/context/TransactionProvider";
import { useProtocolContext } from "@/context/ProtocolProvider";

interface VaultDetailsProps {
  userType: string;
}

interface TabContentProps {
  showConfirmation: (
    amount: string,
    action: string,
    onConfirm: () => Promise<void>,
  ) => void;
}

const PanelRight: React.FC<VaultDetailsProps> = ({
  userType,
}) => {
  const {vaultState,vaultActions,selectedRoundState} = useProtocolContext()
  const [activeTab, setActiveTab] = useState<string>("");
  const [modalState, setModalState] = useState<{
    show: boolean;
    type: "confirmation" | "pending" | "success" | "failure";
    modalHeader: string;
    action: string;
    onConfirm: () => Promise<void>;
  }>({
    show: false,
    type: "confirmation",
    modalHeader: "",
    action: "",
    onConfirm: async () => {},
  });

  const { tabs, tabContent } = useTabContent(
    userType,
    activeTab,
    selectedRoundState
  );


  const { pendingTx, status } = useTransactionContext();
  useEffect(() => {
    console.log("TRIGGERED",tabs,activeTab)
    if (tabs.length > 0 && activeTab==="") {
      setActiveTab(tabs[0]);
    }
  }, [tabs, activeTab]);


  useEffect(()=>{
if(!(activeTab in tabs)){
  setActiveTab(tabs[0]);
}
  },[tabs,selectedRoundState?.roundState])

  useEffect(() => {
    console.log("STATES", pendingTx, modalState.type, status);
    if (modalState.type === "pending") {
      if (!pendingTx && status === "success") {
        setModalState((prevState) => ({ ...prevState, type: "success" }));
      } else if (!pendingTx && status === "error") {
        setModalState((prevState) => ({ ...prevState, type: "failure" }));
      } else if (!pendingTx && !status) {
        setModalState((prevState) => ({ ...prevState, type: "success" }));
      }
    }
  }, [pendingTx, modalState.type, status]);
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  const showConfirmation = (
    modalHeader: string,
    action: string,
    onConfirm: () => Promise<void>,
  ) => {
    setModalState({
      show: true,
      type: "confirmation",
      modalHeader,
      action,
      onConfirm,
    });
  };

  const hideModal = () => {
    setModalState({
      show: false,
      type: "confirmation",
      modalHeader: "",
      action: "",
      onConfirm: async () => {},
    });
  };

  const handleConfirm = async () => {
    await modalState.onConfirm();
    setModalState((prev) => ({ ...prev, type: "pending" }));
  };

  const renderTabContent = () => {
    tabContent
    if (!tabContent) {
      return null;
    }
    return React.isValidElement(tabContent)
      ? React.cloneElement(tabContent as ReactElement<TabContentProps>, {
          showConfirmation,
        })
      : tabContent;
  };

  if (modalState.show) {
    if (modalState.type === "confirmation") {
      return (
        <ConfirmationModal
          modalHeader={`${modalState.modalHeader} Confirmation`}
          action={modalState.action}
          onConfirm={handleConfirm}
          onClose={hideModal}
        />
      );
    } else if (modalState.type === "pending") {
    } else if (modalState.type === "success") {
      return (
        <SuccessModal
          activeTab={`${modalState.modalHeader} Successful`}
          action={modalState.action}
          onClose={hideModal}
        />
      );
    } else if (modalState.type === "failure") {
    }
  }

  return (
    <div className="bg-[#121212] border border-[#262626] rounded-lg w-full flex flex-col h-full justify-center">
      {tabs.length > 0 ? (
        <>
          <Tabs
            tabs={tabs}
            activeTab={activeTab}
            setActiveTab={handleTabChange}
          />
          <div className="flex flex-col flex-grow h-[max]">
            {renderTabContent()}
          </div>
        </>
      ) : (
        <div className="text-white">Round hasn&apos;t started yet</div>
      )}
    </div>
  );
};

export default PanelRight;
