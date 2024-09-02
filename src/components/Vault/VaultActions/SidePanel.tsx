import React, { useState, useEffect } from "react";
import { ArrowLeftIcon, ChevronDownIcon } from "lucide-react";
import ToggleSwitch from "./ToggleSwitch";
import collect from "@/../public/collect.svg";

const SidePanel = () => {
  const [state, setState] = useState({
    activeTab: "Deposit",
    activeWithdrawTab: "Liquidity",
    amount: "",
    isDepositAsBeneficiary: false,
    showConfirmation: false,
    showSuccess: false,
    isButtonDisabled: true,
    percentage: 25,
    queuedPercentage: 5,
  });

  useEffect(() => {
    setState(prevState => ({
      ...prevState,
      isButtonDisabled: prevState.amount === "" || parseFloat(prevState.amount) <= 0
    }));
  }, [state.amount]);

  const updateState = (updates) => {
    setState(prevState => ({ ...prevState, ...updates }));
  };

  const handleSubmit = () => {
    if (!state.isButtonDisabled) {
      updateState({ showConfirmation: true });
    }
  };

  const handleConfirm = () => {
    updateState({ showConfirmation: false, showSuccess: true });
  };

  const handleSliderChange = (e) => {
    const value = parseInt(e.target.value);
    updateState({ percentage: value, isButtonDisabled: false });
  };

  const renderTabs = (tabs, activeTab, setActiveTab) => (
    <div className="flex mb-4 border-b border-gray-700">
      {tabs.map((tab) => (
        <button
          key={tab}
          className={`px-4 py-2 relative ${
            activeTab === tab ? "text-[#F5EBB8]" : "text-gray-400"
          }`}
          onClick={() => setActiveTab(tab)}
        >
          {tab}
          {activeTab === tab && (
            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#F5EBB8]"></div>
          )}
        </button>
      ))}
    </div>
  );

  const InputField = ({ label, value, onChange, placeholder }) => (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-400 mb-1">
        {label}
      </label>
      <div className="relative">
        <input
          type="number"
          placeholder={placeholder}
          min={0}
          value={value}
          onChange={onChange}
          className="w-full bg-[#1E1E1E] border border-gray-700 rounded-md p-2 pr-8 appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        />
        <ChevronDownIcon className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
      </div>
    </div>
  );

  const ActionButton = ({ onClick, disabled, text }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`w-full py-2 rounded-md ${
        disabled
          ? "bg-gray-600 text-gray-400 cursor-not-allowed"
          : "bg-[#F5EBB8] text-[#121212]"
      }`}
    >
      {text}
    </button>
  );

  const Modal = ({ title, children, onClose }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-[#121212] p-6 rounded-lg max-w-sm w-full">
        <div className="flex items-center mb-4">
          <ArrowLeftIcon className="h-5 w-5 mr-2" onClick={onClose} />
          <h2 className="text-lg font-semibold">{title}</h2>
        </div>
        {children}
      </div>
    </div>
  );

  const renderDepositContent = () => (
    <>
      <InputField
        label="Enter Amount"
        value={state.amount}
        onChange={(e) => updateState({ amount: e.target.value })}
        placeholder="e.g. 5"
      />
      <div className="flex justify-between text-sm mb-4">
        <span className="text-gray-400">Unlocked Balance</span>
        <span>34.8 ETH</span>
      </div>
      <ToggleSwitch
        isChecked={state.isDepositAsBeneficiary}
        onChange={() => updateState({ isDepositAsBeneficiary: !state.isDepositAsBeneficiary })}
        label="Deposit as Beneficiary"
      />
    </>
  );

  const renderWithdrawContent = () => (
    <>
      {renderTabs(["Liquidity", "Queue", "Collect"], state.activeWithdrawTab, (tab) => updateState({ activeWithdrawTab: tab }))}
      {state.activeWithdrawTab === "Liquidity" && (
        <>
          <InputField
            label="Enter Amount"
            value={state.amount}
            onChange={(e) => updateState({ amount: e.target.value })}
            placeholder="e.g. 5"
          />
          <div className="flex justify-between text-sm mb-4">
            <span className="text-gray-400">Unlocked Balance</span>
            <span>34.8 ETH</span>
          </div>
        </>
      )}
      {state.activeWithdrawTab === "Queue" && (
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
              <span className="text-sm w-12 text-right">{state.percentage}%</span>
            </div>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-400">Currently Queued</span>
            <span>{state.queuedPercentage}%</span>
          </div>
        </div>
      )}
      {state.activeWithdrawTab === "Collect" && (
        <div className="flex flex-col h-full">
          <div className="flex-grow flex flex-col items-center justify-center space-y-4">
            <div className="bg-[#1E1E1E] rounded-lg p-4">
              <img src={collect} alt="Collect icon" className="w-16 h-16 mx-auto" />
            </div>
            <p className="text-gray-400 text-center">
              Your current stashed balance is
            </p>
            <p className="text-2xl font-bold">32 ETH</p>
          </div>
        </div>
      )}
    </>
  );

  const renderMyInfoContent = () => (
    <div className="flex flex-col space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-400 mb-1">
          Beneficiary Address
        </label>
        <div className="bg-[#1E1E1E] border border-gray-700 rounded-md p-2">
          0x5d3641202cb464797ef15c53c49131fb5762f36470657
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-400 mb-1">
          Beneficiary Name
        </label>
        <div className="bg-[#1E1E1E] border border-gray-700 rounded-md p-2">
          John Doe
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-400 mb-1">
          Beneficiary Email
        </label>
      </div>
    </div>
  );

  return (
    <div className="bg-[#121212] border border-[#262626] rounded-lg p-4 w-full flex flex-col h-full">
      {renderTabs(["Deposit", "Withdraw", "My Info"], state.activeTab, (tab) => updateState({ activeTab: tab }))}
      
      <div className="flex-grow">
        {state.activeTab === "Deposit" && renderDepositContent()}
        {state.activeTab === "Withdraw" && renderWithdrawContent()}
        {state.activeTab === "My Info" && renderMyInfoContent()}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-700">
        <ActionButton
          onClick={handleSubmit}
          disabled={state.isButtonDisabled}
          text={state.activeTab === "Withdraw" 
            ? `${state.activeWithdrawTab === "Queue" ? "Queue" : state.activeWithdrawTab} Withdrawal`
            : state.activeTab === "My Info" ? "Update Info" : "Deposit"}
        />
      </div>

      {state.showConfirmation && (
        <Modal title={`${state.activeTab} Confirmation`} onClose={() => updateState({ showConfirmation: false })}>
          <div className="bg-yellow-500 bg-opacity-20 rounded-lg p-4 mb-4">
            <div className="bg-yellow-500 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2">
              !
            </div>
            <p className="text-center">
              Are you sure you want to {state.activeTab.toLowerCase()} {state.amount} ETH to
              this round?
            </p>
          </div>
          <div className="flex space-x-4">
            <button
              onClick={() => updateState({ showConfirmation: false })}
              className="flex-1 bg-[#2D2D2D] text-white py-2 rounded-md"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              className="flex-1 bg-yellow-500 text-black py-2 rounded-md"
            >
              Confirm
            </button>
          </div>
        </Modal>
      )}

      {state.showSuccess && (
        <Modal title={`Liquidity ${state.activeTab} Confirmation`} onClose={() => updateState({ showSuccess: false })}>
          <div className="bg-green-500 bg-opacity-20 rounded-lg p-4 mb-4">
            <div className="bg-green-500 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2">
              ✓
            </div>
            <p className="text-center">
              You have successfully{" "}
              {state.activeTab === "Deposit" ? "deposited" : "withdrawn"} {state.amount} ETH
              {state.activeTab === "Withdraw" ? " to your unlocked balance" : ""}.
            </p>
          </div>
          <button
            onClick={() => updateState({ showSuccess: false })}
            className="w-full bg-yellow-500 text-black py-2 rounded-md"
          >
            Got it
          </button>
        </Modal>
      )}
    </div>
  );
};

export default SidePanel;