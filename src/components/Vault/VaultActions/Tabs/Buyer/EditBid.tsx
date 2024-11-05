import React, { useState, ReactNode, useEffect } from "react";
import { ChevronLeft } from "lucide-react";
import ActionButton from "@/components/Vault/Utils/ActionButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEthereum } from "@fortawesome/free-brands-svg-icons";
import InputField from "@/components/Vault/Utils/InputField";
import { LayerStackIcon } from "@/components/Icons";
import { formatUnits, parseUnits, formatEther } from "ethers";
import { useProtocolContext } from "@/context/ProtocolProvider";
import { num } from "starknet";
import useERC20 from "@/hooks/erc20/useERC20";
import { useAccount } from "@starknet-react/core";
import { useTransactionContext } from "@/context/TransactionProvider";

interface EditModalProps {
  onConfirm: () => void;
  onClose: () => void;
  showConfirmation: (
    modalHeader: string,
    action: ReactNode,
    onConfirm: () => Promise<void>,
  ) => void;
  bidToEdit: any;
}

const LOCAL_STORAGE_KEY = "editBidPriceGwei";

const EditModal: React.FC<EditModalProps> = ({
  onConfirm,
  onClose,
  showConfirmation,
  bidToEdit,
}) => {
  const { account } = useAccount();
  const { pendingTx } = useTransactionContext();
  const bid = bidToEdit
    ? bidToEdit.item
    : { amount: "0", price: "0", bid_id: "" };
  const bidId = bid.bid_id;
  const oldAmount = num.toBigInt(bid.amount);
  const oldPriceWei = num.toBigInt(bid.price);

  const oldPriceGwei = formatUnits(oldPriceWei, "gwei");

  const { roundActions, vaultState, selectedRoundState } = useProtocolContext();
  const { allowance, approve, balance } = useERC20(
    vaultState?.ethAddress,
    selectedRoundState?.address,
    account,
  );

  const [needsApproval, setNeedsApproval] = useState<string>("0");
  const [state, setState] = useState({
    newPriceGwei: localStorage.getItem(LOCAL_STORAGE_KEY) || "",
    isButtonDisabled: true,
    error: "",
  });

  const updateState = (updates: Partial<typeof state>) => {
    setState((prevState) => ({ ...prevState, ...updates }));
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const value = e.target.value;
    const formattedValue = value.includes(".")
      ? value.slice(0, value.indexOf(".") + 10)
      : value;

    updateState({ newPriceGwei: formattedValue });
  };

  const stringGweiToWei = (gwei: string): bigint => {
    return parseUnits(gwei ? gwei : "0", "gwei");
  };

  const getPriceIncreaseWei = (): bigint => {
    const newPriceWei = stringGweiToWei(state.newPriceGwei);
    if (newPriceWei <= oldPriceWei) return num.toBigInt(0);
    else return newPriceWei - oldPriceWei;
  };

  const getTotalNewCostWei = (): bigint => {
    return num.toBigInt(oldAmount) * getPriceIncreaseWei();
  };

  const getTotalNewCostEth = (): string => {
    return formatUnits(getTotalNewCostWei(), "ether");
  };

  const handleApprove = async (): Promise<void> => {
    /// Update allowance if needed
    const cost = num.toBigInt(getTotalNewCostWei());
    if (num.toBigInt(allowance) < cost) {
      await approve({
        amount: num.toBigInt(cost),
        spender: selectedRoundState?.address ? selectedRoundState.address : "",
      });
    }
  };

  const handleEditBid = async (): Promise<void> => {
    await roundActions?.updateBid({
      bidId,
      priceIncrease: getPriceIncreaseWei(),
    });
    setState((prevState) => ({ ...prevState, newPriceGwei: "" }));
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    onClose();
  };

  const handleSubmitForEdit = async () => {
    showConfirmation(
      "Update Bid",
      <>
        Update your bid? You will be spending an additional
        <br />
        <span className="font-semibold text-[#fafafa]">
          {getTotalNewCostEth()} ETH
        </span>
      </>,
      async () => {
        await handleEditBid();
        onClose();
      },
    );
  };

  const handleSubmitForApproval = () => {
    showConfirmation(
      "Approve",
      <>
        approve this vault to transfer
        <br />
        <span className="font-semibold text-[#fafafa]">
          {formatEther(needsApproval)} ETH{" "}
        </span>{" "}
      </>,
      async () => {
        await handleApprove();
      },
    );
  };

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, state.newPriceGwei);
  }, [state.newPriceGwei]);

  const isButtonDisabled = (): boolean => {
    if (!account) return true;
    if (pendingTx) return true;
    if (!state.newPriceGwei) return true;
    if (state.newPriceGwei === oldPriceGwei) return true;

    return false;
  };

  useEffect(() => {
    let error = "";
    const newPriceGwei = state.newPriceGwei;
    if (!newPriceGwei || !oldPriceGwei) {
      error = "";
    } else if (parseFloat(newPriceGwei) <= parseFloat(oldPriceGwei)) {
      error = "New price must be greater than current";
    }
    const cost = num.toBigInt(getTotalNewCostWei());
    //const isButtonDisabled = !newPriceGwei || newPriceGwei <= oldPriceGwei;

    updateState({ error, isButtonDisabled: isButtonDisabled() });
    setNeedsApproval(
      num.toBigInt(allowance) < num.toBigInt(cost) ? cost.toString() : "0",
    );
  }, [
    state.newPriceGwei,
    oldPriceGwei,
    account,
    allowance,
    selectedRoundState?.address,
  ]);

  return (
    <div className="bg-[#121212] border border-[#262626] rounded-xl p-0 w-full flex flex-col h-full">
      <div className="flex items-center p-4">
        <button
          onClick={onClose}
          className="flex justify-center items-center mr-4 w-[44px] h-[44px] rounded-lg border-[1px] border-[#262626] bg-[#0D0D0D]"
        >
          <ChevronLeft className="size-[16px] stroke-[4px] text-[#F5EBB8]" />
        </button>
        <h2 className="text-[#FAFAFA] text-[16px] font-medium text-md">
          Edit Bid
        </h2>
      </div>

      <div className="flex flex-col h-full">
        <div className="flex-grow space-y-6 pt-2 px-4">
          <div>
            <InputField
              type="number"
              value={""}
              label="Current Amount"
              onChange={(_e) => {}}
              placeholder={oldAmount.toString()}
              disabled={true}
              className="text-[#8c8c8c] bg-[#161616] border-[#262626]"
              icon={
                <LayerStackIcon
                  stroke="#8C8C8C"
                  fill="transparent"
                  classname="absolute right-2 top-1/2 -translate-y-1/2"
                />
              }
            />
          </div>
          <div>
            <InputField
              type="number"
              value={state.newPriceGwei}
              label="Enter Price"
              label2={`Current: ${oldPriceGwei} GWEI`}
              onChange={handlePriceChange}
              placeholder={`e.g. ${oldPriceGwei}`}
              icon={
                <FontAwesomeIcon
                  icon={faEthereum}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400"
                />
              }
              error={state.error}
            />
          </div>
        </div>
      </div>

      <div className="flex justify-between text-sm px-6 pb-1">
        <span className="text-gray-400">Total</span>
        <span>{parseFloat(getTotalNewCostEth()).toFixed(6)} ETH</span>
      </div>
      <div className="flex justify-between text-sm px-6 pb-6">
        <span className="text-gray-400">Balance</span>
        <span>
          {parseFloat(formatEther(num.toBigInt(balance))).toFixed(3)} ETH
        </span>
      </div>
      <div className="mt-auto">
        <div className="px-6 flex justify-between text-sm mb-6 pt-6 border-t border-[#262626]">
          {num.toBigInt(needsApproval) > 0 ? (
            <ActionButton
              onClick={handleSubmitForApproval}
              disabled={state.isButtonDisabled}
              text="Approve"
            />
          ) : (
            <ActionButton
              onClick={handleSubmitForEdit}
              disabled={state.isButtonDisabled}
              text="Edit Bid"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default EditModal;
