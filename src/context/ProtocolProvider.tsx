"use client";
import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useContext,
  useState,
} from "react";
import { useAccount, useNetwork } from "@starknet-react/core";
import useWebSocketVault from "@/hooks/useWebSocket";
import useMockVault from "@/lib/mocks/useMockVault";
import useVaultState from "@/hooks/vault/useVaultState";
import useVaultActions from "@/hooks/vault/useVaultActions";
import {
  LiquidityProviderStateType,
  OptionBuyerStateType,
  OptionRoundActionsType,
  OptionRoundStateType,
  VaultActionsType,
  VaultStateType,
} from "@/lib/types";

/*This is the bridge for any transactions to go through, it's disabled by isTxDisabled if there is data loading or if 
  there's a pending transaction. The data loading is enforced to ensure no transaction is done without latest data.
  Add pendingStates from any critical data here and add it in the subsequent hooks
*/
//Possible Updates:
//Make transactions accepted only after 2 confirmations

export type ProtocolContextType = {
    conn:string,
  vaultAddress?: string;
  vaultActions: VaultActionsType;
  vaultState?: VaultStateType;
  roundActions?: OptionRoundActionsType;
  optionRoundStates?: OptionRoundStateType[];
  optionBuyerStates?: OptionBuyerStateType[];
  lpState?: LiquidityProviderStateType;
  selectedRound?: number | string;
  setSelectedRound: Dispatch<SetStateAction<number>>;
  selectedRoundState?: OptionRoundStateType;
  selectedRoundBuyerState?: OptionBuyerStateType;
  setVaultAddress: Dispatch<SetStateAction<string | undefined>>;
  mockTimeForward:()=>void
  timeStamp:Number
};

export const ProtocolContext = createContext<ProtocolContextType>(
  {} as ProtocolContextType
);
const ProtocolProvider = ({ children }: { children: ReactNode }) => {
  const [vaultAddress, setVaultAddress] = useState<string | undefined>();
  const [conn, setConn] = useState(
    process.env.NEXT_PUBLIC_ENVIRONMENT &&
      process.env.NEXT_PUBLIC_ENVIRONMENT === "mock"
      ? "mock"
      : "rpc"
  );

  const {
    wsVaultState,
    wsOptionRoundStates,
    wsLiquidityProviderState,
    wsOptionBuyerStates,
  } = useWebSocketVault(conn, vaultAddress);
  const [selectedRound, setSelectedRound] = useState<number>(0);
  const [timeStamp,setTimeStamp]=useState(conn==="mock"?0:Number(Date.now().toString()));
  const mockTimeForward = ()=>{
    if(conn==="mock")
        setTimeStamp(prevState=>prevState+100000)
  }
  const {
    optionRoundStates: optionRoundStatesMock,
    lpState: lpStateMock,
    vaultState: vaultStateMock,
    vaultActions: vaultActionsMock,
    optionRoundActions: roundActionsMock,
    optionBuyerStates: optionBuyerStatesMock,
  } = useMockVault(vaultAddress);
  const {
    lpState: rpcLiquidityProviderState,
    vaultState: rpcVaultState,
    roundActions: roundActionsChain,
    selectedRoundState: selectedRoundStateRPC,
    selectedRoundBuyerState: selectedRoundBuyerStateRPC,
  } = useVaultState({
    conn,
    address: vaultAddress,
    selectedRound,
    getRounds: true,
  });
  const vaultState =
    conn === "rpc"
      ? rpcVaultState
      : conn === "ws"
      ? wsVaultState
      : vaultStateMock;

  const vaultActionsChain = useVaultActions(vaultAddress);
  const vaultActions = conn !== "mock" ? vaultActionsChain : vaultActionsMock;
  const lpState =
    conn === "rpc"
      ? rpcLiquidityProviderState
      : conn === "ws"
      ? wsLiquidityProviderState
      : lpStateMock;
  const optionRoundStates: OptionRoundStateType[] =
    conn === "mock"
      ? optionRoundStatesMock
      : conn === "ws"
      ? wsOptionRoundStates
      : [];
  const optionBuyerStates =
    conn === "ws"
      ? wsOptionBuyerStates
      : conn === "mock"
      ? optionBuyerStatesMock
      : [];
  // const currentRoundState =
  //   conn === "rpc"
  //     ? rpcCurrentRoundState
  //     : conn === "ws"
  //     ? wsOptionRoundStates[Number(vaultState?.currentRoundId) - 1]
  //     : optionRoundStatesMock[2];
  const roundActions =
    conn === "mock" ? roundActionsMock[selectedRound - 1] : roundActionsChain;
  const selectedRoundState =
    conn !== "rpc"
      ? vaultState?.currentRoundId
        ? optionRoundStates[Number(vaultState.currentRoundId) - 1]
        : undefined
      : selectedRoundStateRPC;
  console.log("ASD", selectedRoundState);
  console.log("OBSTATES", optionRoundStates);
  return (
    <ProtocolContext.Provider
      value={{
        conn,
        vaultAddress,
        vaultActions,
        vaultState,
        roundActions,
        optionRoundStates,
        optionBuyerStates,
        lpState,
        selectedRound,
        setSelectedRound,
        selectedRoundState,
        setVaultAddress,
        selectedRoundBuyerState: selectedRound
          ? conn === "rpc"
            ? selectedRoundBuyerStateRPC
            : optionBuyerStates.length > selectedRound
            ? optionBuyerStates[selectedRound - 1]
            : undefined
          : undefined,
        mockTimeForward,
        timeStamp
      }}
    >
      {children}
    </ProtocolContext.Provider>
  );
};
export const useProtocolContext = () => useContext(ProtocolContext);
export default ProtocolProvider;
