import React, { useState, useEffect, ReactElement } from "react";
import { useAtomValue } from "jotai";
import { VaultUserRole, RoundState } from "@/lib/types";
import Tabs from "./Tabs/Tabs";
import { vaultUserType } from "@/lib/atom/user-tab";
import { useTabContent } from "@/hooks/vault/useTabContent";
import ConfirmationModal from "@/components/Vault/Utils/ConfirmationModal";
import SuccessModal from "@/components/Vault/Utils/SuccessModal";

interface VaultDetailsProps {
  status: RoundState;
  vaultAddress: string;
}

interface TabContentProps {
  showConfirmation: (amount: string, action: string, onConfirm: () => Promise<void>) => void;
}

const PanelLeft: React.FC<VaultDetailsProps> = ({ status, vaultAddress }) => {
  const vaultUser = useAtomValue(vaultUserType);
  const [activeTab, setActiveTab] = useState<string>("");
  const [modalState, setModalState] = useState<{
    show: boolean;
    type: "confirmation" | "success";
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

  const { getTabs, getTabContent } = useTabContent(
    vaultUser,
    status,
    vaultAddress
  );

  const tabs = getTabs();

  useEffect(() => {
    if (tabs.length > 0 && !activeTab) {
      setActiveTab(tabs[0]);
    }
  }, [tabs, activeTab]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  const showConfirmation = (modalHeader: string, action: string, onConfirm: () => Promise<void>) => {
    setModalState({ show: true, type: "confirmation", modalHeader, action, onConfirm });
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
    setModalState((prev) => ({ ...prev, type: "success" }));
  };

  const renderTabContent = () => {
    const content = getTabContent(activeTab);
    if (!content) {
      return null;
    }
    return React.isValidElement(content)
      ? React.cloneElement(content as ReactElement<TabContentProps>, { showConfirmation })
      : content;
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
    } else {
      return (
        <SuccessModal
          activeTab={`${modalState.modalHeader} Successful`}
          action={modalState.action}
          onClose={hideModal}
        />
      );
    }
  }

  return (
    <div className="bg-[#121212] border border-[#262626] rounded-lg p-4 w-full flex flex-col h-full">
      {tabs.length > 0 ? (
        <>
          <Tabs
            tabs={tabs}
            activeTab={activeTab}
            setActiveTab={handleTabChange}
          />
          <div className="flex-grow">{renderTabContent()}</div>
        </>
      ) : (
        <div className="text-white">Round hasn&apos;t started yet</div>
      )}
    </div>
  );
};

export default PanelLeft;