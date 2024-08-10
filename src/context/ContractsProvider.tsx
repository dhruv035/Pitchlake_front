// "use client";
// import {
//   Dispatch,
//   ReactNode,
//   SetStateAction,
//   createContext,
//   useCallback,
//   useContext,
//   useEffect,
//   useRef,
//   useState,
// } from "react";
// import { Id } from "react-toastify";
// import { useWaitForTransaction } from "@starknet-react/core";
// import { getDevAccount } from "@/lib/constants";
// import { Account, RpcProvider } from "starknet";
// import { displayToastError, displayToastInfo, updateToast } from "@/lib/toasts";

// /*This is the bridge for any transactions to go through, it's disabled by isTxDisabled if there is data loading or if 
//   there's a pending transaction. The data loading is enforced to ensure no transaction is done without latest data.
//   Add pendingStates from any critical data here and add it in the subsequent hooks
// */
// //Possible Updates:
// //Make transactions accepted only after 2 confirmations

// export type ContractsContextType = {
//   isDev: boolean;
//   devAccount: Account | undefined;
//   isTxDisabled: boolean;
//   pendingTx: string | undefined;
//   setIsDev: Dispatch<SetStateAction<boolean>>;
//   setIsTxDisabled: Dispatch<SetStateAction<boolean>>;
//   setPendingTx: Dispatch<SetStateAction<string | undefined>>;
// };

// export const ContractsContext = createContext<ContractsContextType>(
//   {} as ContractsContextType
// );
// const ContractsProvider = ({ children }: { children: ReactNode }) => {
//  const vaultState = use
//   //Takes data from pendingState maintained in the context to send a replacement transaction

//   return (
//     <ContractsContext.Provider
//       value={{
//         isDev,
//         devAccount,
//         isTxDisabled,
//         pendingTx,
//         setIsDev,
//         setIsTxDisabled,
//         setPendingTx,
//       }}
//     >
//       {children}
//     </ContractsContext.Provider>
//   );
// };
// export const useContractsContext = () => useContext(ContractsContext);
// export default ContractsProvider;
