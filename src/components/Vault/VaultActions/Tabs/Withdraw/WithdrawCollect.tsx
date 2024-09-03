import React from "react";
import collect from "@/../public/collect.svg";

const WithdrawCollect: React.FC = () => (
  <div className="flex flex-col h-full">
    <div className="flex-grow flex flex-col items-center justify-center space-y-4">
      <div className="bg-[#1E1E1E] rounded-lg p-4">
        <img
          src={collect}
          alt="Collect icon"
          className="w-16 h-16 mx-auto"
        />
      </div>
      <p className="text-gray-400 text-center">
        Your current stashed balance is
      </p>
      <p className="text-2xl font-bold">32 ETH</p>
    </div>
  </div>
);

export default WithdrawCollect;