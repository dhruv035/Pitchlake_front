import React, { useState } from "react";
import {
  LiquidityProviderStateType,
  VaultStateType,
  WithdrawLiquidityArgs,
} from "@/lib/types";
import InputField from "@/components/Vault/Utils/InputField";
import { ChevronDown } from "lucide-react";
import ActionButton from "@/components/Vault/Utils/ActionButton";
import { formatEther, parseEther } from "ethers";
import { useProtocolContext } from "@/context/ProtocolProvider";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEthereum } from "@fortawesome/free-brands-svg-icons";

interface WithdrawLiquidityProps {
  showConfirmation: (
    modalHeader: string,
    action: string,
    onConfirm: () => Promise<void>,
  ) => void;
}

const WithdrawLiquidity: React.FC<WithdrawLiquidityProps> = ({
  showConfirmation,
}) => {
  const { lpState, vaultActions } = useProtocolContext();
  const [state, setState] = useState({
    amount: "0",
  });

  const updateState = (updates: Partial<typeof state>) => {
    setState((prevState: typeof state) => ({ ...prevState, ...updates }));
  };

  const liquidityWithdraw = async (): Promise<void> => {
    await vaultActions.withdrawLiquidity({ amount: parseEther(state.amount) });
  };

  const handleSubmit = () => {
    showConfirmation(
      "Liquidity Withdraw",
      `withdraw ${state.amount} ETH from your unlocked balance?`,
      liquidityWithdraw,
    );
  };

  const isWithdrawDisabled = (): boolean => {
    // No negatives
    if (Number(state.amount) <= Number(0)) {
      return true;
    }

    // No more than unlocked balance
    let unlockedBalance = lpState?.unlockedBalance
      ? lpState.unlockedBalance
        ? parseFloat(
            Number(formatEther(lpState.unlockedBalance.toString())).toString(),
          )
        : 0.0
      : 0.0;

    if (Number(state.amount) > unlockedBalance) {
      return true;
    }

    return false;
  };

  return (
    <>
      <div className="flex flex-col space-y-5 px-6 mb-[auto]">
        <div>
          <InputField
            type="number"
            value={state.amount || ""}
            label="Enter Amount"
            onChange={(e) => {
              const value = e.target.value;
              const formattedValue = value.includes(".")
                ? value.slice(0, value.indexOf(".") + 19)
                : value;

              updateState({ amount: formattedValue });
            }}
            placeholder="e.g. 5.0"
            icon={
              <FontAwesomeIcon
                icon={faEthereum}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pr-2"
              />
            }
          />
        </div>
      </div>
      <div className="flex flex-col h-[full] mt-[auto]">
        <div className="px-6 flex justify-between text-sm mb-6 mt-auto">
          <span className="text-gray-400">Unlocked Balance</span>
          <span className="text-white">
            {formatEther(lpState?.unlockedBalance?.toString() || "0")} ETH
          </span>
        </div>
        <div className="mt-[auto] flex justify-between text-sm border-t border-[#262626] p-6">
          <ActionButton
            onClick={handleSubmit}
            disabled={isWithdrawDisabled()}
            text="Withdraw"
          />
        </div>
      </div>
    </>
  );
};

export default WithdrawLiquidity;
