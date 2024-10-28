import React, { useState, useEffect } from "react";
import InputField from "@/components/Vault/Utils/InputField";
import { Layers3, Currency } from "lucide-react";
import ActionButton from "@/components/Vault/Utils/ActionButton";
import { PlaceBidArgs } from "@/lib/types";
import { useProtocolContext } from "@/context/ProtocolProvider";
import { useAccount } from "@starknet-react/core";
import { RepeatEthIcon } from "@/components/Icons";

interface RefundProps {
  showConfirmation: (
    modalHeader: string,
    action: string,
    onConfirm: () => Promise<void>
  ) => void;
}

const Refund: React.FC<RefundProps> = ({ showConfirmation }) => {
  const { roundActions, selectedRoundBuyerState } = useProtocolContext();
  const { address } = useAccount();
  console.log("selectedRoundBuyerState",selectedRoundBuyerState)

  const handleRefundBid = async (): Promise<void> => {
    address && (await roundActions?.refundUnusedBids({ optionBuyer: address }));
  };

  const handleSubmit = () => {
    console.log("Place Bid confirmation");
    showConfirmation(
      "Refund",
      `Refund for ${selectedRoundBuyerState?.refundableBalance} ETH?`,
      handleRefundBid
    );
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-col flex-grow space-y-6 items-center justify-center">
        <div className="p-6 rounded-2xl bg-icon-gradient border-[1px] border-greyscale-800">
          <RepeatEthIcon />
          
        </div>
        <p>Your Refundable balance is {selectedRoundBuyerState?.refundableBalance} ETH</p>
      </div>
    
      <div className="mt-auto">
        <div className="flex justify-between text-sm mb-4 pt-4 border-t border-[#262626]">
          <ActionButton
            onClick={handleSubmit}
            disabled={
              !selectedRoundBuyerState ||
              Number(selectedRoundBuyerState.refundableBalance) === 0
            }
            text="Refund Now"
          />
        </div>
      </div>
    </div>
  );
};

export default Refund;
