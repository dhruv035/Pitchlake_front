import React from "react";
import { ChevronLeft } from "lucide-react";

interface ConfirmationModalProps {
  modalHeader: string;
  action: string;
  onConfirm: () => void;
  onClose: () => void;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  modalHeader,
  action,
  onConfirm,
  onClose,
}) => (
  <div className="bg-[#121212] border border-[#262626] rounded-lg p-4 w-full flex flex-col h-full">
    <div className="flex items-center mb-4">
      <button onClick={onClose} className="text-sm mr-2">
        <ChevronLeft className="text-white" />
      </button>
      <h2 className="text-white text-md font-semibold">{modalHeader}</h2>
    </div>
    <div className="flex-grow flex flex-col items-center justify-center">
      <div className="p-6 w-full">
        <div className="bg-[#F5EBB8] rounded-lg w-12 h-12 flex items-center justify-center mx-auto mb-6">
          <span className="text-black text-2xl font-bold">!</span>
        </div>
        <p className="text-center text-white text-sm mb-8">
          Are you sure you want to {action}?
        </p>
      </div>
    </div>
    <div className="flex space-x-6 mt-4">
      <button
        onClick={onClose}
        className="flex-1 bg-[#121212] border border-[#595959] text-[#FFFFFF] py-3 rounded-lg text-md font-medium"
      >
        Cancel
      </button>
      <button
        onClick={onConfirm}
        className="flex-1 bg-[#F5EBB8] text-[#111111] py-3 rounded-lg text-md font-semibold"
      >
        Confirm
      </button>
    </div>
  </div>
);

export default ConfirmationModal;