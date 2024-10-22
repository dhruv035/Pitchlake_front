import React, { useState, useEffect } from "react";
import InputField from "@/components/Vault/Utils/InputField";
import { Layers3, Currency } from "lucide-react";
import ActionButton from "@/components/Vault/Utils/ActionButton";
import { PlaceBidArgs } from "@/lib/types";
import { useProtocolContext } from "@/context/ProtocolProvider";

interface PlaceBidProps {
  showConfirmation: (
    modalHeader: string,
    action: string,
    onConfirm: () => Promise<void>
  ) => void;
}

const PlaceBid: React.FC<PlaceBidProps> = ({ showConfirmation }) => {
  const [state, setState] = useState({
    bidAmount: "",
    bidPrice: "",
    balance: 0,
    isButtonDisabled: true,
  });

  const {roundActions} = useProtocolContext();
  useEffect(() => {
    const isButtonDisabled = !state.bidAmount || !state.bidPrice;
    setState((prevState) => ({ ...prevState, isButtonDisabled }));
  }, [state.bidAmount, state.bidPrice]);

  const updateState = (updates: Partial<typeof state>) => {
    setState((prevState) => ({ ...prevState, ...updates }));
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    updateState({ bidAmount: e.target.value });
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    updateState({ bidPrice: e.target.value });
  };

  const handlePlaceBid = async (): Promise<void> => {
    await roundActions?.placeBid({
      amount: BigInt(state.bidAmount),
      price: BigInt(state.bidPrice),
    });
  };

  const handleSubmit = () => {
    console.log("Place Bid confirmation");
    showConfirmation(
      "Bid",
      `bid for ${state.bidAmount} options at ${
        state.bidPrice
      } ETH each, for a total of ${
        Number(state.bidAmount) * Number(state.bidPrice)
      } ETH?`,
      handlePlaceBid
    );
  };

  const total = parseFloat(state.bidAmount) * parseFloat(state.bidPrice) || 0;
  const balance = 0;

  return (
    <div className="flex flex-col h-full">
      <div className="flex-grow space-y-6">
        <InputField
          label="Enter Amount"
          type="number"
          value={state.bidAmount}
          onChange={handleAmountChange}
          placeholder="e.g. 5"
          icon={
            <Layers3 className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400" />
          }
        />
        <InputField
          label="Enter Price"
          type="number"
          value={state.bidPrice}
          onChange={handlePriceChange}
          placeholder="e.g. 0.3"
          icon={
            <Currency className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400" />
          }
        />
      </div>
      <div className="flex justify-between text-sm">
        <span className="text-gray-400">Total</span>
        <span>{total.toFixed(2)} ETH</span>
      </div>
      <div className="flex justify-between text-sm">
        <span className="text-gray-400">Balance</span>
        <span>{balance.toFixed(2)} ETH</span>
      </div>
      <div className="mt-auto">
        <div className="flex justify-between text-sm mb-4 pt-4 border-t border-[#262626]">
          <ActionButton
            onClick={handleSubmit}
            disabled={state.isButtonDisabled}
            text="Place Bid"
          />
        </div>
      </div>
    </div>
  );
};

export default PlaceBid;
