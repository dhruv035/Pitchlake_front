"use client";
import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { Id, toast, ToastOptions } from "react-toastify";
import { useWaitForTransaction } from "@starknet-react/core";
import { getDevAccount } from "@/lib/constants";
import { Account, RpcProvider } from "starknet";
import { displayToastError, displayToastInfo, updateToast } from "@/lib/toasts";
import { LiquidityProviderStateType } from "@/lib/types";
import { useProtocolContext } from "../ProtocolProvider";
import useLPState from "@/hooks/vault/useLPState";

/*This is the bridge for any transactions to go through, it's disabled by isTxDisabled if there is data loading or if
  there's a pending transaction. The data loading is enforced to ensure no transaction is done without latest data.
  Add pendingStates from any critical data here and add it in the subsequent hooks
*/
//Possible Updates:
//Make transactions accepted only after 2 confirmations

export type LPContextType = {
  lpState:LiquidityProviderStateType
};

export const LPContext = createContext<LPContextType>(
  {} as LPContextType,
);

const LPProvider = ({ children }: { children: ReactNode }) => {
    const {vaultAddress,conn} =useProtocolContext();
  //Takes data from pendingState maintained in the context to send a replacement transaction
    const lpState = useLPState(vaultAddress,conn);
  return (
    <LPContext.Provider
      value={{
        lpState
      }}
    >
      {children}
    </LPContext.Provider>
  );
};
export const useLPContext = () => useContext(LPContext);
export default LPProvider;
