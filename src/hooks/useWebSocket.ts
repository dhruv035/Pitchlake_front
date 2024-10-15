import { useEffect, useRef, useState } from "react";
import { VaultStateType, OptionRoundStateType, LiquidityProviderStateType, OptionBuyerStateType } from "@/lib/types";
import { useAccount } from "@starknet-react/core";

type wsResponseType = {
  payloadType: string;
  liquidityProviderState?: LiquidityProviderStateType;
  optionBuyerState?: OptionBuyerStateType;
  vaultState: VaultStateType;
  optionRoundStates?: OptionRoundStateType[];
};

const useWebSocketVault = (isRPC: boolean, vaultAddress: string) => {
  const [wsVaultState, setWsVaultState] = useState<VaultStateType | undefined>();
  const [wsOptionRoundStates, setWsOptionRoundStates] = useState<OptionRoundStateType[]>([]);
  const [wsLiquidityProviderState, setWsLiquidityProviderState] = useState<LiquidityProviderStateType | null>(null);
  const [wsOptionBuyerState, setWsOptionBuyerState] = useState<OptionBuyerStateType | null>(null);
  const ws = useRef<WebSocket | null>(null);
  const { address: accountAddress } = useAccount();

  useEffect(() => {
    if (!isRPC) {
      ws.current = new WebSocket("ws://localhost:8080/subscribeVault");

      ws.current.onopen = () => {
        console.log("WebSocket connection established");
        ws.current?.send(
          JSON.stringify({
            address: accountAddress,
            userType: "lp", // Adjust based on your logic
            vaultAddress: vaultAddress,
          })
        );
      };

      ws.current.onmessage = (event: MessageEvent) => {
        const wsResponse: wsResponseType = JSON.parse(event.data);
        if (wsResponse.payloadType === "initial") {
          setWsVaultState(wsResponse.vaultState);
          setWsOptionRoundStates(wsResponse.optionRoundStates ?? []);
        } else if (wsResponse.payloadType === "lp_update" && wsResponse.liquidityProviderState) {
          setWsLiquidityProviderState(wsResponse.liquidityProviderState);
        } else if (wsResponse.payloadType === "or_update" && wsResponse.optionRoundStates) {
            setWsOptionRoundStates((prevStates) => {
                const newStates = [...prevStates];
                if (
                  wsResponse.optionRoundStates &&
                  wsResponse.optionRoundStates.length > 0
                ) {
                  const updatedRound = wsResponse.optionRoundStates[0];
                  const updatedRoundIndex = Number(updatedRound.roundId) - 1;
                  newStates[updatedRoundIndex] = updatedRound;
                }
                return newStates;
              });
        } else if (wsResponse.payloadType === "ob_update" && wsResponse.optionBuyerState) {
          setWsOptionBuyerState(wsResponse.optionBuyerState);
        } else if (wsResponse.payloadType === "vault_update" && wsResponse.vaultState) {
          setWsVaultState(wsResponse.vaultState);
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

    return () => {
      ws.current?.close();
    };
  }, [isRPC, vaultAddress, accountAddress]);

  return {
    wsVaultState,
    wsOptionRoundStates,
    wsLiquidityProviderState,
    wsOptionBuyerState,
  };
};

export default useWebSocketVault;