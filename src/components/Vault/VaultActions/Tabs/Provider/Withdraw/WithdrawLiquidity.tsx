import React, { useState } from "react";
import { VaultStateType } from "@/lib/types";
import InputField from "@/components/Vault/Utils/InputField";
import { ChevronDown } from "lucide-react";
import ActionButton from "@/components/Vault/Utils/ActionButton";

interface WithdrawLiquidityProps {
  vaultState: VaultStateType;
  showConfirmation: (amount: string, action: string) => void;
}

const WithdrawLiquidity: React.FC<WithdrawLiquidityProps> = ({
  vaultState,
  showConfirmation,
}) => {
  const [state, setState] = useState({
    amount: "",
  });

  const updateState = (updates: Partial<typeof state>) => {
    setState((prevState: typeof state) => ({ ...prevState, ...updates }));
  };

  const handleSubmit = () => {
    if (state.amount) {
      showConfirmation(state.amount, "Withdraw");
    }
  };

  const isWithdrawDisabled = (): boolean => {
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
            placeholder="e.g. 5"
            icon={
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400" />
            }
          />
        </div>
      </div>

      <div className="mt-auto">
        <div className="flex justify-between text-sm mb-4">
          <span className="text-gray-400">Unlocked Balance</span>
          <span className="text-white">
            {vaultState.lpUnlockedAmount?.toString() || "0"} ETH
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
