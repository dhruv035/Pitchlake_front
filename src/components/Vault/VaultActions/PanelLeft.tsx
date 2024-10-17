import React, { useState } from "react";
import {
  VaultStateType,
  OptionRoundStateType,
  VaultActionsType,
} from "@/lib/types";
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
import { shortenString } from "@/lib/utils";

interface VaultDetailsProps {
  roundState: OptionRoundStateType;
  vaultState: VaultStateType;
  vaultActions: VaultActionsType;
}

interface TabContentProps {
  showConfirmation: (
    amount: string,
    action: string,
    onConfirm: () => Promise<void>
  ) => void;
}

const PanelLeft: React.FC<VaultDetailsProps> = ({
  roundState,
  vaultState,
  vaultActions,
}) => {
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
            <LayoutLeftIcon classname="w-6 h-6" />
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
                  BigInt(roundState?.auctionEndDate) -
                    BigInt(roundState?.auctionStartDate)
                  //Add round duration from state here
                }
              </p>
            </div>
            <div className="flex flex-row justify-between p-2 w-full">
              <p>Type:</p>
              <p>
                {
                  vaultState.vaultType
                  //Add vault type from state here
                }
              </p>
            </div>
            <div className="flex flex-row justify-between p-2 w-full">
              <p>Addess:</p>
              <p>
                {
                  shortenString(vaultState.address)
                  //Add vault address short string from state here
                }
              </p>
            </div>
            <div className="flex flex-row justify-between p-2 w-full">
              <p>TVL:</p>
              <p>
                {
                  vaultState.lockedBalance &&
                    (
                      BigInt(vaultState.lockedBalance) +
                      BigInt(vaultState.unlockedBalance)
                    ).toString()
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
                Round &nbsp;
                {
                  Number(roundState.roundId).toPrecision(2)
                  //Add round duration from state here
                }
              </p>
            </div>
            <div className="max-h-full flex flex-row justify-between items-center p-2 w-full">
              <p>Status:</p>
              <p className="bg-[#6D1D0D59] border-[1px] border-warning text-warning rounded-full px-2 py-[1px]">
                {
                  roundState.roundState
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
                  roundState.strikePrice
                  //Add round duration from state here
                }
              </p>
            </div>
            <div className="max-h-full flex flex-row justify-between items-center   p-2 w-full">
              <p>CL:</p>
              <p>
                {
                  roundState.capLevel
                  //Add round duration from state here
                }
              </p>
            </div>
            <div className="max-h-full flex flex-row justify-between items-center   p-2 w-full">
              <p>Reserve Price:</p>
              <p>
                {
                  roundState.reservePrice
                  //Add round duration from state here
                }
              </p>
            </div>
            <div className="max-h-full flex flex-row justify-between items-center   p-2 w-full">
              <p>Total Options:</p>
              <p>
                {
                  roundState.availableOptions
                  //Add round duration from state here
                }
              </p>
            </div>
            <div className="max-h-full flex flex-row justify-between items-center   p-2 w-full">
              <p>Time to End:</p>
              <p>
                {
                  Date.now() - Number(roundState.auctionEndDate)
                  //Add round duration from state here
                }
              </p>
            </div>
          </div>
        </div>
        <div className="flex flex-col w-full">
          {roundState.roundState !== "SETTLED" && (
            <button
              className="hidden group-hover:flex border border-greyscale-700 text-primary rounded-md mt-4 p-2 w-full justify-center items-center"
              onClick={async () => {
                switch (roundState.roundState) {
                  case "OPEN":
                    await vaultActions.startAuction();
                    break;
                  case "AUCTIONING":
                    await vaultActions.endAuction();
                    break;
                  case "RUNNING":
                    await vaultActions.settleOptionRound();
                    break;
                  default: break
                    
                }

                //Trigger contract call here
              }}
            >
              <p>
                {
                  roundState.roundState === "OPEN"
                    ? "Start Auction"
                    : roundState.roundState === "AUCTIONING"
                    ? "End Auction"
                    : "Settle Round"
                  //Enter text based on state
                }
              </p>
              <LineChartDownIcon
                classname="w-4 h-4 ml-2"
                stroke={"var(--primary"}
              />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PanelLeft;
