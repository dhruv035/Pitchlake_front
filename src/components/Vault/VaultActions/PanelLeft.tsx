import React, { useState, useEffect, ReactElement } from "react";
import { useAtomValue } from "jotai";
import { VaultUserRole, RoundState } from "@/lib/types";
import Tabs from "./Tabs/Tabs";
import { vaultUserType } from "@/lib/atom/user-tab";
import { useTabContent } from "@/hooks/vault/useTabContent";
import ConfirmationModal from "@/components/Vault/Utils/ConfirmationModal";
import SuccessModal from "@/components/Vault/Utils/SuccessModal";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  LayerStackIcon,
  LayoutLeftIcon,
  LineChartDownIcon,
  SafeIcon,
} from "@/components/Icons";

interface VaultDetailsProps {
  status: RoundState;
  vaultAddress: string;
}

interface TabContentProps {
  showConfirmation: (
    amount: string,
    action: string,
    onConfirm: () => Promise<void>
  ) => void;
}

const PanelLeft: React.FC<VaultDetailsProps> = ({ status, vaultAddress }) => {
  const vaultUser = useAtomValue(vaultUserType);
  const [activeTab, setActiveTab] = useState<string>("");
  const [vaultIsOpen, setVaultIsOpen] = useState<boolean>(false);
  const [optionRoundIsOpen, setOptionRoundIsOpen] = useState<boolean>(false);
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

  const showConfirmation = (
    modalHeader: string,
    action: string,
    onConfirm: () => Promise<void>
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
    setModalState((prev) => ({ ...prev, type: "success" }));
  };

  const renderTabContent = () => {
    const content = getTabContent(activeTab);
    if (!content) {
      return null;
    }
    return React.isValidElement(content)
      ? React.cloneElement(content as ReactElement<TabContentProps>, {
          showConfirmation,
        })
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
    <div className="flex flex-col mr-4 max-w-[350px] w-[110px] hover:w-full transition-all duration-300 max-h-[800px] overflow-hidden ">
      <div className="group bg-black-alt border-[1px] border-greyscale-800 items-start rounded-lg w-full flex flex-col flex-grow h-full max-h-full">
        <div className="w-full border-b-1 p-3 border-white">
          <div className="flex flex-row w-full rounded-md px-3 justify-center group-hover:justify-between">
            <p className="hidden group-hover:flex">Statistics</p>
            <LayoutLeftIcon classname="w-6 h-6"/>
          </div>
        </div>
        <div className="flex flex-col w-full px-3 border-t-[1px] border-greyscale-800">
          <div className="flex flex-row w-full justify-center group-hover:justify-between rounded-md p-3 mt-2 group-hover:bg-faded-black">
            <div>
              <SafeIcon
                fill="black"
                stroke="white"
                classname="w-6 h-6 text-primary-800"
              />
            </div>
            <div
              className="hidden group-hover:flex flex-row w-full"
              onClick={() => setVaultIsOpen((state) => !state)}
            >
              <div className="ml-2 text-white w-fit overflow-clip  text-nowrap">
                Vault
              </div>
              <div className="flex flex-row-reverse w-full">
                {vaultIsOpen ? (
                  <ArrowDownIcon fill="white" classname="w-6 h-6" />
                ) : (
                  <ArrowUpIcon fill="white" classname="w-6 h-6" />
                )}
              </div>
            </div>
          </div>
          <div
            className={`hidden group-hover:flex flex-col mt-2 overflow-scroll no-scrollbar ${
              vaultIsOpen ? "h-0" : "h-[160px]"
            } transition-all duration-400 `}
          >
            <div className="flex flex-row justify-between p-2 w-full">
              <p>Run Time:</p>
              <p>
                {
                  "1 MONTH"
                  //Add round duration from state here
                }
              </p>
            </div>
            <div className="flex flex-row justify-between p-2 w-full">
              <p>Type:</p>
              <p>
                {
                  "ITM"
                  //Add vault type from state here
                }
              </p>
            </div>
            <div className="flex flex-row justify-between p-2 w-full">
              <p>Addess:</p>
              <p>
                {
                  "1 MONTH"
                  //Add vault address short string from state here
                }
              </p>
            </div>
            <div className="flex flex-row justify-between p-2 w-full">
              <p>TVL:</p>
              <p>
                {
                  "2.45"
                  //Add vault TVL from state here
                }{" "}
                &nbsp;ETH
              </p>
            </div>
          </div>
        </div>
        <div className="flex flex-col w-full px-3 border-t-[1px] border-greyscale-800">
          <div className="flex flex-row w-full mt-2 rounded-md p-3 group-hover:bg-faded-black justify-center group-hover:justify-between">
            <div>
              <LayerStackIcon classname="w-6 h-6" fill="black" stroke="white" />
            </div>
            <div
              className="hidden group-hover:flex flex-row w-full"
              onClick={() => setOptionRoundIsOpen((state) => !state)}
            >
              <div className="ml-2 text-white w-fit overflow-clip  text-nowrap">
                Round
              </div>

              <div className="flex flex-row-reverse w-full">
                {optionRoundIsOpen ? (
                  <ArrowDownIcon fill="white" classname="w-6 h-6" />
                ) : (
                  <ArrowUpIcon fill="white" classname="w-6 h-6" />
                )}
              </div>
            </div>
          </div>
          <div
            className={`hidden group-hover:flex flex-col mt-2 overflow-scroll no-scrollbar ${
              optionRoundIsOpen ? "h-0" : "h-[250px]"
            } transition-all duration-900 max-h-full`}
          >
            <div className="max-h-full flex flex-row justify-between items-center p-2 w-full">
              <p>Selected Round:</p>
              <p>
                {
                  "1 MONTH"
                  //Add round duration from state here
                }
              </p>
            </div>
            <div className="max-h-full flex flex-row justify-between items-center p-2 w-full">
              <p>Status:</p>
              <p className="bg-[#6D1D0D59] border-[1px] border-warning text-warning rounded-full px-2 py-[1px]">
                {
                  "RUNNING"
                  //Add round duration from state here
                  //Add appropriate bg
                }
              </p>
            </div>
            <div className="max-h-full flex flex-row justify-between items-center p-2 w-full">
              <p>Last Round Perf.:</p>
              <p>
                {
                  "1 MONTH"
                  //Add round duration from state here
                }
              </p>
            </div>
            <div className="max-h-full flex flex-row justify-between items-center p-2 w-full">
              <p>Strike:</p>
              <p>
                {
                  "1 MONTH"
                  //Add round duration from state here
                }
              </p>
            </div>
            <div className="max-h-full flex flex-row justify-between items-center   p-2 w-full">
              <p>CL:</p>
              <p>
                {
                  "1 MONTH"
                  //Add round duration from state here
                }
              </p>
            </div>
            <div className="max-h-full flex flex-row justify-between items-center   p-2 w-full">
              <p>Reserve Price:</p>
              <p>
                {
                  "1 MONTH"
                  //Add round duration from state here
                }
              </p>
            </div>
            <div className="max-h-full flex flex-row justify-between items-center   p-2 w-full">
              <p>Total Options:</p>
              <p>
                {
                  "1 MONTH"
                  //Add round duration from state here
                }
              </p>
            </div>
            <div className="max-h-full flex flex-row justify-between items-center   p-2 w-full">
              <p>Time to End:</p>
              <p>
                {
                  "1 MONTH"
                  //Add round duration from state here
                }
              </p>
            </div>
          </div>
        </div>
        <div className="flex flex-col w-full">
          <button
            className="hidden group-hover:flex border border-greyscale-700 text-primary rounded-md mt-4 p-2 w-full justify-center items-center"
            onClick={() => {
              //Trigger contract call here
            }}
          >
            <p>
              {
                "End Auction"
                //Enter text based on state
              }
            </p>
            <LineChartDownIcon
              classname="w-4 h-4 ml-2"
              stroke={"var(--primary"}
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PanelLeft;
