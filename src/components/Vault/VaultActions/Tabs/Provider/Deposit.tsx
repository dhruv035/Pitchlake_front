import React, { useState, ReactNode, useEffect } from "react";
import { useAccount } from "@starknet-react/core";
import { useTransactionContext } from "@/context/TransactionProvider";
import useERC20 from "@/hooks/erc20/useERC20";
import { parseEther, parseUnits, formatEther } from "ethers";
import { useProtocolContext } from "@/context/ProtocolProvider";
import InputField from "@/components/Vault/Utils/InputField";
import { User } from "lucide-react";
import ActionButton from "@/components/Vault/Utils/ActionButton";
import ButtonTabs from "../ButtonTabs";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEthereum } from "@fortawesome/free-brands-svg-icons";
import { num } from "starknet";

interface DepositProps {
  showConfirmation: (
    modalHeader: string,
    action: ReactNode,
    onConfirm: () => Promise<void>,
  ) => void;
}

const LOCAL_STORAGE_KEY = "depositAmountWei";

interface DepositState {
  amount: string;
  isDepositAsBeneficiary: boolean;
  beneficiaryAddress: string;
  activeWithdrawTab: "For Myself" | "As Beneficiary";
}

const Deposit: React.FC<DepositProps> = ({ showConfirmation }) => {
  const { vaultState, lpState, vaultActions } = useProtocolContext();
  const [needsApproval, setNeedsApproval] = useState<string>("0");
  const [state, setState] = useState<DepositState>({
    amount: localStorage.getItem(LOCAL_STORAGE_KEY) || "",
    isDepositAsBeneficiary: false,
    beneficiaryAddress: "",
    activeWithdrawTab: "For Myself",
  });
  const { account } = useAccount();
  const { allowance, approve } = useERC20(
    vaultState?.ethAddress,
    vaultState?.address,
    account,
  );

  const { pendingTx } = useTransactionContext();

  const updateState = (updates: Partial<DepositState>) => {
    setState((prevState) => ({ ...prevState, ...updates }));
  };

  const handleDeposit = async (): Promise<void> => {
    const amountWei = parseEther(state.amount);
    await vaultActions.depositLiquidity({
      amount: amountWei,
      beneficiary: account ? account.address : "",
    });
    localStorage.removeItem(LOCAL_STORAGE_KEY);
  };

  const handleApprove = async (): Promise<void> => {
    const amountWei = parseEther(state.amount);
    await approve({
      amount: num.toBigInt(amountWei),
      spender: vaultState ? vaultState.address : "",
    });
  };

  const handleSubmitForApproval = () => {
    showConfirmation(
      "Approve",
      <>
        approve this vault to transfer
        <br />
        <span className="font-semibold text-[#fafafa]">
          {formatEther(needsApproval)} ETH
        </span>
      </>,
      async () => {
        await handleApprove();
      },
    );
  };

  const handleSubmitForDeposit = () => {
    showConfirmation(
      "Deposit",
      <>
        deposit
        <br />
        <span className="font-semibold text-[#fafafa]">
          {state.amount} ETH
        </span>{" "}
        into this round
      </>,
      async () => {
        await handleDeposit();
        setState((prevState) => ({ ...prevState, amount: "" }));
      },
    );
  };

  const isApprovalDisabled = (): boolean => {
    if (pendingTx) return true;
    if (!account) return true;
    if (Number(needsApproval) <= 0) return true;
    return false;
  };

  const isDepositDisabled = (): boolean => {
    if (pendingTx) return true;
    if (!account) return true;
    if (Number(state.amount) <= 0) return true;
    if (state.isDepositAsBeneficiary && state.beneficiaryAddress.trim() === "")
      return true;
    return false;
  };

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, state.amount);
  }, [state.amount]);

  useEffect(() => {
    const amountEth = state.amount || "0";
    const amountWei = parseUnits(amountEth, "ether");
    setNeedsApproval(
      num.toBigInt(allowance) < num.toBigInt(amountWei)
        ? amountWei.toString()
        : "0",
    );
  }, [state.amount, account, allowance]);

  return (
    <div className="flex flex-col h-full">
      <div className="flex-grow space-y-6 p-6">
        <ButtonTabs
          tabs={["For Myself", "As Beneficiary"]}
          activeTab={state.activeWithdrawTab}
          setActiveTab={(tab) =>
            updateState({
              activeWithdrawTab: tab as "For Myself" | "As Beneficiary",
              isDepositAsBeneficiary: tab === "As Beneficiary",
            })
          }
        />
        {state.isDepositAsBeneficiary && (
          <InputField
            type="text"
            value={state.beneficiaryAddress}
            label="Enter Address"
            onChange={(e) =>
              updateState({ beneficiaryAddress: e.target.value })
            }
            placeholder="Depositor's Address"
            icon={
              <User className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400" />
            }
          />
        )}

        <InputField
          type="number"
          value={state.amount}
          label="Enter Amount"
          onChange={(e) =>
            updateState({
              amount: e.target.value.slice(0, e.target.value.indexOf(".") + 19),
            })
          }
          placeholder="e.g. 5.0"
          icon={
            <FontAwesomeIcon
              icon={faEthereum}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pr-2"
            />
          }
        />
      </div>

      <div className="mt-auto">
        <div className="px-6 flex justify-between text-sm mb-6 pt-6">
          <span className="text-gray-400">Unlocked Balance</span>
          <span className="text-white">
            {parseFloat(
              formatEther(lpState?.unlockedBalance?.toString() || "0"),
            ).toFixed(3)}{" "}
            ETH
          </span>
        </div>
        <div className="px-6 flex justify-between text-sm mb-6 pt-6 border-t border-[#262626]">
          {num.toBigInt(needsApproval) > 0 ? (
            <ActionButton
              onClick={handleSubmitForApproval}
              disabled={isApprovalDisabled()}
              text="Approve"
            />
          ) : (
            <ActionButton
              onClick={handleSubmitForDeposit}
              disabled={isDepositDisabled()}
              text="Deposit"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Deposit;

//import React, { useState, useEffect } from "react";
//import { useAccount } from "@starknet-react/core";
//import { useTransactionContext } from "@/context/TransactionProvider";
//import useERC20 from "@/hooks/erc20/useERC20";
//import {
//  DepositArgs,
//  LiquidityProviderStateType,
//  VaultStateType,
//} from "@/lib/types";
//import InputField from "@/components/Vault/Utils/InputField";
//import { ChevronDown, User } from "lucide-react";
//import ActionButton from "@/components/Vault/Utils/ActionButton";
//import ButtonTabs from "../../ButtonTabs";
//import { parseEther, formatEther, parseUnits, formatUnits } from "ethers";
//import { useProtocolContext } from "@/context/ProtocolProvider";
//import { getDevAccount } from "@/lib/constants";
//import { RpcProvider, Call, transaction, num } from "starknet";
//import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
//import { faEthereum } from "@fortawesome/free-brands-svg-icons";
//
//interface DepositProps {
//  showConfirmation: (
//    modalHeader: string,
//    action: string,
//    onConfirm: () => Promise<void>,
//  ) => void;
//}
//
//interface DepositState {
//  amount: string;
//  isDepositAsBeneficiary: boolean;
//  beneficiaryAddress: string;
//  activeWithdrawTab: "For Myself" | "As Beneficiary";
//}
//
//const Deposit: React.FC<DepositProps> = ({ showConfirmation }) => {
//  const { vaultState, lpState, vaultActions } = useProtocolContext();
//  const { pendingTx } = useTransactionContext();
//  const [needsApproval, setNeedsApproval] = useState<string>("0");
//  const [isDepositComplete, setIsDepositComplete] = useState(false);
//  const [isApprovalComplete, setIsApprovalComplete] = useState(false);
//  const [state, setState] = useState<DepositState>({
//    amount: "0",
//    isDepositAsBeneficiary: false,
//    beneficiaryAddress: "",
//    activeWithdrawTab: "For Myself",
//  });
//  const { account } = useAccount();
//  const { allowance, approve, increaseAllowance } = useERC20(
//    vaultState?.ethAddress,
//    vaultState?.address,
//    account,
//  );
//
//  const updateState = (updates: Partial<DepositState>) => {
//    setState((prevState) => ({ ...prevState, ...updates }));
//  };
//
//  const handleDeposit = async (): Promise<void> => {
//    /// Update allowance if needed
//    const amountWei = parseEther(state.amount);
//    if (Number(allowance) < Number(amountWei)) {
//      const diff = Number(amountWei) - Number(allowance);
//
//      await approve({
//        amount: num.toBigInt(amountWei),
//        spender: vaultState ? vaultState.address : "",
//      });
//    }
//
//    /// Deposit
//    await vaultActions.depositLiquidity({
//      amount: amountWei,
//      beneficiary: account ? account.address : "",
//    });
//  };
//
//  const handleApprove = async (): Promise<void> => {
//    const amountWei = parseEther(state.amount);
//    if (Number(needsApproval) > 0) {
//      await approve({
//        amount: num.toBigInt(amountWei),
//        spender: vaultState ? vaultState.address : "",
//      });
//    }
//  };
//
//  const handleSubmitForApproval = () => {
//    showConfirmation(
//      "Approve",
//      `approve this vault to transfer ${formatEther(needsApproval)} ETH?`,
//      handleApprove,
//    );
//  };
//
//  const handleSubmitForDeposit = () => {
//    showConfirmation(
//      "Deposit",
//      `deposit ${state.amount} ETH to this round?`,
//      handleDeposit,
//    );
//  };
//
//  const isDepositDisabled = (): boolean => {
//    // No negatives
//    if (Number(state.amount) <= Number(0)) {
//      return true;
//    }
//
//    // If no address is entered
//    if (state.isDepositAsBeneficiary) {
//      if (state.beneficiaryAddress.trim() === "") {
//        return true;
//      }
//    }
//
//    return false;
//  };
//
//  useEffect(() => {
//    /// Update allowance if needed
//    const amountEth = state ? (state.amount === "" ? "0" : state.amount) : "0";
//    const amountWei = parseUnits(amountEth, "ether");
//    if (num.toBigInt(allowance) < num.toBigInt(amountWei)) {
//      setNeedsApproval(amountWei.toString());
//    }
//  }, [state.amount, account]);
//
//  return (
//    <div className="flex flex-col h-full">
//      <div className="flex-grow space-y-6 p-6">
//        <ButtonTabs
//          tabs={["For Myself", "As Beneficiary"]}
//          activeTab={state.activeWithdrawTab}
//          setActiveTab={(tab) => {
//            updateState({
//              activeWithdrawTab: tab as "For Myself" | "As Beneficiary",
//              isDepositAsBeneficiary: tab === "As Beneficiary",
//            });
//          }}
//        />
//        {state.isDepositAsBeneficiary && (
//          <div>
//            <InputField
//              type="text"
//              value={state.beneficiaryAddress}
//              label="Enter Address"
//              onChange={(e) => {
//                updateState({ beneficiaryAddress: e.target.value });
//                // TODO: Check address regex
//              }}
//              placeholder="Depositor's Address"
//              icon={
//                <User className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400" />
//              }
//            />
//          </div>
//        )}
//
//        <div>
//          <InputField
//            type="number"
//            value={state.amount}
//            label="Enter Amount"
//            onChange={(e) => {
//              const value = e.target.value;
//              const formattedValue = value.includes(".")
//                ? value.slice(0, value.indexOf(".") + 19)
//                : value;
//              updateState({ amount: formattedValue });
//            }}
//            placeholder="e.g. 5.0"
//            icon={
//              <FontAwesomeIcon
//                icon={faEthereum}
//                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pr-2"
//              />
//            }
//          />
//        </div>
//      </div>
//      <div className="mt-auto">
//        <div className="px-6 flex justify-between text-sm mb-6 pt-6">
//          <span className="text-gray-400">Unlocked Balance</span>
//          <span className="text-white">
//            {formatEther(
//              lpState?.unlockedBalance ? lpState.unlockedBalance.toString() : 0,
//            ).toString()}{" "}
//            ETH
//          </span>
//        </div>
//        <div className="px-6 flex justify-between text-sm mb-6 pt-6 border-t border-[#262626]">
//          {num.toBigInt(needsApproval) > 0 ? (
//            <ActionButton
//              onClick={handleSubmitForApproval}
//              disabled={false}
//              //disabled={isDepositDisabled()}
//              text="Approve"
//            />
//          ) : (
//            <ActionButton
//              onClick={handleSubmitForDeposit}
//              disabled={isDepositDisabled()}
//              text="Deposit"
//            />
//          )}
//        </div>
//      </div>
//    </div>
//  );
//};
//
//export default Deposit;
