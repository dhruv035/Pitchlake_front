import React from "react";
import Modal from "./Modal";

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
  <Modal
    title={`Liquidity ${activeTab} Confirmation`}
    onClose={onClose}
  >
    <div className="bg-green-500 bg-opacity-20 rounded-lg p-4 mb-4">
      <div className="bg-green-500 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2">
        ✓
      </div>
      <p className="text-center">
        You have successfully{" "}
        {activeTab === "Deposit" ? "deposited" : "withdrawn"}{" "}
        {amount} ETH
        {activeTab === "Withdraw" ? " to your unlocked balance" : ""}.
      </p>
    </div>
    <button
      onClick={onClose}
      className="w-full bg-yellow-500 text-black py-2 rounded-md"
    >
      Got it
    </button>
  </Modal>
);

export default SuccessModal;