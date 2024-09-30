import React, { useState, useEffect, ReactElement } from "react";
import { useAtomValue } from "jotai";
import { VaultUserRole, RoundState } from "@/lib/types";
import Tabs from "./Tabs/Tabs";
import { vaultUserType } from "@/lib/atom/user-tab";
import { useTabContent } from "@/hooks/vault/useTabContent";
import ConfirmationModal from "@/components/Vault/Utils/ConfirmationModal";
import SuccessModal from "@/components/Vault/Utils/SuccessModal";
import { ArrowDownIcon, LayerStackIcon, SafeIcon } from "@/components/Icons";

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
    <div className="flex flex-col mr-4 max-w-[350px] w-[84px] hover:w-full transition-all duration-300 ">
    
    <div className="group bg-black-alt border-[1px] border-greyscale-800 items-start rounded-lg p-4 w-full flex flex-col flex-grow h-full">
    
        <div className="flex flex-row w-full">
          <div>
            <SafeIcon classname="w-6 h-6 text-primary-800" />
          </div>
          <div className="hidden group-hover:flex flex-row w-full">
        <div className="ml-2 text-white w-fit overflow-clip  text-nowrap">Vault</div>
        <div className="flex flex-row-reverse w-full"><ArrowDownIcon fill="white" classname="w-6 h-6"/></div></div>
      </div>

      <div className="flex flex-row w-full mt-6">
          <div>
            <LayerStackIcon classname="w-6 h-6" fill="black" stroke="white"/>
          </div>
          <div className="hidden group-hover:flex flex-row w-full">
        <div className="ml-2 text-white w-fit overflow-clip  text-nowrap">Option Round</div>
        <div className="flex flex-row-reverse w-full"><ArrowDownIcon fill="white" classname="w-6 h-6"/></div></div>
      </div>
    </div></div>
  );
};

export default PanelLeft;