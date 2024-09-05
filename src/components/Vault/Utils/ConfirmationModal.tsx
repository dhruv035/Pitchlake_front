import React from "react";
import { ChevronLeft } from "lucide-react";

interface ConfirmationModalProps {
  message: string;
  amount: string;
  onConfirm: () => void;
  onClose: () => void;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  message,
  amount,
  onConfirm,
  onClose,
}) => (
  <div className="bg-[#121212] border border-[#262626] rounded-lg p-4 w-full flex flex-col h-full">
    <div className="flex items-center mb-4">
      <button onClick={onClose} className="mr-2">
        <ChevronLeft className="text-white" />
      </button>
      <h2 className="text-white text-xl font-semibold">{message} Confirmation</h2>
    </div>
    <div className="flex-grow flex flex-col items-center justify-center">
      <div className="bg-[#1E1E1E] rounded-lg p-6 w-full">
        <div className="bg-yellow-500 rounded-lg w-16 h-16 flex items-center justify-center mx-auto mb-6">
          <span className="text-black text-3xl font-bold">!</span>
        </div>
        <p className="text-center text-white text-lg mb-8">
          Are you sure you want to {message.toLowerCase()} <span className="font-bold">{amount} ETH</span> to this round?
        </p>
      </div>
    </div>
    <div className="flex space-x-4 mt-4">
      <button
        onClick={onClose}
        className="flex-1 bg-[#2D2D2D] text-white py-3 rounded-md text-lg font-medium"
      >
        Cancel
      </button>
      <button
        onClick={onConfirm}
        className="flex-1 bg-yellow-500 text-black py-3 rounded-md text-lg font-medium"
      >
        Confirm
      </button>
    </div>
  </div>
);

export default ConfirmationModal;