import React, { useState } from "react";
import { useAccount } from "@starknet-react/core";
import { useTransactionContext } from "@/context/TransactionProvider";
import useERC20 from "@/hooks/erc20/useERC20";
import { VaultStateType } from "@/lib/types";
import InputField from "@/components/Vault/Utils/InputField";
import { ChevronDown, User } from "lucide-react";
import ActionButton from "@/components/Vault/Utils/ActionButton";

interface DepositProps {
  vaultState: VaultStateType;
  showConfirmation: (amount: string, action: string) => void;
}

const Deposit: React.FC<DepositProps> = ({ vaultState, showConfirmation }) => {
  const [state, setState] = useState({
    amount: "",
    isDepositAsBeneficiary: false,
    beneficiaryAddress: "",
  });

  const { account } = useAccount();
  const { isDev, devAccount } = useTransactionContext();
  const { balance } = useERC20(vaultState.ethAddress, vaultState.address);

  const updateState = (updates: Partial<typeof state>) => {
    setState((prevState) => ({ ...prevState, ...updates }));
  };

  const handleSubmit = () => {
    showConfirmation(state.amount, "Deposit");
  };

  const isDepositDisabled = (): boolean => {
    if (state.isDepositAsBeneficiary) {
      return (
        BigInt(state.amount) <= 0 || state.beneficiaryAddress.trim() === ""
      );
    }
    return BigInt(state.amount) <= 0;
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-grow space-y-6">
        <div className="flex space-x-2">
          <button
            className={`py-2 px-4 rounded border border-[#373632] ${
              !state.isDepositAsBeneficiary
                ? "bg-[#373632] text-[#F5EBB8]"
                : "bg-[#121212] text-[#BFBFBF]"
            }`}
            onClick={() =>
              updateState({
                isDepositAsBeneficiary: false,
                beneficiaryAddress: "",
              })
            }
          >
            For Myself
          </button>
          <button
            className={`py-2 px-4 rounded border border-[#373632] ${
              state.isDepositAsBeneficiary
                ? "bg-[#373632] text-[#F5EBB8]"
                : "bg-[#121212] text-[#BFBFBF]"
            }`}
            onClick={() => updateState({ isDepositAsBeneficiary: true })}
          >
            As Beneficiary
          </button>
        </div>

        {state.isDepositAsBeneficiary && (
          <div>
            <InputField
              type="text"
              value={state.beneficiaryAddress}
              label="Enter Address"
              onChange={(e) =>
                updateState({ beneficiaryAddress: e.target.value })
              }
              placeholder="Depositor's Address"
              icon={
                <User className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400" />
              }
            />
          </div>
        )}

        <div>
          <InputField
            type="number"
            value={state.amount}
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
        <div className="flex justify-between text-sm mb-4 pt-4">
          <span className="text-gray-400">Unlocked Balance</span>
          <span className="text-white">{balance.toString()} ETH</span>
        </div>
        <div className="flex justify-between text-sm mb-4 pt-4 border-t border-[#262626]">
          <ActionButton
            onClick={handleSubmit}
            disabled={isDepositDisabled()}
            text="Deposit"
          />
        </div>
      </div>
    </div>
  );
};

export default Deposit;
