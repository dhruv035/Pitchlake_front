"use client";
import React, { useEffect, useState } from "react";
import ConfirmationModal from "@/components/Vault/Utils/ConfirmationModal";
import SuccessModal from "@/components/Vault/Utils/SuccessModal";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  ArrowLeftIcon,
  LayerStackIcon,
  LayoutLeftIcon,
  LineChartDownIcon,
  SafeIcon,
} from "@/components/Icons";
import { timeFromNow, shortenString, formatNumberText } from "@/lib/utils";
import { formatUnits, formatEther, parseEther } from "ethers";
import { useProtocolContext } from "@/context/ProtocolProvider";
import StateTransitionConfirmationModal from "@/components/Vault/Utils/StateTransitionConfirmationModal";
import {
  ArrowRightIcon,
  ChevronLeft,
  ChevronRight,
  ExternalLinkIcon,
} from "lucide-react";
import { useExplorer } from "@starknet-react/core";

// comment for git

const PanelLeft = () => {
  const { vaultState, selectedRoundState, vaultActions, timeStamp } =
    useProtocolContext();
  const explorer = useExplorer();
  const [vaultIsOpen, setVaultIsOpen] = useState<boolean>(true);
  const [optionRoundIsOpen, setOptionRoundIsOpen] = useState<boolean>(true);
  const [isPanelOpen, setIsPanelOpen] = useState<boolean>(false);
  const [modalState, setModalState] = useState<{
    show: boolean;
    action: string;
    onConfirm: () => Promise<void>;
  }>({
    show: false,
    action: "",
    onConfirm: async () => {},
  });

  const hideModal = () => {
    setModalState({
      show: false,
      action: "",
      onConfirm: async () => {},
    });
  };

  const handleConfirm = async () => {
    await modalState.onConfirm();
    // Optionally reset the modal state or handle success here
  };
  let date;
  if (selectedRoundState?.auctionEndDate)  
  date = new Date(Number(selectedRoundState?.auctionEndDate)).toLocaleString();

  const getStateActionHeader = () => {
    const roundState = selectedRoundState?.roundState
      ? selectedRoundState.roundState
      : "Open";
    if (roundState === "Open") {
      return <p className="text-[#BFBFBF]">Auction Starts In:</p>;
    } else if (roundState === "Auctioning") {
      return <p className="text-[#BFBFBF]">Auction Ends In:</p>;
    } else if (roundState === "Running") {
      return <p className="text-[#BFBFBF]">Round Settles In:</p>;
    } else {
      return;
    }
  };

  const getStateBgColor = () => {
    const roundState = selectedRoundState?.roundState
      ? selectedRoundState.roundState
      : "Open";
    //let roundState = "Auctioning";

    if (roundState === "Open") {
      return "[#214C0B80]";
    } else if (roundState === "Auctioning") {
      return "[#45454580]";
    } else if (roundState === "Running") {
      return "[#6D1D0D59]";
    } else {
      return "[#CC455E33]";
    }
  };

  const getStateTextColor = () => {
    const roundState = selectedRoundState?.roundState
      ? selectedRoundState.roundState
      : "Open";
    //let roundState = "Auctioning";

    if (roundState === "Open") {
      return "[#347912]";
    } else if (roundState === "Auctioning") {
      return "[#BFBFBF]";
    } else if (roundState === "Running") {
      return "warning";
    } else {
      return "[#CC455E]";
    }
  };

  // const getStateBanner = () => {
  //   //const roundState = selectedRoundState?.roundState
  //   //  ? selectedRoundState.roundState
  //   //  : "Open";
  //   let roundState = "Auctioning";
  //   let bg = "";
  //   let text = "";
  //   if (roundState === "Open") {
  //     bg = "[#214C0B80]";
  //     text = "[#347912]";
  //   } else if (roundState === "Auctioning") {
  //     bg = "[#45454580]";
  //     text = "[warning]"; // "#BFBFBF";
  //     //return "#45454580";
  //   } else if (roundState === "Running") {
  //     bg = "[#6D1D0D59]";
  //     text = "[#F78771]";
  //   } else {
  //     bg = "[#CC455E33]";
  //     text = "[#CC455E]";
  //   }
  //   console.log(bg, text);
  //   const className = `text-[${text}] bg-[${bg}] border-[1px] border-[${text}] rounded-full px-2 py-[1px]`;
  //   console.log("CLASSNAME", className);
  //   return <p className={className}>{roundState}</p>;
  // };

  const [isClient,setIsClient] = useState(false);
  useEffect(()=>{
setIsClient(true);
  },[])
  return (
    <>
      <div
        className={`flex flex-col mr-4 max-w-[350px] transition-all duration-300 max-h-[800px] overflow-hidden ${
          isPanelOpen ? "w-full" : "w-[110px]"
        }`}
      >
        <div className="bg-black-alt border-[1px] border-greyscale-800 items-start rounded-lg w-full flex flex-col flex-grow h-full max-h-full">
          <div className="w-full border-b-1 p-3 border-white">
            <div
              className={`flex flex-row w-full rounded-md px-3 hover:cursor-pointer ${
                isPanelOpen ? "justify-between" : "justify-center"
              }`}
              onClick={() => setIsPanelOpen(!isPanelOpen)}
            >
              <p className={`${isPanelOpen ? "flex" : "hidden"}`}>Statistics</p>
              {isPanelOpen ? (
                <ChevronLeft stroke="white" />
              ) : (
                <ChevronRight stroke="white" />
              )}
            </div>
          </div>
          <div className="flex flex-col w-full px-3 border-t-[1px] border-greyscale-800">
            <div
              className={`flex flex-row w-full mt-3 rounded-md p-3 ${
                isPanelOpen
                  ? "justify-between cursor-pointer bg-faded-black"
                  : "justify-center"
              }`}
            >
              <div>
                <SafeIcon
                  fill="black"
                  stroke="white"
                  classname="w-6 h-6 text-primary-800"
                />
              </div>
              <div
                className={`${isPanelOpen ? "flex" : "hidden"} flex-row w-full`}
                onClick={() => setVaultIsOpen((state) => !state)}
              >
                <div className="ml-2 text-white w-fit overflow-clip text-nowrap">
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
              className={`flex flex-col mt-2 overflow-scroll no-scrollbar ${
                isPanelOpen ? "" : "hidden"
              } ${
                vaultIsOpen ? "h-0" : "h-[180px]"
              } transition-all duration-900ms `}
            >
              <div className="flex flex-row justify-between p-2 w-full">
                <p className="text-[#BFBFBF]">Address:</p>
                <a
                  href={explorer.contract(
                    vaultState?.address ? vaultState.address : "",
                  )}
                  target="_blank"
                  className="flex flex-row justify-center items-center text-[#F5EBB8] cursor-pointer gap-[4px]"
                >
                  <p className="">
                    {
                      vaultState?.address
                        ? shortenString(vaultState?.address)
                        : ""
                      //Add vault address short string from state here
                    }
                  </p>
                  <ExternalLinkIcon className="size-[16px]" />
                </a>
              </div>{" "}
              <div className="flex flex-row justify-between p-2 w-full">
                <p className="text-[#BFBFBF]">Strike Level:</p>
                <p>{Number(vaultState?.strikeLevel) / 100}%</p>
              </div>
              {
                //  <div className="flex flex-row justify-between p-2 w-full">
                //    <p>Type:</p>
                //    <p>
                //      {
                //        vaultState?.vaultType
                //        //Add vault type from state here
                //      }
                //    </p>
                //  </div>
              }
              <div className="flex flex-row justify-between p-2 w-full">
                <p className="text-[#BFBFBF]">Risk Level:</p>
                <p>{Number(vaultState?.alpha) / 100}%</p>
              </div>{" "}
              <div className="flex flex-row justify-between p-2 w-full">
                <p className="text-[#BFBFBF]">TVL:</p>
                <p>
                  {
                    vaultState?.lockedBalance
                      ? parseFloat(
                          formatEther(
                            (
                              BigInt(vaultState.lockedBalance) +
                              BigInt(vaultState.unlockedBalance)
                            ).toString(),
                          ),
                        ).toFixed(2)
                      : 0
                    //Add vault TVL from state here
                  }
                  &nbsp;ETH
                </p>
              </div>{" "}
            </div>
          </div>
          <div className="flex flex-col w-full px-3 border-t-[1px] border-greyscale-800">
            <div
              className={`flex flex-row w-full mt-3 rounded-md p-3 ${
                isPanelOpen
                  ? "justify-between cursor-pointer bg-faded-black"
                  : "justify-center"
              }`}
            >
              <div>
                <LayerStackIcon
                  classname="w-6 h-6"
                  fill="black"
                  stroke="white"
                />
              </div>
              <div
                className={`${isPanelOpen ? "flex" : "hidden"} flex-row w-full`}
                onClick={() => setOptionRoundIsOpen((state) => !state)}
              >
                <div className="ml-2 text-white w-fit overflow-clip text-nowrap">
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
              className={`flex flex-col mt-2 overflow-scroll no-scrollbar ${
                isPanelOpen ? "" : "hidden"
              } ${
                optionRoundIsOpen
                  ? "h-0"
                  : vaultIsOpen
                    ? "h-[380px]"
                    : "h-[350px]"
              } transition-all duration-900 max-h-full`}
            >
              <div className="max-h-full flex flex-row justify-between items-center p-2 w-full">
                <p className="text-[#BFBFBF]">Selected Round:</p>
                <a
                  href={explorer.contract(
                    selectedRoundState?.address
                      ? selectedRoundState.address
                      : "",
                  )}
                  target="_blank"
                  className="flex flex-row justify-center items-center text-[#F5EBB8] cursor-pointer gap-[4px]"
                >
                  <p className="">
                    Round{" "}
                    {selectedRoundState?.roundId
                      ? Number(selectedRoundState.roundId).toPrecision(1)
                      : ""}
                  </p>
                  <ExternalLinkIcon className="size-[16px]" />
                </a>
              </div>
              <div className="max-h-full flex flex-row justify-between items-center p-2 w-full">
                <p className="text-[#BFBFBF]">Status:</p>
                <p
                  className={`border-[1px] border-${getStateTextColor()} bg-${getStateBgColor()} text-${getStateTextColor()} rounded-full px-2 py-[1px]`}
                >
                  {
                    selectedRoundState && selectedRoundState.roundState
                    //Add appropriate bg
                  }
                </p>
              </div>
              <div className="max-h-full flex flex-row justify-between items-center p-2 w-full">
                <p className="text-[#BFBFBF]">Last Round Perf.:</p>
                <div
                  onClick={() => {
                    console.log("todo: decrement selected round id");
                  }}
                  className="flex flex-row justify-center items-center text-[#F5EBB8] cursor-pointer gap-[4px]"
                >
                  <p className="">+12.34%</p>
                  <ArrowRightIcon className="size-[16px]" />
                </div>
              </div>
              <div className="max-h-full flex flex-row justify-between items-center   p-2 w-full">
                <p className="text-[#BFBFBF]">Reserve Price:</p>
                <p>
                  {
                    selectedRoundState?.reservePrice &&
                      formatUnits(
                        selectedRoundState.reservePrice.toString(),
                        "gwei",
                      )
                    //Add round duration from state here
                  }{" "}
                  GWEI
                </p>
              </div>
              <div className="max-h-full flex flex-row justify-between items-center p-2 w-full">
                <p className="text-[#BFBFBF]">Strike Price:</p>
                <p>
                  {
                    selectedRoundState?.strikePrice &&
                      formatUnits(
                        selectedRoundState.strikePrice.toString(),
                        "gwei",
                      )
                    //Add round duration from state here
                  }{" "}
                  GWEI
                </p>
              </div>
              <div className="max-h-full flex flex-row justify-between items-center   p-2 w-full">
                <p className="text-[#BFBFBF]">Cap Level:</p>
                <p>
                  {
                    selectedRoundState?.capLevel &&
                      (
                        (100 *
                          parseInt(selectedRoundState.capLevel.toString())) /
                        10_000
                      ).toFixed(2) //Add round duration from state here
                  }
                  %
                </p>
              </div>
              <div className="max-h-full flex flex-row justify-between items-center   p-2 w-full">
                <p className="text-[#BFBFBF]">Total Options:</p>
                <p>
                  {
                    formatNumberText(
                      selectedRoundState
                        ? Number(selectedRoundState.availableOptions.toString())
                        : 0,
                    )
                    //Add round duration from state here
                  }
                </p>
              </div>
              <div className="flex flex-row justify-between p-2 w-full">
                <p className="text-[#BFBFBF]">Run Time:</p>
                <p>
                  {""}
                </p>
              </div>
              <div className="max-h-full flex flex-row justify-between items-center   p-2 w-full">
                {getStateActionHeader()}
                <p>
                  {""}
                  { 
                      //isClient?date:""
                    
                    //Add round duration from state here
                  }
                </p>
              </div>
            </div>
          </div>
          <div className="flex flex-col w-[90%] mx-[auto] mt-[auto] mb-[1rem]">
            {selectedRoundState &&
              selectedRoundState.roundState !== "SETTLED" && (
                <button
                  disabled={
                    !selectedRoundState ||
                    (selectedRoundState.roundState.toString() === "Open" &&
                      selectedRoundState.auctionStartDate > timeStamp) ||
                    (selectedRoundState.roundState.toString() ===
                      "Auctioning" &&
                      selectedRoundState.auctionEndDate > timeStamp) ||
                    (selectedRoundState.roundState.toString() === "Running" &&
                      selectedRoundState.optionSettleDate > timeStamp) ||
                    selectedRoundState.roundState.toString() === "Settled"
                  }
                  className={`${
                    isPanelOpen ? "flex" : "hidden"
                  } border border-greyscale-700 text-primary disabled:text-greyscale rounded-md mt-4 p-2 w-full justify-center items-center`}
                  onClick={async () => {
                    switch (selectedRoundState?.roundState) {
                      case "Open":
                        setModalState({
                          show: true,
                          action: "Start Auction",
                          onConfirm: async () => {
                            await vaultActions.startAuction();
                            setModalState((prev) => ({ ...prev, show: false }));
                          },
                        });
                        break;
                      case "Auctioning":
                        setModalState({
                          show: true,
                          action: "End Auction",
                          onConfirm: async () => {
                            await vaultActions.endAuction();
                            setModalState((prev) => ({ ...prev, show: false }));
                          },
                        });
                        break;
                      case "Running":
                        setModalState({
                          show: true,
                          action: "Settle Round",
                          onConfirm: async () => {
                            await vaultActions.settleOptionRound();
                            setModalState((prev) => ({ ...prev, show: false }));
                          },
                        });
                        break;
                      default:
                        break;
                    }
                  }}
                >
                  <p>
                    {selectedRoundState.roundState === "Open"
                      ? "Start Auction"
                      : selectedRoundState.roundState === "Auctioning"
                        ? "End Auction"
                        : selectedRoundState.roundState === "Running"
                          ? "Settle Round"
                          : "Settled"}
                  </p>
                  <LineChartDownIcon
                    classname="w-4 h-4 ml-2"
                    stroke={
                      !selectedRoundState ||
                      (selectedRoundState.roundState.toString() === "Open" &&
                        selectedRoundState.auctionStartDate > timeStamp) ||
                      (selectedRoundState.roundState.toString() ===
                        "Auctioning" &&
                        selectedRoundState.auctionEndDate > timeStamp) ||
                      (selectedRoundState.roundState.toString() === "Running" &&
                        selectedRoundState.optionSettleDate > timeStamp) ||
                      selectedRoundState.roundState.toString() === "Settled"
                        ? "var(--greyscale)"
                        : "var(--primary)"
                    }
                  />
                </button>
              )}
          </div>
        </div>
      </div>
      {modalState.show && (
        <StateTransitionConfirmationModal
          action={modalState.action}
          onConfirm={handleConfirm}
          onClose={hideModal}
        />
      )}
    </>
  );
};

export default PanelLeft;

//////
//("use client");
//import React, { useState } from "react";
//import ConfirmationModal from "@/components/Vault/Utils/ConfirmationModal";
//import SuccessModal from "@/components/Vault/Utils/SuccessModal";
//import {
//  ArrowDownIcon,
//  ArrowUpIcon,
//  ArrowLeftIcon,
//  LayerStackIcon,
//  LayoutLeftIcon,
//  LineChartDownIcon,
//  SafeIcon,
//} from "@/components/Icons";
//import { shortenString } from "@/lib/utils";
//import { formatUnits, formatEther, parseEther } from "ethers";
//import { useProtocolContext } from "@/context/ProtocolProvider";
//import StateTransitionConfirmationModal from "@/components/Vault/Utils/StateTransitionConfirmationModal";
//import { ChevronLeft, ChevronRight } from "lucide-react";
//
//const PanelLeft = () => {
//  const { vaultState, selectedRoundState, vaultActions } = useProtocolContext();
//  const [vaultIsOpen, setVaultIsOpen] = useState<boolean>(false);
//  const [optionRoundIsOpen, setOptionRoundIsOpen] = useState<boolean>(false);
//  const [isPanelOpen, setIsPanelOpen] = useState<boolean>(true);
//  const [modalState, setModalState] = useState<{
//    show: boolean;
//    action: string;
//    onConfirm: () => Promise<void>;
//  }>({
//    show: false,
//    action: "",
//    onConfirm: async () => {},
//  });
//
//  const hideModal = () => {
//    setModalState({
//      show: false,
//      action: "",
//      onConfirm: async () => {},
//    });
//  };
//
//  const handleConfirm = async () => {
//    await modalState.onConfirm();
//    //setModalState((prev) => ({ ...prev, type: "success", show: false }));
//  };
//
//  if (modalState.show) {
//    return (
//      <StateTransitionConfirmationModal
//        action={modalState.action}
//        onConfirm={handleConfirm}
//        onClose={hideModal}
//      />
//    );
//  }
//
//  return (
//    <div
//      className={`flex flex-col mr-4 max-w-[350px] transition-all duration-300 max-h-[800px] overflow-hidden ${
//        isPanelOpen ? "w-full" : "w-[110px]"
//      }`}
//    >
//      <div className="bg-black-alt border-[1px] border-greyscale-800 items-start rounded-lg w-full flex flex-col flex-grow h-full max-h-full">
//        <div className="w-full border-b-1 p-3 border-white">
//          <div
//            className={`flex flex-row w-full rounded-md px-3 hover:cursor-pointer ${
//              isPanelOpen ? "justify-between" : "justify-center"
//            }`}
//            onClick={() => setIsPanelOpen(!isPanelOpen)}
//          >
//            <p className={`${isPanelOpen ? "flex" : "hidden"}`}>Statistics</p>
//            {isPanelOpen ? (
//              <ChevronLeft stroke="white" />
//            ) : (
//              <ChevronRight stroke="white" />
//            )}
//          </div>
//        </div>
//        <div className="flex flex-col w-full px-3 border-t-[1px] border-greyscale-800">
//          <div
//            className={`flex flex-row w-full mt-2 rounded-md p-3 ${
//              isPanelOpen
//                ? "justify-between cursor-pointer bg-faded-black"
//                : "justify-center"
//            }`}
//          >
//            <div>
//              <SafeIcon
//                fill="black"
//                stroke="white"
//                classname="w-6 h-6 text-primary-800"
//              />
//            </div>
//            <div
//              className={`${isPanelOpen ? "flex" : "hidden"} flex-row w-full`}
//              onClick={() => setVaultIsOpen((state) => !state)}
//            >
//              <div className="ml-2 text-white w-fit overflow-clip  text-nowrap">
//                Vault
//              </div>
//              <div className="flex flex-row-reverse w-full">
//                {vaultIsOpen ? (
//                  <ArrowDownIcon fill="white" classname="w-6 h-6" />
//                ) : (
//                  <ArrowUpIcon fill="white" classname="w-6 h-6" />
//                )}
//              </div>
//            </div>
//          </div>
//          <div
//            className={`flex flex-col mt-2 overflow-scroll no-scrollbar ${
//              isPanelOpen ? "" : "hidden"
//            } ${
//              vaultIsOpen ? "h-0" : "h-[250px]"
//            } transition-all duration-900ms `}
//          >
//            <div className="flex flex-row justify-between p-2 w-full">
//              <p>Run Time:</p>
//              <p>
//                {
//                  selectedRoundState?.auctionStartDate &&
//                  selectedRoundState?.auctionEndDate
//                    ? (
//                        BigInt(selectedRoundState.auctionEndDate) -
//                        BigInt(selectedRoundState.auctionStartDate)
//                      ).toString()
//                    : ""
//                  //Add round duration from state here
//                }
//              </p>
//            </div>
//            <div className="flex flex-row justify-between p-2 w-full">
//              <p>Strike Level:</p>
//              <p>{Number(vaultState?.strikeLevel) / 100}%</p>
//            </div>
//            <div className="flex flex-row justify-between p-2 w-full">
//              <p>Type:</p>
//              <p>
//                {
//                  vaultState?.vaultType
//                  //Add vault type from state here
//                }
//              </p>
//            </div>
//            <div className="flex flex-row justify-between p-2 w-full">
//              <p>Addess:</p>
//              <p>
//                {
//                  vaultState?.address ? shortenString(vaultState?.address) : ""
//                  //Add vault address short string from state here
//                }
//              </p>
//            </div>
//            <div className="flex flex-row justify-between p-2 w-full">
//              <p>TVL:</p>
//              <p>
//                {
//                  vaultState?.lockedBalance
//                    ? parseFloat(
//                        formatEther(
//                          (
//                            BigInt(vaultState.lockedBalance) +
//                            BigInt(vaultState.unlockedBalance)
//                          ).toString(),
//                        ),
//                      ).toFixed(2)
//                    : 0
//                  //Add vault TVL from state here
//                }
//                &nbsp;ETH
//              </p>
//            </div>
//
//            <div className="flex flex-row justify-between p-2 w-full">
//              <p>Risk Level:</p>
//              <p>{Number(vaultState?.alpha) / 100}%</p>
//            </div>
//
//            {/* Vault details go here */}
//          </div>
//        </div>
//        <div className="flex flex-col w-full px-3 border-t-[1px] border-greyscale-800">
//          <div
//            className={`flex flex-row w-full mt-2 rounded-md p-3 ${
//              isPanelOpen
//                ? "justify-between cursor-pointer bg-faded-black"
//                : "justify-center"
//            }`}
//          >
//            <div>
//              <LayerStackIcon classname="w-6 h-6" fill="black" stroke="white" />
//            </div>
//            <div
//              className={`${isPanelOpen ? "flex" : "hidden"} flex-row w-full`}
//              onClick={() => setOptionRoundIsOpen((state) => !state)}
//            >
//              <div className="ml-2 text-white w-fit overflow-clip  text-nowrap">
//                Round
//              </div>
//
//              <div className="flex flex-row-reverse w-full">
//                {optionRoundIsOpen ? (
//                  <ArrowDownIcon fill="white" classname="w-6 h-6" />
//                ) : (
//                  <ArrowUpIcon fill="white" classname="w-6 h-6" />
//                )}
//              </div>
//            </div>
//          </div>
//          <div
//            className={`flex flex-col mt-2 overflow-scroll no-scrollbar ${
//              isPanelOpen ? "" : "hidden"
//            } ${
//              optionRoundIsOpen
//                ? "h-0"
//                : vaultIsOpen
//                  ? "h-[350px]"
//                  : "h-[290px]"
//            } transition-all duration-900 max-h-full`}
//          >
//            <div className="max-h-full flex flex-row justify-between items-center p-2 w-full">
//              <p>Selected Round:</p>
//              <p>
//                Round &nbsp;
//                {
//                  selectedRoundState?.roundId
//                    ? Number(selectedRoundState.roundId).toPrecision(1)
//                    : ""
//                  //Add round duration from state here
//                }
//              </p>
//            </div>
//            <div className="max-h-full flex flex-row justify-between items-center p-2 w-full">
//              <p>Status:</p>
//              <p className="bg-[#6D1D0D59] border-[1px] border-warning text-warning rounded-full px-2 py-[1px]">
//                {
//                  selectedRoundState && selectedRoundState.roundState
//                  //Add appropriate bg
//                }
//              </p>
//            </div>
//            <div className="max-h-full flex flex-row justify-between items-center p-2 w-full">
//              <p>Last Round Perf.:</p>
//              <p>
//                {
//                  "+11.33%"
//                  //Add round duration from state here
//                }
//              </p>
//            </div>
//            <div className="max-h-full flex flex-row justify-between items-center p-2 w-full">
//              <p>Strike Price:</p>
//              <p>
//                {
//                  selectedRoundState &&
//                    formatUnits(
//                      selectedRoundState.strikePrice.toString(),
//                      "gwei",
//                    )
//                  //Add round duration from state here
//                }{" "}
//                gwei
//              </p>
//            </div>
//            <div className="max-h-full flex flex-row justify-between items-center   p-2 w-full">
//              <p>CL:</p>
//              <p>
//                {
//                  selectedRoundState &&
//                    (
//                      (100 * parseInt(selectedRoundState.capLevel.toString())) /
//                      10_000
//                    ).toFixed(2) //Add round duration from state here
//                }
//                %
//              </p>
//            </div>
//            <div className="max-h-full flex flex-row justify-between items-center   p-2 w-full">
//              <p>Reserve Price:</p>
//              <p>
//                {
//                  selectedRoundState &&
//                    formatUnits(
//                      selectedRoundState.reservePrice.toString(),
//                      "gwei",
//                    )
//                  //Add round duration from state here
//                }{" "}
//                gwei
//              </p>
//            </div>
//            <div className="max-h-full flex flex-row justify-between items-center   p-2 w-full">
//              <p>Total Options:</p>
//              <p>
//                {
//                  selectedRoundState && selectedRoundState.availableOptions
//                  //Add round duration from state here
//                }
//              </p>
//            </div>
//            <div className="max-h-full flex flex-row justify-between items-center   p-2 w-full">
//              <p>End date:</p>
//              <p>
//                {
//                  selectedRoundState?.auctionEndDate &&
//                    new Date(
//                      selectedRoundState.auctionEndDate.toString(),
//                    ).toString()
//                  //Add round duration from state here
//                }
//              </p>
//            </div>
//            {/* Option round details go here */}
//          </div>
//        </div>
//        <div className="flex flex-col w-[90%] mx-[auto] mt-[auto] mb-[1rem]">
//          {selectedRoundState &&
//            selectedRoundState.roundState !== "SETTLED" && (
//              <button
//                className={`${
//                  isPanelOpen ? "flex" : "hidden"
//                } border border-greyscale-700 text-primary rounded-md mt-4 p-2 w-full justify-center items-center`}
//                onClick={async () => {
//                  switch (selectedRoundState?.roundState) {
//                    case "OPEN":
//                      setModalState({
//                        show: true,
//                        action: "Start Auction",
//                        onConfirm: async () => {
//                          await vaultActions.startAuction();
//                        },
//                      });
//                      break;
//                    case "AUCTIONING":
//                      setModalState({
//                        show: true,
//                        action: "End Auction",
//                        onConfirm: async () => {
//                          await vaultActions.endAuction();
//                        },
//                      });
//                      break;
//                    case "RUNNING":
//                      setModalState({
//                        show: true,
//                        action: "Settle Round",
//                        onConfirm: async () => {
//                          await vaultActions.settleOptionRound();
//                        },
//                      });
//                      break;
//                    default:
//                      break;
//                  }
//                }}
//              >
//                <p>
//                  {selectedRoundState.roundState === "OPEN"
//                    ? "Start Auction"
//                    : selectedRoundState.roundState === "AUCTIONING"
//                      ? "End Auction"
//                      : "Settle Round"}
//                </p>
//                <LineChartDownIcon
//                  classname="w-4 h-4 ml-2"
//                  stroke={"var(--primary)"}
//                />
//              </button>
//            )}
//        </div>
//      </div>
//    </div>
//  );
//};
//
//export default PanelLeft;
////////////////
//"use client";
//import React, { useState } from "react";
//import ConfirmationModal from "@/components/Vault/Utils/ConfirmationModal";
//import SuccessModal from "@/components/Vault/Utils/SuccessModal";
//import {
//  ArrowDownIcon,
//  ArrowUpIcon,
//  LayerStackIcon,
//  LayoutLeftIcon,
//  LineChartDownIcon,
//  SafeIcon,
//} from "@/components/Icons";
//import { shortenString } from "@/lib/utils";
//import { formatUnits, formatEther, parseEther } from "ethers";
//import { useProtocolContext } from "@/context/ProtocolProvider";
//import StateTransitionConfirmationModal from "@/components/Vault/Utils/StateTransitionConfirmationModal";
//const PanelLeft = () => {
//  const { vaultState, selectedRoundState, vaultActions } = useProtocolContext();
//  const [vaultIsOpen, setVaultIsOpen] = useState<boolean>(false);
//  const [optionRoundIsOpen, setOptionRoundIsOpen] = useState<boolean>(false);
//  const [isPanelOpen, setIsPanelOpen] = useState<boolean>(false);
//  const [modalState, setModalState] = useState<{
//    show: boolean;
//    action: string;
//    onConfirm: () => Promise<void>;
//  }>({
//    show: false,
//    action: "",
//    onConfirm: async () => {},
//  });
//
//  //const showConfirmation = (
//  //  modalHeader: string,
//  //  action: string,
//  //  onConfirm: () => Promise<void>,
//  //) => {
//  //  setModalState({
//  //    show: true,
//  //    type: "confirmation",
//  //    modalHeader,
//  //    action,
//  //    onConfirm,
//  //  });
//  //};
//  const hideModal = () => {
//    setModalState({
//      show: false,
//      action: "",
//      onConfirm: async () => {},
//    });
//  };
//
//  const handleConfirm = async () => {
//    await modalState.onConfirm();
//    setModalState((prev) => ({ ...prev, type: "success", show: false }));
//  };
//
//  if (modalState.show) {
//    return (
//      <StateTransitionConfirmationModal
//        action={modalState.action}
//        onConfirm={handleConfirm}
//        onClose={hideModal}
//      />
//    );
//  }
//
//  return (
//    <div className="flex flex-col mr-4 max-w-[350px] w-[110px] group hover:w-full transition-all duration-300 max-h-[800px] overflow-hidden ">
//      <div className="group bg-black-alt border-[1px] border-greyscale-800 items-start rounded-lg w-full flex flex-col flex-grow h-full max-h-full">
//        <div className="w-full border-b-1 p-3 border-white">
//          <div className="flex flex-row w-full rounded-md px-3 justify-center group-hover:justify-between">
//            <p className="hidden group-hover:flex">Statistics</p>
//            <LayoutLeftIcon classname="w-6 h-6" />
//          </div>
//        </div>
//        <div className="flex flex-col w-full px-3 border-t-[1px] border-greyscale-800">
//          <div className="flex flex-row w-full justify-center group-hover:justify-between group-hover:cursor-pointer rounded-md p-3 mt-2 group-hover:bg-faded-black">
//            <div>
//              <SafeIcon
//                fill="black"
//                stroke="white"
//                classname="w-6 h-6 text-primary-800"
//              />
//            </div>
//            <div
//              className="hidden group-hover:flex flex-row w-full"
//              onClick={() => setVaultIsOpen((state) => !state)}
//            >
//              <div className="ml-2 text-white w-fit overflow-clip  text-nowrap">
//                Vault
//              </div>
//              <div className="flex flex-row-reverse w-full">
//                {vaultIsOpen ? (
//                  <ArrowDownIcon fill="white" classname="w-6 h-6" />
//                ) : (
//                  <ArrowUpIcon fill="white" classname="w-6 h-6" />
//                )}
//              </div>
//            </div>
//          </div>
//          <div
//            className={`hidden group-hover:flex flex-col mt-2 overflow-scroll no-scrollbar ${
//              vaultIsOpen ? "h-0" : "h-[250px]"
//            } transition-all duration-900ms `}
//          >
//            <div className="flex flex-row justify-between p-2 w-full">
//              <p>Run Time:</p>
//              <p>
//                {
//                  selectedRoundState?.auctionStartDate &&
//                  selectedRoundState?.auctionEndDate
//                    ? (
//                        BigInt(selectedRoundState.auctionEndDate) -
//                        BigInt(selectedRoundState.auctionStartDate)
//                      ).toString()
//                    : ""
//                  //Add round duration from state here
//                }
//              </p>
//            </div>
//            <div className="flex flex-row justify-between p-2 w-full">
//              <p>Risk Level:</p>
//              <p>{Number(vaultState?.alpha) / 100}%</p>
//            </div>
//
//            <div className="flex flex-row justify-between p-2 w-full">
//              <p>Strike Level:</p>
//              <p>{Number(vaultState?.strikeLevel) / 100}%</p>
//            </div>
//            <div className="flex flex-row justify-between p-2 w-full">
//              <p>Type:</p>
//              <p>
//                {
//                  vaultState?.vaultType
//                  //Add vault type from state here
//                }
//              </p>
//            </div>
//            <div className="flex flex-row justify-between p-2 w-full">
//              <p>Addess:</p>
//              <p>
//                {
//                  vaultState?.address ? shortenString(vaultState?.address) : ""
//                  //Add vault address short string from state here
//                }
//              </p>
//            </div>
//            <div className="flex flex-row justify-between p-2 w-full">
//              <p>TVL:</p>
//              <p>
//                {
//                  vaultState?.lockedBalance
//                    ? parseFloat(
//                        formatEther(
//                          (
//                            BigInt(vaultState.lockedBalance) +
//                            BigInt(vaultState.unlockedBalance)
//                          ).toString(),
//                        ),
//                      ).toFixed(2)
//                    : 0
//                  //Add vault TVL from state here
//                }
//                &nbsp;ETH
//              </p>
//            </div>
//          </div>
//        </div>
//        <div className="flex flex-col w-full px-3 border-t-[1px] border-greyscale-800">
//          <div className="flex flex-row w-full mt-2 rounded-md p-3 group-hover:bg-faded-black group-hover:cursor-pointer justify-center group-hover:justify-between">
//            <div>
//              <LayerStackIcon classname="w-6 h-6" fill="black" stroke="white" />
//            </div>
//            <div
//              className="hidden group-hover:flex flex-row w-full"
//              onClick={() => setOptionRoundIsOpen((state) => !state)}
//            >
//              <div className="ml-2 text-white w-fit overflow-clip  text-nowrap">
//                Round
//              </div>
//
//              <div className="flex flex-row-reverse w-full">
//                {optionRoundIsOpen ? (
//                  <ArrowDownIcon fill="white" classname="w-6 h-6" />
//                ) : (
//                  <ArrowUpIcon fill="white" classname="w-6 h-6" />
//                )}
//              </div>
//            </div>
//          </div>
//          <div
//            className={`hidden group-hover:flex flex-col mt-2 overflow-scroll no-scrollbar ${
//              optionRoundIsOpen ? "h-0" : vaultIsOpen ? "h-100px" : "h-[250px]"
//            } transition-all duration-900 max-h-full`}
//          >
//            <div className="max-h-full flex flex-row justify-between items-center p-2 w-full">
//              <p>Selected Round:</p>
//              <p>
//                Round &nbsp;
//                {
//                  selectedRoundState?.roundId
//                    ? Number(selectedRoundState.roundId).toPrecision(1)
//                    : ""
//                  //Add round duration from state here
//                }
//              </p>
//            </div>
//            <div className="max-h-full flex flex-row justify-between items-center p-2 w-full">
//              <p>Status:</p>
//              <p className="bg-[#6D1D0D59] border-[1px] border-warning text-warning rounded-full px-2 py-[1px]">
//                {
//                  selectedRoundState && selectedRoundState.roundState
//                  //Add appropriate bg
//                }
//              </p>
//            </div>
//            <div className="max-h-full flex flex-row justify-between items-center p-2 w-full">
//              <p>Last Round Perf.:</p>
//              <p>
//                {
//                  "+11.33%"
//                  //Add round duration from state here
//                }
//              </p>
//            </div>
//            <div className="max-h-full flex flex-row justify-between items-center p-2 w-full">
//              <p>Strike Price:</p>
//              <p>
//                {
//                  selectedRoundState &&
//                    formatUnits(
//                      selectedRoundState.strikePrice.toString(),
//                      "gwei",
//                    )
//                  //Add round duration from state here
//                }{" "}
//                gwei
//              </p>
//            </div>
//            <div className="max-h-full flex flex-row justify-between items-center   p-2 w-full">
//              <p>CL:</p>
//              <p>
//                {
//                  selectedRoundState &&
//                    (
//                      (100 * parseInt(selectedRoundState.capLevel.toString())) /
//                      10_000
//                    ).toFixed(2) //Add round duration from state here
//                }
//                %
//              </p>
//            </div>
//            <div className="max-h-full flex flex-row justify-between items-center   p-2 w-full">
//              <p>Reserve Price:</p>
//              <p>
//                {
//                  selectedRoundState &&
//                    formatUnits(
//                      selectedRoundState.reservePrice.toString(),
//                      "gwei",
//                    )
//                  //Add round duration from state here
//                }{" "}
//                gwei
//              </p>
//            </div>
//            <div className="max-h-full flex flex-row justify-between items-center   p-2 w-full">
//              <p>Total Options:</p>
//              <p>
//                {
//                  selectedRoundState && selectedRoundState.availableOptions
//                  //Add round duration from state here
//                }
//              </p>
//            </div>
//            <div className="max-h-full flex flex-row justify-between items-center   p-2 w-full">
//              <p>End date:</p>
//              <p>
//                {
//                  selectedRoundState?.auctionEndDate &&
//                    new Date(
//                      selectedRoundState.auctionEndDate.toString(),
//                    ).toString()
//                  //Add round duration from state here
//                }
//              </p>
//            </div>
//          </div>
//        </div>
//        <div className="flex flex-col w-[90%] mx-[auto] mt-[auto] mb-[1rem]">
//          {selectedRoundState &&
//            selectedRoundState.roundState !== "SETTLED" && (
//              <button
//                className="hidden group-hover:flex border border-greyscale-700 text-primary rounded-md mt-4 p-2 w-full justify-center items-center"
//                onClick={async () => {
//                  switch (selectedRoundState?.roundState) {
//                    case "OPEN":
//                      setModalState({
//                        show: true,
//                        action: "Start Auction",
//                        onConfirm: async () => {
//                          await vaultActions.startAuction();
//                        },
//                      });
//                      //await vaultActions.startAuction();
//                      break;
//                    case "AUCTIONING":
//                      setModalState({
//                        show: true,
//                        action: "End Auction",
//                        onConfirm: async () => {
//                          await vaultActions.endAuction();
//                        },
//                      });
//                      //await vaultActions.endAuction();
//                      break;
//                    case "RUNNING":
//                      setModalState({
//                        show: true,
//                        action: "Settle Round",
//                        onConfirm: async () => {
//                          await vaultActions.settleOptionRound();
//                        },
//                      }); //await vaultActions.settleOptionRound();
//                      break;
//                    default:
//                      break;
//                  }
//
//                  //Trigger contract call here
//                }}
//              >
//                <p>
//                  {
//                    selectedRoundState.roundState === "OPEN"
//                      ? "Start Auction"
//                      : selectedRoundState.roundState === "AUCTIONING"
//                        ? "End Auction"
//                        : "Settle Round"
//                    //Enter text based on state
//                  }
//                </p>
//                <LineChartDownIcon
//                  classname="w-4 h-4 ml-2"
//                  stroke={"var(--primary"}
//                />
//              </button>
//            )}
//        </div>
//      </div>
//    </div>
//  );
//};
//
//export default PanelLeft;
