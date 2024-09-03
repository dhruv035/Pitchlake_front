import React from "react";
import Modal from "./Modal";

interface ConfirmationModalProps {
  activeTab: string;
  amount: string;
  onConfirm: () => void;
  onClose: () => void;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  activeTab,
  amount,
  onConfirm,
  onClose,
}) => (
  <Modal
    title={`${activeTab} Confirmation`}
    onClose={onClose}
  >
    <div className="bg-yellow-500 bg-opacity-20 rounded-lg p-4 mb-4">
      <div className="bg-yellow-500 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2">
        !
      </div>
      <p className="text-center">
        Are you sure you want to {activeTab.toLowerCase()} {amount} ETH to this round?
      </p>
    </div>
    <div className="flex space-x-4">
      <button
        onClick={onClose}
        className="flex-1 bg-[#2D2D2D] text-white py-2 rounded-md"
      >
        Cancel
      </button>
      <button
        onClick={onConfirm}
        className="flex-1 bg-yellow-500 text-black py-2 rounded-md"
      >
        Confirm
      </button>
    </div>
  </Modal>
);

export default ConfirmationModal;