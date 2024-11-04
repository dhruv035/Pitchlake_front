import React, { useState, ReactNode, useEffect } from "react";
import InputField from "@/components/Vault/Utils/InputField";
import { Layers3, Currency } from "lucide-react";
import ActionButton from "@/components/Vault/Utils/ActionButton";
import { PlaceBidArgs } from "@/lib/types";
import { useProtocolContext } from "@/context/ProtocolProvider";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEthereum } from "@fortawesome/free-brands-svg-icons";
import { formatUnits, parseUnits, formatEther } from "ethers";
import { useAccount } from "@starknet-react/core";
import useERC20 from "@/hooks/erc20/useERC20";
import { num } from "starknet";
import { formatNumberText } from "@/lib/utils";

interface PlaceBidProps {
  showConfirmation: (
    modalHeader: string,
    action: ReactNode,
    onConfirm: () => Promise<void>,
  ) => void;
}

const PlaceBid: React.FC<PlaceBidProps> = ({ showConfirmation }) => {
  const { vaultState, roundActions, selectedRoundState } = useProtocolContext();
  const { account } = useAccount();
  const [state, setState] = useState({
    bidAmount: "",
    bidPrice: "",
    balance: 0,
    isButtonDisabled: true,
    isAmountOk: "",
    isPriceOk: "",
  });
  const { allowance, approve } = useERC20(
    vaultState?.ethAddress,
    selectedRoundState?.address,
    account,
  );

  useEffect(() => {
    // Check amount
    let amountReason = "";
    if (state.bidAmount == "") {
    } else if (Number(state.bidAmount) < 0) {
      amountReason = "Amount must be positive";
    } else if (Number(state.bidAmount) == 0) {
      amountReason = "Amount must be greater than 0";
    }

    // Check price
    let priceReason = "";
    const reservePriceGwei = formatUnits(
      selectedRoundState ? selectedRoundState.reservePrice : 0,
      "gwei",
    );
    if (state.bidPrice == "") {
    } else if (Number(state.bidPrice) < 0) {
      priceReason = "Price must be positive";
    } else if (Number(state.bidPrice) < Number(reservePriceGwei)) {
      priceReason = "Price must be at least the reserve price";
    }

    const isButtonDisabled = !state.bidAmount || !state.bidPrice;
    setState((prevState) => ({
      ...prevState,
      isButtonDisabled,
      isAmountOk: amountReason,
      isPriceOk: priceReason,
    }));
  }, [state.bidAmount, state.bidPrice]);

  const updateState = (updates: Partial<typeof state>) => {
    setState((prevState) => ({ ...prevState, ...updates }));
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const value = e.target.value;

    // Allow only digits
    // Allow only digits using a regular expression
    if (/^\d*$/.test(value)) {
      updateState({ bidAmount: value }); // Update state only if input is a valid integer
    }
    //    updateState({ bidAmount: e.target.value });
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const value = e.target.value;

    const formattedValue = value.includes(".")
      ? value.slice(0, value.indexOf(".") + 10)
      : value;

    updateState({ bidPrice: formattedValue });
  };

  const handlePlaceBid = async (): Promise<void> => {
    /// Update allowance if needed
    const priceWei = Number(parseUnits(state.bidPrice, "gwei"));
    const amount = Number(state.bidAmount);
    const totalWei = priceWei * amount;
    if (Number(allowance) < Number(totalWei)) {
      await approve({
        amount: num.toBigInt(totalWei),
        spender: selectedRoundState?.address
          ? selectedRoundState.address.toString()
          : "",
      });
    }

    await roundActions?.placeBid({
      amount: BigInt(state.bidAmount),
      price: parseUnits(state.bidPrice, "gwei"),
    });
  };

  const bidPriceWei = parseUnits(state.bidPrice ? state.bidPrice : "0", "gwei");
  const bidPriceEth = formatEther(bidPriceWei);
  const bidPriceGwei = formatUnits(bidPriceWei, "gwei");
  const bidAmount = state.bidAmount ? state.bidAmount : "0";
  const bidTotalEth = Number(bidPriceEth) * Number(bidAmount);

  const handleSubmit = () => {
    showConfirmation(
      "Bid",
      <>
        bid
        <br />
        <span className="font-semibold text-[#fafafa]">
          {bidPriceGwei} GWEI{" "}
        </span>{" "}
        per
        <br />
        <span className="font-semibold text-[#fafafa]">
          {formatNumberText(Number(bidAmount))} options
        </span>
        , totaling
        <br />
        <span className="font-semibold text-[#fafafa]">{bidTotalEth} ETH</span>?
      </>,

      handlePlaceBid,
    );
  };

  const balance = 0;

  return (
    <div className="flex flex-col h-full">
      <div className="flex-grow space-y-6 p-6">
        <InputField
          label="Enter Amount"
          type="integer"
          //value={state.bidAmount}
          value={state.bidAmount}
          onChange={handleAmountChange}
          placeholder="e.g. 5"
          icon={
            <Layers3
              size="20px"
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 stroke-[1px]"
            />
          }
          error={state.isAmountOk}
        />
        <InputField
          label="Enter Price"
          type="number"
          value={state.bidPrice}
          onChange={handlePriceChange}
          placeholder="e.g. 0.3"
          icon={
            <FontAwesomeIcon
              icon={faEthereum}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pr-2"
            />
          }
          error={state.isPriceOk}
          //          icon={
          //            <Currency className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400" />
          //          }
        />
      </div>
      <div className="flex justify-between text-sm px-6 pb-1">
        <span className="text-gray-400">Total</span>
        <span>{bidTotalEth.toFixed(2)} ETH</span>
      </div>
      <div className="flex justify-between text-sm px-6 pb-6">
        <span className="text-gray-400">Balance</span>
        <span>{balance.toFixed(2)} ETH</span>
      </div>
      <div className="mt-auto">
        <div className="px-6 flex justify-between text-sm mb-6 pt-6 border-t border-[#262626]">
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
