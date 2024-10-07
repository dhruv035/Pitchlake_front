import useOptionRoundActions from "@/hooks/optionRound/useOptionRoundActions";
import useVaultActions from "@/hooks/vault/useVaultActions";
import useVaultState from "@/hooks/vault/useVaultState";
import RoundPerformanceChart from "./VaultChart/Chart";
import { mockVaultDetails } from "../Vault/MockData";
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
import { useAccount } from "@starknet-react/core/hooks";
import useOptionRoundState from "@/hooks/optionRound/useOptionRoundState";

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
  const ws = useRef<WebSocket | null>(null);
  const { address: accountAddress } = useAccount();
  const [wsVaultState, setWsVaultState] = useState<VaultStateType | null>(null);
  const [wsOptionRoundStates, setWsOptionRoundStates] = useState<
    OptionRoundStateType[]
  >([] as OptionRoundStateType[]);
  const [wsLiquidityProviderState, setWsLiquidityProviderState] =
    useState<LiquidityProviderStateType | null>(null);
  const [wsOptionBuyerState, setWsOptionBuyerState] =
    useState<OptionBuyerStateType | null>(null);
  const [isRPC, setIsRPC] = useState(true);
  useEffect(() => {
    if (!isRPC) {
      ws.current = new WebSocket("ws://localhost:8080/subscribeVault");

      ws.current.onopen = () => {
        console.log("WebSocket connection established");
        // Optionally, send a message to the server

        ws.current?.send(
          JSON.stringify({
            address: accountAddress,
            userType: "lp",
            vaultAddress: vaultAddress,
          })
        );
      };

      const wsCurrent = ws.current;
      ws.current.onmessage = (event: MessageEvent) => {
        console.log("Message from server:");
        const wsResponse: wsResponseType = JSON.parse(event.data);
        if (event.data.payloadType === "initial") {
          setWsVaultState(wsResponse.vaultState);
          setWsOptionRoundStates(wsResponse.optionRoundStates ?? []);
        } else if (wsResponse.payloadType === "lp_update ") {
          setWsLiquidityProviderState(
            wsResponse.liquidityProviderState ?? null
          );
        } else if (wsResponse.payloadType === "or_update") {
          setWsOptionRoundStates((states) => {
            if (wsResponse.optionRoundStates)
              states[Number(wsResponse.optionRoundStates?.[0].roundId)-1] =
                wsResponse.optionRoundStates[0];
            return states;
          });
        }
        else if (wsResponse.payloadType === "ob_update") {
          setWsOptionBuyerState(wsResponse.optionBuyerState ?? null);
        }
      };

      ws.current.onerror = (error: Event) => {
        console.error("WebSocket error:", error);
      };

      ws.current.onclose = () => {
        console.log("WebSocket connection closed");
      };
    } else {
      ws.current = null;
    }
    // Cleanup function to close the WebSocket connection when the component unmounts
    return () => {
      ws.current?.close();
    };
  }, [isRPC]);

  const { lpState: rpcLiquidityProviderState, vaultState: rpcVaultState, currentRoundAddress } = useVaultState(
    isRPC ? vaultAddress : ""
  );
  const vaultState = isRPC ? rpcVaultState : wsVaultState;
  const vaultActions = useVaultActions(vaultAddress);
  const lpState = isRPC ? rpcLiquidityProviderState : wsLiquidityProviderState;
  const {optionRoundState:rpcCurrentRoundState, optionBuyerState:rpcOptionBuyerState}   = useOptionRoundState(currentRoundAddress);
  const optionBuyerState = isRPC ? rpcOptionBuyerState : wsOptionBuyerState;
  const currentRoundState = isRPC ? rpcCurrentRoundState : wsOptionRoundStates[Number(vaultState?.currentRoundId)-1];
  const roundActions = useOptionRoundActions(currentRoundAddress);
  const [isProviderView, setIsProviderView] = useState(true);
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
        <PanelLeft {...mockVaultDetails} />

        <RoundPerformanceChart />

        <div className="w-full ml-6 max-w-[350px]">
          <PanelRight {...mockVaultDetails} />
        </div>
      </div>
    </div>
  );
};
