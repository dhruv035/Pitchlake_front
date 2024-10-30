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
import {
  timeFromNow,
  timeUntilTarget,
  shortenString,
  formatNumberText,
} from "@/lib/utils";
import { formatUnits, formatEther, parseEther } from "ethers";
import { useProtocolContext } from "@/context/ProtocolProvider";
import StateTransitionConfirmationModal from "@/components/Vault/Utils/StateTransitionConfirmationModal";
import {
  ArrowRightIcon,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ExternalLinkIcon,
  SquareArrowOutUpRight,
  Icon,
  Info,
  PanelLeft as IconPanelLeft,
} from "lucide-react";
import { useExplorer } from "@starknet-react/core";
import { BalanceTooltip } from "@/components/BaseComponents/Tooltip";
import StateTransition from "@/components/Vault/VaultActions/StateTransition";

// comment for git

const PanelLeft = ({ userType }: { userType: string }) => {
  const { vaultState, selectedRoundState, vaultActions, timeStamp } =
    useProtocolContext();

  const explorer = useExplorer();
  const [canStateTransition, setCanStateTransition] = useState<boolean>(false);
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

  const getNowBlockTime = () => {
    return Number(new Date().getTime()) / 1000;
  };

  const canAuctionStart = () => {
    const now = getNowBlockTime();
    const auctionStartDate = selectedRoundState?.auctionStartDate
      ? Number(selectedRoundState.auctionStartDate)
      : 0;
    if (now < auctionStartDate) {
      return "Auction Start Date Not Reached";
    }

    const selectedRoundId = selectedRoundState?.roundId
      ? Number(selectedRoundState.roundId)
      : 1;
    if (selectedRoundId === 1) {
      if (selectedRoundState?.roundState === "Open") {
        return "Pricing Data Not Set Yet";
      }
    }

    if (selectedRoundState?.roundState !== "Open") {
      return "Auction Already Started";
    }
  };

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
    date = new Date(
      Number(selectedRoundState?.auctionEndDate),
    ).toLocaleString();

  const getStateActionHeader = () => {
    const roundState = selectedRoundState?.roundState
      ? selectedRoundState.roundState
      : "Open";
    if (roundState === "Open") {
      return <p className="text-[#BFBFBF]">Auction Starts In</p>;
    } else if (roundState === "Auctioning") {
      return <p className="text-[#BFBFBF]">Auction Ends In</p>;
    } else if (roundState === "Running") {
      return <p className="text-[#BFBFBF]">Round Ends In</p>;
    } else {
      return <p className="text-[#BFBFBF]">Round Ended</p>;
    }
  };

  const stateStyles: any = {
    Open: {
      bg: "bg-[#214C0B80]",
      text: "text-[#6AB942]",
      border: "border-[#347912]",
    },
    Auctioning: {
      bg: "bg-[#45454580]",
      text: "text-[#FAFAFA]",
      border: "border-[#BFBFBF]",
    },
    Running: {
      bg: "bg-[#6D1D0D59]",
      text: "text-[#F78771]",
      border: "border-[#F78771]",
    },
    Settled: {
      bg: "bg-[#CC455E33]",
      text: "text-[#DA718C]",
      border: "border-[#CC455E]",
    },
    Default: {
      bg: "bg-[#CC455E33]",
      text: "text-[#CC455E]",
      border: "border-[#CC455E]",
    },
  };

  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

  const roundState = selectedRoundState?.roundState.toString() || "Open";
  const styles = stateStyles[roundState] || stateStyles.Default;

  console.log("A:SSFLKSDJF:LKSJDS", userType, roundState);

  return (
    <>
      <div
        className={`flex flex-col mr-4 max-w-[350px] transition-all duration-300 max-h-[834px] overflow-hidden ${
          isPanelOpen ? "w-full" : "w-[110px]"
        }`}
      >
        <div className="flex items-center align-center text-[14px] bg-black-alt border-[1px] border-greyscale-800 items-start rounded-lg w-full flex flex-col flex-grow h-full max-h-full">
          <div className="flex items-center h-[56px] w-full border-b-1 p-4 border-white">
            <div
              className={`flex flex-row w-full items-center rounded-md px-2 hover:cursor-pointer ${
                isPanelOpen ? "justify-between" : "justify-center"
              }`}
              onClick={() => setIsPanelOpen(!isPanelOpen)}
            >
              <p
                className={`${isPanelOpen ? "flex" : "hidden"} font-medium flex items-center`}
              >
                Statistics
              </p>
              <div className="w-[20px] h-[20px]">
                <IconPanelLeft
                  className="w-[20px] h-[20px] stroke-[1px]"
                  stroke="var(--buttonwhite)"
                />
              </div>
              {
                //  isPanelOpen ? (
                //  <IconPanelLeft
                //    className="stroke-[1px]"
                //    stroke="var(--buttonwhite)"
                //  />
                //) : (
                //  <IconPanelLeft stroke="var(--buttonwhite)" />
                //)
              }
            </div>
          </div>
          <div
            className={`flex flex-col w-full px-3 border-t-[1px] border-greyscale-800`}
          >
            <div
              className={`flex flex-row w-full mt-3 rounded-md p-3 ${
                isPanelOpen
                  ? "justify-between cursor-pointer bg-faded-black"
                  : "justify-center"
              }`}
            >
              <div>
                <SafeIcon
                  fill="none"
                  stroke="var(--buttongrey)"
                  classname="w-6 h-6 text-primary-800"
                />
              </div>
              <div
                className={`${isPanelOpen ? "flex" : "hidden"} flex-row w-full`}
                onClick={() => setVaultIsOpen((state) => !state)}
              >
                <div className="ml-2 text-white w-fit overflow-clip text-nowrap font-[] font-regular">
                  Vault
                </div>
                <div className="flex flex-row-reverse w-full">
                  {vaultIsOpen ? (
                    <ChevronDown stroke="var(--buttonwhite)" />
                  ) : (
                    <ChevronUp stroke="var(--buttonwhite)" />
                  )}
                </div>
              </div>
            </div>
            <div
              className={`flex flex-col mt-2 overflow-scroll no-scrollbar gap-1 ${
                isPanelOpen ? "" : "hidden"
              } ${
                vaultIsOpen
                  ? "h-[0]"
                  : optionRoundIsOpen
                    ? "h-[325px]"
                    : "h-[265px]"
              } transition-all duration-900ms `}
            >
              <div className="flex flex-row justify-between p-2 w-full">
                <p className="text-[#BFBFBF]">Run Time</p>
                <p>
                  {selectedRoundState?.auctionEndDate &&
                  selectedRoundState?.optionSettleDate
                    ? timeUntilTarget(
                        selectedRoundState.auctionEndDate.toString(),
                        selectedRoundState.optionSettleDate.toString(),
                      )
                    : ""}
                </p>
              </div>
              <div className="flex flex-row justify-between p-2 w-full">
                <p className="text-[#BFBFBF]">Address</p>
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
                  <SquareArrowOutUpRight size={16} />
                </a>
              </div>
              <div className="flex flex-row justify-between p-2 w-full">
                <p className="text-[#BFBFBF] font-regular">Fees</p>
                <p>0%</p>
              </div>
              <div className="flex flex-row justify-between p-2 w-full">
                <p className="text-[#BFBFBF]">TVL</p>
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
                  /1,000 ETH
                </p>
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
                <p className="text-[#BFBFBF] font-regular">APY</p>
                <p>12.34%</p>
              </div>
              <div className="flex flex-row justify-between p-2 w-full z-50">
                <p className="text-[#BFBFBF] font-regular">Balance</p>
                <div className="flex flex-row items-center gap-1 overflow-visable">
                  <BalanceTooltip
                    balance={{
                      locked: vaultState
                        ? vaultState.lockedBalance.toString()
                        : "0",
                      unlocked: vaultState
                        ? vaultState.unlockedBalance.toString()
                        : "0",
                      stashed: "0",
                    }}
                    children={
                      <>
                        <p>
                          {vaultState
                            ? Number(
                                formatEther(
                                  BigInt(vaultState.lockedBalance) +
                                    BigInt(vaultState.unlockedBalance) +
                                    BigInt(vaultState.stashedBalance),
                                ),
                              ).toFixed(2)
                            : 0}{" "}
                          ETH
                        </p>
                        <Info
                          size={16}
                          color="#CFC490"
                          className="cursor-pointer"
                        />
                      </>
                    }
                  ></BalanceTooltip>
                </div>
              </div>

              <div className="flex flex-row justify-between p-2 w-full">
                <p className="text-[#BFBFBF] font-regular">Risk Level</p>
                <p>{Number(vaultState?.alpha) / 100}%</p>
              </div>
              <div className="flex flex-row justify-between p-2 w-full">
                <p className="text-[#BFBFBF] font-regular">Strike Level</p>
                <p>{Number(vaultState?.strikeLevel) / 100}%</p>
              </div>
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
                  fill="none"
                  stroke="var(--buttongrey)"
                />
              </div>
              <div
                className={`${isPanelOpen ? "flex" : "hidden"} flex-row w-full`}
                onClick={() => setOptionRoundIsOpen((state) => !state)}
              >
                <div className="ml-2 text-white w-fit overflow-clip text-nowrap font-regular">
                  Round
                </div>

                <div className="flex flex-row-reverse w-full">
                  {optionRoundIsOpen ? (
                    <ChevronDown stroke="var(--buttonwhite)" />
                  ) : (
                    <ChevronUp stroke="var(--buttonwhite)" />
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
                    ? "h-[450px]"
                    : "h-[260px]"
              } transition-all duration-900 max-h-full`}
            >
              <div className="max-h-full flex flex-row justify-between items-center p-2 w-full">
                <p className="text-[#BFBFBF]">Selected Round</p>
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
                  <SquareArrowOutUpRight className="size-[16px]" />
                </a>
              </div>
              <div className="max-h-full flex flex-row justify-between items-center p-2 w-full">
                <p className="text-[#BFBFBF]">State</p>
                <p
                  className={`border-[1px] ${styles.border} ${styles.bg} ${styles.text} font-medium rounded-full px-2 py-[1px]`}
                >
                  {selectedRoundState && selectedRoundState.roundState}
                </p>
              </div>
              {selectedRoundState &&
                selectedRoundState.roundState !== "Settled" && (
                  <div className="max-h-full flex flex-row justify-between items-center p-2 w-full">
                    <p className="text-[#BFBFBF]">Last Round Perf.</p>
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
                )}
              {userType === "lp" && roundState === "Settled" && (
                <div className="max-h-full flex flex-row justify-between items-center   p-2 w-full">
                  <p className="text-[#BFBFBF]">Round Perf.</p>
                  <p>
                    {formatNumberText(
                      selectedRoundState
                        ? Number(selectedRoundState.performanceLP)
                        : 0,
                    )}
                    %
                  </p>
                </div>
              )}
              {userType === "ob" && roundState === "Settled" && (
                <div className="max-h-full flex flex-row justify-between items-center   p-2 w-full">
                  <p className="text-[#BFBFBF]">Round Perf.</p>
                  <p>
                    {formatNumberText(
                      selectedRoundState
                        ? Number(selectedRoundState.performanceOB)
                        : 0,
                    )}
                    %
                  </p>
                </div>
              )}
              <div className="max-h-full flex flex-row justify-between items-center   p-2 w-full">
                <p className="text-[#BFBFBF] font-regular text-[14px]">
                  Reserve Price
                </p>
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
                <p className="text-[#BFBFBF]">Strike Price</p>
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
                <p className="text-[#BFBFBF]">Cap Level</p>
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

              {userType === "ob" &&
                selectedRoundState &&
                selectedRoundState.roundState === "Open" && (
                  <>
                    {
                      // Show nothing new
                    }
                  </>
                )}

              {userType === "ob" &&
                selectedRoundState &&
                selectedRoundState.roundState === "Auctioning" && (
                  <>
                    {
                      // Show total options
                    }
                    <div className="max-h-full flex flex-row justify-between items-center   p-2 w-full">
                      <p className="text-[#BFBFBF]">Total Options</p>
                      <p>
                        {formatNumberText(
                          selectedRoundState
                            ? Number(
                                selectedRoundState.availableOptions.toString(),
                              )
                            : 0,
                        )}
                      </p>
                    </div>
                  </>
                )}

              {userType === "ob" &&
                selectedRoundState &&
                selectedRoundState.roundState === "Running" && (
                  <>
                    {
                      // Show options sold
                      // Show clearing price
                      // Show Total premium
                    }
                    <div className="max-h-full flex flex-row justify-between items-center   p-2 w-full">
                      <p className="text-[#BFBFBF]">Options Sold</p>
                      <p>
                        {formatNumberText(
                          selectedRoundState
                            ? Number(selectedRoundState.optionsSold.toString())
                            : 0,
                        )}
                      </p>
                    </div>
                    <div className="max-h-full flex flex-row justify-between items-center   p-2 w-full">
                      <p className="text-[#BFBFBF]">Clearing Price</p>
                      <p>
                        {formatNumberText(
                          selectedRoundState
                            ? Number(
                                selectedRoundState.clearingPrice.toString(),
                              )
                            : 0,
                        )}{" "}
                        GWEI
                      </p>
                    </div>
                    <div className="max-h-full flex flex-row justify-between items-center   p-2 w-full">
                      <p className="text-[#BFBFBF]">Total Premium</p>
                      <p>
                        {formatNumberText(
                          selectedRoundState
                            ? Number(selectedRoundState.premiums.toString())
                            : 0,
                        )}{" "}
                        ETH
                      </p>
                    </div>
                  </>
                )}
              <div className="max-h-full flex flex-row justify-between items-center   p-2 w-full">
                {getStateActionHeader()}
                <p>
                  {selectedRoundState?.optionSettleDate
                    ? timeFromNow(
                        selectedRoundState.optionSettleDate.toString(),
                      )
                    : ""}
                </p>
              </div>
            </div>
          </div>
          <div
            className={`${isPanelOpen ? "border border-transparent border-t-[#262626]" : ""} flex flex-col w-[100%] mx-[auto] mt-[auto] mb-[1rem]`}
          >
            {selectedRoundState &&
              selectedRoundState.roundState !== "SETTLED" && (
                <div className="px-6">
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
                    className={`${isPanelOpen ? "flex" : "hidden"} ${
                      roundState === "Settled" ? "hidden" : ""
                    } border border-greyscale-700 text-primary disabled:text-greyscale rounded-md mt-4 p-2 w-full justify-center items-center`}
                    onClick={async () => {
                      switch (selectedRoundState?.roundState) {
                        case "Open":
                          setModalState({
                            show: true,
                            action: "Start Auction",
                            onConfirm: async () => {
                              await vaultActions.startAuction();
                              setModalState((prev) => ({
                                ...prev,
                                show: false,
                              }));
                            },
                          });
                          break;
                        case "Auctioning":
                          setModalState({
                            show: true,
                            action: "End Auction",
                            onConfirm: async () => {
                              await vaultActions.endAuction();
                              setModalState((prev) => ({
                                ...prev,
                                show: false,
                              }));
                            },
                          });
                          break;
                        case "Running":
                          setModalState({
                            show: true,
                            action: "Settle Round",
                            onConfirm: async () => {
                              await vaultActions.settleOptionRound();
                              setModalState((prev) => ({
                                ...prev,
                                show: false,
                              }));
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
                        (selectedRoundState.roundState.toString() ===
                          "Running" &&
                          selectedRoundState.optionSettleDate > timeStamp) ||
                        selectedRoundState.roundState.toString() === "Settled"
                          ? "var(--greyscale)"
                          : "var(--primary)"
                      }
                    />
                  </button>
                </div>
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
