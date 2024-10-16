"use client"
import useOptionRoundActions from "@/hooks/optionRound/useOptionRoundActions";
import useVaultActions from "@/hooks/vault/useVaultActions";
import useVaultState from "@/hooks/vault/useVaultState";
import RoundPerformanceChart from "./VaultChart/Chart";
import { useEffect, useRef, useState } from "react";
import AuctionIcon from "../Icons/AuctionIcon";
import CoinStackedIcon from "../Icons/CoinStackedIcon";
import PanelRight from "./VaultActions/PanelRight";
import PanelLeft from "./VaultActions/PanelLeft";
import {
  LiquidityProviderStateType,
  OptionBuyerStateType,
  OptionRoundStateType,
  VaultStateType,
} from "@/lib/types";
import { useAccount, useNetwork } from "@starknet-react/core";
import useOptionRoundState from "@/hooks/optionRound/useOptionRoundState";
import useWebSocketVault from "@/hooks/useWebSocket";
import useMockVault from "@/lib/mocks/useMockVault";

type wsMessageType = {
  address: string;
  userType: string;
  vaultAddress: string;
  data: VaultStateType;
};
type wsResponseType = {
  payloadType: string;
  liquidityProviderState?: LiquidityProviderStateType;
  optionBuyerState?: OptionBuyerStateType;
  vaultState: VaultStateType;
  optionRoundStates?: OptionRoundStateType[];
};

export const Vault = ({ vaultAddress }: { vaultAddress: string }) => {
  const [isProviderView, setIsProviderView] = useState(true);
  const [conn, setConn] = useState("mock");
  const network = useNetwork();
  const { address: accountAddress } = useAccount();
  const {
    wsVaultState,
    wsOptionRoundStates,
    wsLiquidityProviderState,
    wsOptionBuyerState,
  } = useWebSocketVault(conn, vaultAddress);

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
    currentRoundAddress,
  } = useVaultState(conn, vaultAddress);
  const vaultState =
    conn === "rpc"
      ? rpcVaultState
      : conn === "ws"
      ? wsVaultState
      : vaultStateMock;
  const vaultActionsChain = useVaultActions(vaultAddress);
  const vaultActions = conn !=='mock'?vaultActionsChain:vaultActionsMock
  const lpState =
    conn === "rpc"
      ? rpcLiquidityProviderState
      : conn === "ws"
      ? wsLiquidityProviderState
      : lpStateMock;
  const {
    optionRoundState: rpcCurrentRoundState,
    optionBuyerState: rpcOptionBuyerState,
  } = useOptionRoundState(currentRoundAddress);
  const optionBuyerState =
    conn === "rpc"
      ? rpcOptionBuyerState
      : conn === "ws"
      ? wsOptionBuyerState
      : optionBuyerStatesMock[2];
  const currentRoundState =
    conn === "rpc"
      ? rpcCurrentRoundState
      : conn === "ws"
      ? wsOptionRoundStates[Number(vaultState?.currentRoundId) - 1]
      : optionRoundStatesMock[2];
  const roundActions = useOptionRoundActions(currentRoundAddress);

  console.log("vaultState",vaultState)
  return (
    <div className="px-7 py-7 flex-grow overflow-auto">
      <div className="flex flex-row-reverse text-primary p-4">
        <div className="flex flex-row rounded-md border-[1px] border-greyscale-800">
          <div
            onClick={() => setIsProviderView(true)}
            className={`flex flex-row items-center m-[1px] hover:cursor-pointer p-4 rounded-md ${
              isProviderView ? "bg-primary-900" : ""
            }`}
          >
            <CoinStackedIcon
              classname="mr-2"
              stroke={isProviderView ? "var(--primary)" : "var(--greyscale)"}
            />
            <p
              className={`${
                isProviderView ? "text-primary" : "text-greyscale"
              }`}
            >
              Provider
            </p>
          </div>
          <div
            onClick={() => setIsProviderView(false)}
            className={`flex flex-row items-center m-[1px] hover:cursor-pointer p-4 rounded-md ${
              !isProviderView ? "bg-primary-900" : ""
            }`}
          >
            <AuctionIcon
              classname="mr-2"
              fill={isProviderView ? "var(--greyscale)" : "var(--primary)"}
            />
            <p
              className={`${
                !isProviderView ? "text-primary" : "text-greyscale"
              }`}
            >
              Buyer
            </p>
          </div>
        </div>
      </div>
      <div className="mt-6 flex flex-row">
        {vaultState && (
          <PanelLeft vaultState={vaultState} roundState={currentRoundState} vaultActions={vaultActions}/>
        )}
        {
          //Update the roundState to multiple roundStates and set selected round in the component
        }
        <RoundPerformanceChart roundState={currentRoundState} currentRoundId={currentRoundState.roundId} />

        <div className="w-full ml-6 max-w-[350px]">
          {vaultState && lpState && (
            <PanelRight
              userType={isProviderView ? "lp" : "ob"}
              roundState={currentRoundState}
              vaultState={vaultState}
              lpState={lpState}
              vaultActions={vaultActions}
              roundActions={roundActions}
            />
          )}
        </div>
      </div>
    </div>
  );
};
