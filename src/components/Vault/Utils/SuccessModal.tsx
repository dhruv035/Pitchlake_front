import React from "react";
import { Check } from "lucide-react";

interface SuccessModalProps {
  activeTab: string;
  amount: string;
  onClose: () => void;
}

const SuccessModal: React.FC<SuccessModalProps> = ({
  activeTab,
  amount,
  onClose,
}) => (
  <div className="bg-[#121212] border border-[#262626] rounded-lg p-4 w-full flex flex-col h-full">
    <div className="flex items-center mb-4">
      <button onClick={onClose} className="mr-2">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M19 12H5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M12 19L5 12L12 5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
      <h2 className="text-white text-xl font-semibold">Liquidity {activeTab} Successful</h2>
    </div>
    <div className="flex-grow flex flex-col items-center justify-center">
      <div className="bg-[#1E1E1E] rounded-lg p-6 mb-6">
        <div className="bg-yellow-500 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
          <Check className="text-black w-8 h-8" />
        </div>
        <p className="text-center text-white">
          You have successfully{" "}
          {activeTab === "Deposit" ? "deposited" : "withdrawn"}{" "}
          <span className="font-bold">{amount} ETH</span>
          {activeTab === "Withdraw" ? " to your unlocked balance" : ""}.
        </p>
      </div>
    </div>
    <button
      onClick={onClose}
      className="w-full bg-yellow-500 text-black py-3 rounded-md font-semibold"
    >
      Got it
    </button>
  </div>
);

export default SuccessModal;