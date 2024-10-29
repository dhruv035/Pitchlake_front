import React from "react";
import { VaultStateType, LiquidityProviderStateType } from "@/lib/types";
import ActionButton from "@/components/Vault/Utils/ActionButton";
import collect from "@/../public/collect.svg";
import { formatEther, parseEther } from "ethers";
import { useProtocolContext } from "@/context/ProtocolProvider";

interface WithdrawStashProps {
  //withdrawStash: () => Promise<void>;
  showConfirmation: (
    modalHeader: string,
    action: string,
    onConfirm: () => Promise<void>,
  ) => void;
}

const WithdrawStash: React.FC<WithdrawStashProps> = ({
  showConfirmation,
  //withdrawStash,
}) => {
  const { vaultState, lpState, vaultActions } = useProtocolContext();
  const [state, setState] = React.useState({
    isButtonDisabled: true,
  });

  const updateState = (updates: Partial<typeof state>) => {
    setState((prevState) => ({ ...prevState, ...updates }));
  };

  const withdrawStashedBalance = async (): Promise<void> => {
    console.log(
      "Collecting",
      formatEther(vaultState?.stashedBalance ? vaultState.stashedBalance : "0"),
    );
    await vaultActions.withdrawStash();

    // withdrawStash from vaultActions
  };

  const handleSubmit = () => {
    console.log("Collect confirmation");
    showConfirmation(
      "Collect Withdrawals",
      `claim your queued withdrawals of ${parseFloat(
        formatEther(
          lpState?.stashedBalance ? lpState.stashedBalance.toString() : "0",
        ),
      ).toFixed(3)} ETH`,
      withdrawStashedBalance,
    );
  };

  const isButtonDisabled = (): boolean => {
    // Only if stashed balance > 0
    if (
      Number(vaultState?.stashedBalance ? vaultState.stashedBalance : 0) > 0
    ) {
      return false;
    }
    return true;

    //if (vaultState.stashedBalance) {
    //  return false;
    //}

    //return false; // Button should be disabled is staked ETH is 0
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-col justify-center h-full align-center space-y-6">
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-center">
            <div className="bg-[#1E1E1E] rounded-lg p-4">
              <img
                src={collect}
                alt="Collect icon"
                className="w-16 h-16 mx-auto"
              />
            </div>
          </div>
          <p className="text-[#BFBFBF] text-center font-regular text-[14px]">
            Your current stashed balance is{" "}
            <b className="mt-0 text-[#FAFAFA] text-[14px] font-bold text-center">
              {lpState?.stashedBalance
                ? parseFloat(formatEther(lpState.stashedBalance.toString()))
                    .toFixed(3)
                    .toString()
                : "0"}{" "}
              ETH
            </b>
          </p>
        </div>
      </div>
      <div className="mt-auto">
        <div className="flex justify-between text-sm border-t border-[#262626] p-6">
          <ActionButton
            onClick={handleSubmit}
            disabled={isButtonDisabled()}
            text="Collect"
          />
        </div>
      </div>
    </div>
  );
};

export default WithdrawStash;
