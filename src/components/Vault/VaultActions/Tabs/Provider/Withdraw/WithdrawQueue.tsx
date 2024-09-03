import React from "react";
import { SidePanelState } from "@/lib/types";

interface WithdrawQueueProps {
  state: SidePanelState;
  updateState: (updates: Partial<SidePanelState>) => void;
}

const WithdrawQueue: React.FC<WithdrawQueueProps> = ({ state, updateState }) => {
  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const value = parseInt(e.target.value);
    updateState({ percentage: value, isButtonDisabled: false });
  };

  return (
    <div className="flex flex-col space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-400 mb-2">
          Choose Percentage
        </label>
        <div className="flex items-center space-x-4">
          <div className="w-full h-10 bg-black border border-[#262626] rounded-md flex items-center px-5">
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
          <span className="text-sm w-12 text-right">
            {state.percentage}%
          </span>
        </div>
      </div>
      <div className="flex justify-between items-center text-sm">
        <span className="text-gray-400">Currently Queued</span>
        <span>{state.queuedPercentage}%</span>
      </div>
    </div>
  );
};

export default WithdrawQueue;