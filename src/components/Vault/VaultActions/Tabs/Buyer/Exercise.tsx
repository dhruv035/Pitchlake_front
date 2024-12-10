import React, { ReactNode, useState, useEffect } from "react";
import { formatEther, parseEther } from "ethers";
import InputField from "@/components/Vault/Utils/InputField";
import { ExerciseOptionsIcon } from "@/components/Icons";
import ActionButton from "@/components/Vault/Utils/ActionButton";
import { PlaceBidArgs } from "@/lib/types";
import { useProtocolContext } from "@/context/ProtocolProvider";
import { useAccount } from "@starknet-react/core";
import { RepeatEthIcon } from "@/components/Icons";
import { formatNumberText } from "@/lib/utils";
import { num } from "starknet";
import { useTransactionContext } from "@/context/TransactionProvider";
import useERC20 from "@/hooks/erc20/useERC20";

interface ExerciseProps {
  showConfirmation: (
    modalHeader: string,
    action: ReactNode,
    onConfirm: () => Promise<void>,
  ) => void;
}

const Exercise: React.FC<ExerciseProps> = ({ showConfirmation }) => {
  const { address, account } = useAccount();
  const {
    roundActions,
    selectedRoundBuyerState,
    selectedRoundState,
    vaultAddress,
  } = useProtocolContext();
  const { pendingTx } = useTransactionContext();

  const { balance } = useERC20(selectedRoundState?.address);
  const totalOptions =
    selectedRoundBuyerState?.mintableOptions &&
    selectedRoundBuyerState.hasMinted === false
      ? BigInt(selectedRoundBuyerState.mintableOptions.toString()) +
        BigInt(balance)
      : BigInt(balance);
  const payoutBalanceWei = selectedRoundState?.payoutPerOption
    ? totalOptions * BigInt(selectedRoundState?.payoutPerOption.toString())
    : "0";
  const payoutBalanceEth = formatEther(payoutBalanceWei);

  const handleExerciseOptions = async (): Promise<void> => {
    address && (await roundActions?.exerciseOptions());
  };

  const handleSubmit = () => {
    showConfirmation(
      "Exercise",
      <>
        exercise{" "}
        <span className="font-semibold text-[#fafafa]">
          {formatNumberText(Number(totalOptions.toString()))}
        </span>{" "}
        options for{" "}
        <span className="font-semibold text-[#fafafa]">
          {Number(payoutBalanceEth).toFixed(3)} ETH
        </span>
      </>,
      handleExerciseOptions,
    );
  };

  const isButtonDisabled = (): boolean => {
    if (!account) return true;
    if (pendingTx) return true;
    if (!selectedRoundBuyerState) return true;
    if (Number(payoutBalanceWei) === 0) return true;

    return false;
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-col flex-grow space-y-6 items-center justify-center">
        <ExerciseOptionsIcon
          classname={
            "w-[92px] h-[92px] rounded-2xl bg-icon-gradient border-[1px] border-greyscale-800 flex flex-row justify-center items-center"
          }
        />
        <p className="max-w-[290px] text-[#bfbfbf] text-center">
          You currently have{" "}
          <span className="font-semibold text-[#fafafa]">
            {totalOptions
              ? formatNumberText(Number(totalOptions.toString()))
              : 0}
          </span>{" "}
          options worth
          <br />{" "}
          <span className="font-semibold text-[#fafafa]">
            {" "}
            {Number(payoutBalanceEth).toFixed(3)} ETH
          </span>
        </p>
      </div>

      <div className="mt-auto">
        <div className="px-6 flex justify-between text-sm mb-6 pt-6 border-t border-[#262626]">
          <ActionButton
            onClick={handleSubmit}
            disabled={isButtonDisabled()}
            text="Exercise Now"
          />
        </div>
      </div>
    </div>
  );
};

export default Exercise;
