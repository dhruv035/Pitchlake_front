import React, { useState } from "react";
import {
  LiquidityProviderStateType,
  VaultStateType,
  WithdrawArgs,
} from "@/lib/types";
import InputField from "@/components/Vault/Utils/InputField";
import { ChevronDown } from "lucide-react";
import ActionButton from "@/components/Vault/Utils/ActionButton";
import { formatEther, parseEther } from "ethers";

interface WithdrawLiquidityProps {
  vaultState: VaultStateType;
  lpState: LiquidityProviderStateType;
  withdraw: (withdrawArgs: WithdrawArgs) => Promise<void>;
  showConfirmation: (
    modalHeader: string,
    action: string,
    onConfirm: () => Promise<void>,
  ) => void;
}

const WithdrawLiquidity: React.FC<WithdrawLiquidityProps> = ({
  vaultState,
  lpState,
  showConfirmation,
  withdraw,
}) => {
  const [state, setState] = useState({
    amount: "0",
  });

  const updateState = (updates: Partial<typeof state>) => {
    setState((prevState: typeof state) => ({ ...prevState, ...updates }));
  };

  const liquidityWithdraw = async (): Promise<void> => {
    await withdraw({ amount: parseEther(state.amount) });
    console.log("queue withdraw", state.amount);
  };

  const handleSubmit = () => {
    console.log("Collect confirmation");
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
    let unlockedBalance = lpState.unlockedBalance
      ? parseFloat(
          Number(formatEther(lpState.unlockedBalance.toString())).toString(),
        )
      : 0.0;

    console.log("unlockedBalance as float", unlockedBalance);

    if (Number(state.amount) > unlockedBalance) {
      return true;
    }

    return false;

    const amount = state.amount ? BigInt(state.amount) : BigInt(0);
    return amount <= BigInt(0);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-grow space-y-6">
        <div>
          <InputField
            type="number"
            value={state.amount || ""}
            label="Enter Amount"
            onChange={(e) => updateState({ amount: e.target.value })}
            placeholder="e.g. 5.0"
            //icon={
            //  <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400" />
            //}
          />
        </div>
      </div>

      <div className="mt-auto">
        <div className="flex justify-between text-sm mb-4">
          <span className="text-gray-400">Unlocked Balance</span>
          <span className="text-white">
            {formatEther(lpState.unlockedBalance?.toString()) || "0"} ETH
          </span>
        </div>
        <div className="flex justify-between text-sm mb-4 pt-4 border-t border-[#262626]">
          <ActionButton
            onClick={handleSubmit}
            disabled={isWithdrawDisabled()}
            text="Withdraw"
          />
        </div>
      </div>
    </div>
  );
};

export default WithdrawLiquidity;
