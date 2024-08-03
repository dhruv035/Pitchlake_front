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

/*This is the bridge for any transactions to go through, it's disabled by isTxDisabled if there is data loading or if 
  there's a pending transaction. The data loading is enforced to ensure no transaction is done without latest data.
  Add pendingStates from any critical data here and add it in the subsequent hooks
*/
//Possible Updates:
//Make transactions accepted only after 2 confirmations

export type TransactionContextType = {
  isDev: boolean;
  devAccount: Account | undefined;
  isTxDisabled: boolean;
  pendingTx: string | undefined;
  setIsDev: Dispatch<SetStateAction<boolean>>;
  setIsTxDisabled: Dispatch<SetStateAction<boolean>>;
  setPendingTx: Dispatch<SetStateAction<string | undefined>>;
};

export const TransactionContext = createContext<TransactionContextType>(
  {} as TransactionContextType,
);
const TransactionProvider = ({ children }: { children: ReactNode }) => {
  const [isDev, setIsDev] = useState<boolean>(false);
  const devAccount = getDevAccount(
    new RpcProvider({ nodeUrl: "http://127.0.0.1:5050" }),
  );
  const [isTxDisabled, setIsTxDisabled] = useState<boolean>(false);

  const [pendingTx, setPendingTx] = useState<string | undefined>();
  const { data, status } = useWaitForTransaction({ hash: pendingTx });

  const toastId = useRef<Id | null>(null),
    [onSuccess, setOnSuccess] = useState<(state?: string) => any>();

  const resetState = () => {
    setPendingTx(undefined);
    setIsTxDisabled(false);
  };
  const clearTransaction = () => {
    resetState();
    setOnSuccess(undefined);
    toastId.current = null;
  };

  console.log("pendingTx", pendingTx, status);

  useEffect(() => {
    if (pendingTx)
      switch (status) {
        case "pending":
          console.log;
          toastId.current = toast("Pending", {
            type: "info",
            position: "top-left",
            autoClose: false,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: false,
            draggable: false,
            progress: 1 / 3,
          });
          break;
        case "success":
          if (toastId.current)
            toast.update(toastId.current, {
              render: "Transaction success: " + pendingTx,
              type: "success",
              progress: undefined,
              autoClose: 5000,
            });
          onSuccess?.(status);
          clearTransaction();
          break;
        case "error":
        default:
          const render = "Transaction failed " + (pendingTx || ""),
            options: ToastOptions = {
              type: "error",
              position: "top-left",
              progress: undefined,
              autoClose: 5000,
            };

          toastId.current
            ? toast.update(toastId.current, { ...options, render })
            : toast(render, options);

          clearTransaction();
          break;
      }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pendingTx, status]);

  console.log("ISTXDISABLED", isTxDisabled);
  useEffect(() => {
    setIsTxDisabled(!!pendingTx);
  }, [pendingTx]);

  //Takes data from pendingState maintained in the context to send a replacement transaction

  return (
    <TransactionContext.Provider
      value={{
        isDev,
        devAccount,
        isTxDisabled,
        pendingTx,
        setIsDev,
        setIsTxDisabled,
        setPendingTx,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};
export const useTransactionContext = () => useContext(TransactionContext);
export default TransactionProvider;
