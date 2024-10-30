import React, { useState, useEffect } from "react";
import InputField from "@/components/Vault/Utils/InputField";
import { Layers3, Currency, HammerIcon } from "lucide-react";
import ActionButton from "@/components/Vault/Utils/ActionButton";
import { PlaceBidArgs } from "@/lib/types";
import { useProtocolContext } from "@/context/ProtocolProvider";
import { useAccount } from "@starknet-react/core";
import { RepeatEthIcon } from "@/components/Icons";

interface MintProps {
  showConfirmation: (
    modalHeader: string,
    action: string,
    onConfirm: () => Promise<void>,
  ) => void;
}

const Mint: React.FC<MintProps> = ({ showConfirmation }) => {
  const { roundActions, selectedRoundBuyerState } = useProtocolContext();
  const { address } = useAccount();
  console.log("selectedRoundBuyerState", selectedRoundBuyerState);

  const handleMintOptions = async (): Promise<void> => {
    address && (await roundActions?.tokenizeOptions());
  };

  const handleSubmit = () => {
    console.log("Place Bid confirmation");
    showConfirmation(
      "Mint",
      `Mint options for ${selectedRoundBuyerState?.refundableBalance} ETH?`,
      handleMintOptions,
    );
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-col flex-grow space-y-6 items-center justify-center">
        <div className="p-6 rounded-2xl bg-icon-gradient border-[1px] border-greyscale-800">
          <HammerIcon />
        </div>
        <p>
          Your mintable token balance is{" "}
          {selectedRoundBuyerState?.refundableBalance}
        </p>
      </div>

      <div className="mt-auto">
        <div className="px-6 flex justify-between text-sm mb-6 pt-6 border-t border-[#262626]">
          <ActionButton
            onClick={handleSubmit}
            disabled={
              !selectedRoundBuyerState ||
              Number(selectedRoundBuyerState.tokenizableOptions) === 0
            }
            text="Mint Options"
          />
        </div>
      </div>
    </div>
  );
};

export default Mint;
