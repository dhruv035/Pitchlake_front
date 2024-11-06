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
  createJobId,
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
import { num } from "starknet";
import { useExplorer } from "@starknet-react/core";
import { BalanceTooltip } from "@/components/BaseComponents/Tooltip";
import StateTransition from "@/components/Vault/VaultActions/StateTransition";
import { useProvider } from "@starknet-react/core";
import useLatestTimestamp from "@/hooks/chain/useLatestTimestamp";
import useFossilStatus from "@/hooks/fossil/useFossilStatus";
import { useTransactionContext } from "@/context/TransactionProvider";

// comment for git

const PanelLeft = ({ userType }: { userType: string }) => {
  const { vaultState, selectedRoundState, currentRoundAddress } =
    useProtocolContext();
  const { pendingTx } = useTransactionContext();
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

  const { provider } = useProvider();
  const { timestamp } = useLatestTimestamp(provider);
  const explorer = useExplorer();

  const hideModal = () => {
    setModalState({
      show: false,
      action: "",
      onConfirm: async () => {},
    });
  };

  const handleConfirm = async () => {
    await modalState.onConfirm();
  };

  //  let date;
  //  if (selectedRoundState?.auctionEndDate)
  //    date = new Date(
  //      Number(selectedRoundState?.auctionEndDate),
  //    ).toLocaleString();

  const getStateActionHeader = () => {
    const roundState = selectedRoundState?.roundState
      ? selectedRoundState.roundState
      : "Open";
    if (roundState === "Open") {
      return "Auction Starts In";
    } else if (roundState === "Auctioning") {
      return "Auction Ends In";
    } else if (roundState === "Running") {
      return "Round Ends In";
    } else {
      return "Round Ended";
    }
  };

  const getTimeUntilNextStateTransition = () => {
    const round = selectedRoundState
      ? selectedRoundState
      : { auctionStartDate: "0", auctionEndDate: "0", optionSettleDate: "0" };
    const roundState = selectedRoundState?.roundState
      ? selectedRoundState.roundState
      : "Open";

    let targetDate: string | number | bigint = "0";

    if (roundState === "Open") {
      targetDate = round.auctionStartDate;
    } else if (roundState === "Auctioning") {
      targetDate = round.auctionEndDate;
    } else {
      targetDate = round.optionSettleDate;
    }

    targetDate = targetDate ? targetDate : "0";
    return timeUntilTarget(Number(timestamp).toString(), targetDate.toString());
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

  //  const [isClient, setIsClient] = useState(false);
  //  useEffect(() => {
  //    setIsClient(true);
  //  }, []);

  const roundState = selectedRoundState?.roundState.toString() || "Open";
  const styles = stateStyles[roundState] || stateStyles.Default;

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
                className={`${
                  isPanelOpen ? "flex" : "hidden"
                } font-medium flex items-center`}
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
                  {vaultState
                    ? parseFloat(
                        formatEther(
                          (
                            num.toBigInt(vaultState.lockedBalance.toString()) +
                            num.toBigInt(
                              vaultState.unlockedBalance.toString(),
                            ) +
                            num.toBigInt(vaultState.stashedBalance.toString())
                          ).toString(),
                        ),
                      ).toFixed(0)
                    : 0}
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
                      stashed: vaultState
                        ? vaultState.stashedBalance.toString()
                        : "0",
                    }}
                  >
                    {
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
                  </BalanceTooltip>
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
                      ? `${selectedRoundState.roundId.toString().length == 1 ? "0" : ""}${selectedRoundState.roundId}`
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
              {(roundState === "Open" || roundState == "Auctioning") && (
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
              {roundState === "Settled" && (
                <div className="max-h-full flex flex-row justify-between items-center   p-2 w-full">
                  <p className="text-[#BFBFBF]">Round Perf.</p>
                  <p>
                    {selectedRoundState
                      ? userType == "lp"
                        ? selectedRoundState.performanceLP
                        : selectedRoundState.performanceOB
                      : 0}
                    %
                  </p>
                </div>
              )}

              <div className="max-h-full flex flex-row justify-between items-center   p-2 w-full">
                <p className="text-[#BFBFBF]">Cap Level</p>
                <p>
                  {
                    selectedRoundState?.capLevel
                      ? (
                          (100 *
                            parseInt(selectedRoundState.capLevel.toString())) /
                          10_000
                        ).toFixed(2)
                      : "" //Add round duration from state here
                  }
                  %
                </p>
              </div>
              <div className="max-h-full flex flex-row justify-between items-center p-2 w-full">
                <p className="text-[#BFBFBF]">Strike Price</p>
                <p>
                  {
                    selectedRoundState?.strikePrice &&
                      Number(
                        formatUnits(
                          selectedRoundState.strikePrice.toString(),
                          "gwei",
                        ),
                      ).toFixed(2)
                    //Add round duration from state here
                  }{" "}
                  GWEI
                </p>
              </div>

              {roundState == "Auctioning" && (
                <>
                  <div className="max-h-full flex flex-row justify-between items-center   p-2 w-full">
                    <p className="text-[#BFBFBF] font-regular text-[14px]">
                      Reserve Price
                    </p>
                    <p>
                      {
                        selectedRoundState?.reservePrice &&
                          Number(
                            formatUnits(
                              selectedRoundState.reservePrice.toString(),
                              "gwei",
                            ),
                          ).toFixed(2)
                        //Add round duration from state here
                      }{" "}
                      GWEI
                    </p>
                  </div>
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

              {roundState == "Running" && (
                <>
                  <div className="max-h-full flex flex-row justify-between items-center   p-2 w-full">
                    <p className="text-[#BFBFBF]">Clearing Price</p>
                    <p>
                      {selectedRoundState?.clearingPrice &&
                        Number(
                          formatUnits(
                            selectedRoundState.clearingPrice.toString(),
                            "gwei",
                          ),
                        ).toFixed(2)}{" "}
                      GWEI
                    </p>
                  </div>
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
                </>
              )}

              {roundState == "Settled" && (
                <>
                  <div className="max-h-full flex flex-row justify-between items-center   p-2 w-full">
                    <p className="text-[#BFBFBF]">Clearing Price</p>
                    <p>
                      {selectedRoundState?.clearingPrice &&
                        Number(
                          formatUnits(
                            selectedRoundState.clearingPrice.toString(),
                            "gwei",
                          ),
                        ).toFixed(2)}{" "}
                      GWEI
                    </p>
                  </div>
                  <div className="max-h-full flex flex-row justify-between items-center   p-2 w-full">
                    <p className="text-[#BFBFBF]">Settlement Price</p>
                    <p>
                      {selectedRoundState?.settlementPrice &&
                        Number(
                          formatUnits(
                            selectedRoundState.settlementPrice.toString(),
                            "gwei",
                          ),
                        ).toFixed(2)}{" "}
                      GWEI
                    </p>
                  </div>
                  <div className="max-h-full flex flex-row justify-between items-center   p-2 w-full">
                    <p className="text-[#BFBFBF]">Payout</p>
                    <p>
                      {selectedRoundState?.payoutPerOption &&
                        Number(
                          formatUnits(
                            selectedRoundState.payoutPerOption.toString(),
                            "gwei",
                          ),
                        ).toFixed(2)}{" "}
                      GWEI
                    </p>
                  </div>
                </>
              )}
              <div className="max-h-full flex flex-row justify-between items-center   p-2 w-full">
                <p className="text-[#BFBFBF]">{getStateActionHeader()}</p>
                <p>{getTimeUntilNextStateTransition()}</p>
              </div>
            </div>
          </div>
          <div
            className={`${isPanelOpen && roundState !== "Settled" ? "border border-transparent border-t-[#262626]" : ""} flex flex-col w-[100%] mx-[auto] mt-[auto] mb-[1rem]`}
          >
            <StateTransition
              isPanelOpen={isPanelOpen}
              setModalState={setModalState}
            />
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
