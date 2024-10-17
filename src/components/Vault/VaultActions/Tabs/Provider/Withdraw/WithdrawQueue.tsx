import React from "react";
import { VaultStateType } from "@/lib/types";
import ActionButton from "@/components/Vault/Utils/ActionButton";
import { useProtocolContext } from "@/context/ProtocolProvider";

interface WithdrawQueueProps {
  showConfirmation: (
    modalHeader: string,
    action: string,
    onConfirm: () => Promise<void>
  ) => void;
}

const WithdrawLiquidity: React.FC<WithdrawQueueProps> = ({
  showConfirmation,
}) => {
  const {vaultActions} = useProtocolContext();
  const [state, setState] = React.useState({
    percentage: 0,
    isButtonDisabled: true,
  });

  const updateState = (updates: Partial<typeof state>) => {
    setState((prevState) => ({ ...prevState, ...updates }));
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const value = parseInt(e.target.value);
    updateState({ percentage: value, isButtonDisabled: false });
  };

  const liquidityWithdraw = async (): Promise<void> => {
    console.log("queue withdraw", state.percentage);
  };

  const handleSubmit = () => {
    console.log("Collect confirmation");
    showConfirmation(
      "Liquidity Withdraw",
      `change the current queued withdrawal limit to ${state.percentage}% from 25%`, // TODO: Modify it to show the current percentage via the props
      liquidityWithdraw
    );
  };

  React.useEffect(() => {
    // Set the initial percentage to 25% and disable the button
    updateState({ percentage: 25, isButtonDisabled: true });
  }, []);

  return (
    <div className="flex flex-col h-full">
      <div className="flex-grow space-y-6">
        <label className="block text-sm font-medium text-gray-400 mb-2">
          Choose Percentage
        </label>
        <div className="flex items-center space-x-4">
          <div className="w-full h-10 bg-black border border-[#595959] rounded-md flex items-center px-5">
            <input
              type="range"
              min="0"
              max="100"
              value={state.percentage}
              onChange={handleSliderChange}
              className="w-full h-2 appearance-none bg-[#ADA478] rounded-full focus:outline-none 
                [&::-webkit-slider-thumb]:appearance-none
                [&::-webkit-slider-thumb]:w-4
                [&::-webkit-slider-thumb]:h-4
                [&::-webkit-slider-thumb]:bg-[#F5EBB8]
                [&::-webkit-slider-thumb]:rounded-full
                [&::-moz-range-thumb]:appearance-none
                [&::-moz-range-thumb]:w-4
                [&::-moz-range-thumb]:h-4
                [&::-moz-range-thumb]:bg-red-500
                [&::-moz-range-thumb]:rounded-full
                [&::-webkit-slider-thumb]:hover:bg-[#F5EBB8]
                [&::-moz-range-thumb]:hover:bg-[#F5EBB8]"
            />
          </div>
          <span className="text-sm w-12 text-right">{state.percentage}%</span>
        </div>
      </div>
      <div className="mt-auto">
        <div className="flex justify-between text-sm mb-4 pt-4 border-t border-[#262626]">
          <ActionButton
            onClick={handleSubmit}
            disabled={state.isButtonDisabled}
            text="Withdraw"
          />
        </div>
      </div>
    </div>
  );
};

export default WithdrawLiquidity;
