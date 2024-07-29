"use client";
import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  useAccount,
  useBlockNumber,
  useWaitForTransaction,
} from "@starknet-react/core";
import { shortenString as shortenHash } from "@/lib/utils";
import { useRouter } from "next/navigation";

/*This is the bridge for any transactions to go through, it's disabled by isTxDisabled if there is data loading or if 
  there's a pending transaction. The data loading is enforced to ensure no transaction is done without latest data.
  Add pendingStates from any critical data here and add it in the subsequent hooks
*/
//Possible Updates:
//Make transactions accepted only after 2 confirmations

export type TransactionContextType = {
  pendingTx: string | undefined;
  isTxDisabled:boolean;
  setPendingTx: Dispatch<SetStateAction<string | undefined>>;
  setIsTxDisabled:Dispatch<SetStateAction<boolean>>;
};

export const TransactionContext = createContext<TransactionContextType>(
  {} as TransactionContextType
);
const TransactionProvider = ({ children }: { children: ReactNode }) => {
  const [pendingTx, setPendingTx] = useState<string | undefined>();
  const [isTxDisabled, setIsTxDisabled] = useState<boolean>(false);
  const { data, status } = useWaitForTransaction({ hash: pendingTx });
  const router = useRouter();
  useEffect(() => {
    if (status !== "pending") {
      if (status === "success") {
        //Success toast here,
      } else {
        //Failure toast here
      }
      // remove pending tx and set disabled to false
      setPendingTx(undefined);
      setIsTxDisabled(false);
    } else {
      setIsTxDisabled(true);
    }
  }, [pendingTx, status]);

  //Takes data from pendingState maintained in the context to send a replacement transaction

  return (
    <TransactionContext.Provider
      value={{
        pendingTx,
        setPendingTx,
        isTxDisabled,
        setIsTxDisabled
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};
export default TransactionProvider;
