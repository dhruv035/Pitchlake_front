"use client";
import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useContext,
  useState,
} from "react";
import {
  useAccount,
  useNetwork,
} from "@starknet-react/core";
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
  vaultActions: VaultActionsType;
  vaultState?: VaultStateType;
  roundActions?: OptionRoundActionsType;
  optionRoundStates?: OptionRoundStateType[];
  optionBuyerStates?: OptionBuyerStateType[];
  lpState?: LiquidityProviderStateType;
  selectedRound?: number | string;
  setSelectedRound: Dispatch<SetStateAction<number>>;
  selectedRoundState?: OptionRoundStateType;
};

export const ProtocolContext = createContext<ProtocolContextType>(
  {} as ProtocolContextType
);
const ProtocolProvider = ({ children }: { children: ReactNode }) => {
  const [isProviderView, setIsProviderView] = useState(true);
  const [vaultAddress, setVaultAddress] = useState("");
  const [conn, setConn] = useState("mock");

  const network = useNetwork();
  const { address: accountAddress } = useAccount();
  const {
    wsVaultState,
    wsOptionRoundStates,
    wsLiquidityProviderState,
    wsOptionBuyerStates,
  } = useWebSocketVault(conn, vaultAddress);
  const [selectedRound, setSelectedRound] = useState<number>(1);
  const {
    optionRoundStates: optionRoundStatesMock,
    lpState: lpStateMock,
    vaultState: vaultStateMock,
    vaultActions: vaultActionsMock,
    optionRoundActions: roundActionsMock,
    optionBuyerStates: optionBuyerStatesMock,
  } = useMockVault(vaultAddress);
  console.log("MOCK",)
  const {
    lpState: rpcLiquidityProviderState,
    vaultState: rpcVaultState,
    currentRoundAddress,
    roundActions: roundActionsChain,
    roundStates: optionRoundStatesRPC,
    buyerStates: optionBuyerStatesRPC,
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
      : optionRoundStatesRPC;
  const optionBuyerStates =
    conn === "rpc"
      ? optionBuyerStatesRPC
      : conn === "ws"
      ? wsOptionBuyerStates
      : optionBuyerStatesMock;
  // const currentRoundState =
  //   conn === "rpc"
  //     ? rpcCurrentRoundState
  //     : conn === "ws"
  //     ? wsOptionRoundStates[Number(vaultState?.currentRoundId) - 1]
  //     : optionRoundStatesMock[2];
  const roundActions =
    conn === "mock" ? roundActionsMock[selectedRound] : roundActionsChain;

    console.log("OBSTATES",optionRoundStates)
  return (
    <ProtocolContext.Provider
      value={{
        vaultActions,
        vaultState,
        roundActions,
        optionRoundStates,
        optionBuyerStates,
        lpState,
        selectedRound,
        setSelectedRound,
        selectedRoundState:
          selectedRound && optionRoundStates.length > selectedRound
            ? optionRoundStates[selectedRound-1]
            : undefined,
      }}
    >
      {children}
    </ProtocolContext.Provider>
  );
};
export const useProtocolContext = () => useContext(ProtocolContext);
export default ProtocolProvider;
