import React from "react";
import { VaultStateType } from "@/lib/types";
import ActionButton from "@/components/Vault/Utils/ActionButton";
import collect from "@/../public/collect.svg";

interface WithdrawCollectProps {
  vaultState: VaultStateType;
  showConfirmation: (amount: string, action: string) => void;
}

const WithdrawCollect: React.FC<WithdrawCollectProps> = ({
  vaultState,
  showConfirmation,
}) => {
  const [state, setState] = React.useState({
    isButtonDisabled: true,
  });

  const updateState = (updates: Partial<typeof state>) => {
    setState((prevState) => ({ ...prevState, ...updates }));
  };

  const handleSubmit = () => {};

  return (
    <div className="flex flex-col h-full">
      <div className="flex-grow space-y-6">
        <div className="flex items-center justify-center">
          <div className="bg-[#1E1E1E] rounded-lg p-4">
            <img
              src={collect}
              alt="Collect icon"
              className="w-16 h-16 mx-auto"
            />
          </div>
        </div>
        <p className="text-gray-400 text-center">
          Your current stashed balance is
        </p>
        <p className="text-2xl font-bold text-center">
          {vaultState.stakedBalance?.toString() || "0"} ETH
        </p>
      </div>
      <div className="mt-auto">
        <div className="flex justify-between text-sm mb-4 pt-4 border-t border-[#262626]">
          <ActionButton
            onClick={handleSubmit}
            disabled={false}
            text="Collect"
          />
        </div>
      </div>
    </div>
  );
};

export default WithdrawCollect;
