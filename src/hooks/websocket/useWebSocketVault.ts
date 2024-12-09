import { useEffect, useRef, useState } from "react";
import {
  VaultStateType,
  OptionRoundStateType,
  LiquidityProviderStateType,
  OptionBuyerStateType,
  Bid,
} from "@/lib/types";
import { useAccount } from "@starknet-react/core";
import { getPerformanceLP, getPerformanceOB } from "@/lib/utils";

type BidData = {
  operation: string;
  bid: Bid;
};
type wsResponseType = {
  payloadType: string;
  liquidityProviderState?: LiquidityProviderStateType;
  optionBuyerStates?: OptionBuyerStateType[];
  vaultState?: VaultStateType;
  optionRoundStates?: OptionRoundStateType[];
  bidData?: BidData;
};

const useWebSocketVault = (conn: string, vaultAddress?: string) => {
  const [wsVaultState, setWsVaultState] = useState<
    VaultStateType | undefined
  >();
  const [wsOptionRoundStates, setWsOptionRoundStates] = useState<
    OptionRoundStateType[]
  >([]);
  const [wsLiquidityProviderState, setWsLiquidityProviderState] = useState<
    LiquidityProviderStateType | undefined
  >();
  const [wsOptionBuyerStates, setWsOptionBuyerStates] = useState<
    OptionBuyerStateType[] | null
  >(null);
  const ws = useRef<WebSocket | null>(null);
  const { address: accountAddress } = useAccount();
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (conn === "ws" && isLoaded && vaultAddress) {
      ws.current = new WebSocket(
        `${process.env.NEXT_PUBLIC_WS_URL}/subscribeVault`
      );

      ws.current.onopen = () => {
        console.log("WebSocket connection established");
        ws.current?.send(
          JSON.stringify({
            address: accountAddress,
            userType: "ob", // Adjust based on your logic
            vaultAddress: vaultAddress,
          })
        );
      };

      ws.current.onmessage = (event: MessageEvent) => {
        const wsResponse: wsResponseType = JSON.parse(event.data);
        if (wsResponse.payloadType === "initial") {
          setWsVaultState(wsResponse.vaultState);
          const roundStates = wsResponse.optionRoundStates?.map((state) => {
            return {
              ...state,
              performanceLP: getPerformanceLP(
                state.soldLiquidity,
                state.premiums,
                state.totalPayout
              ),
              performanceOB: getPerformanceOB(
                state.premiums,
                state.totalPayout
              ),
            } as OptionRoundStateType;
          });
          setWsOptionRoundStates(roundStates ?? []);
          setWsLiquidityProviderState(
            wsResponse.liquidityProviderState?.address
              ? wsResponse.liquidityProviderState
              : undefined
          );
          setWsOptionBuyerStates(wsResponse.optionBuyerStates ?? []);
        } else if (wsResponse.payloadType === "account_update") {
          if (wsResponse.liquidityProviderState?.address)
            setWsLiquidityProviderState(wsResponse.liquidityProviderState);
          else {
            setWsLiquidityProviderState(undefined);
          }
          if (wsResponse.optionBuyerStates?.length)
            setWsOptionBuyerStates(wsResponse.optionBuyerStates);
          else {
            setWsOptionBuyerStates([]);
          }
        } else if (
          wsResponse.payloadType === "bid_update" &&
          wsResponse.bidData?.operation
        ) {
          if (wsResponse.bidData.operation === "insert") {
            setWsOptionBuyerStates((states) => {

              const newStates = states?.map((state) => {
                if (state.roundAddress === wsResponse.bidData?.bid.roundAddress)
                {
                  const bids = state.bids?.map((bid:Bid)=>{
                    return bid
                  })
                  return state
                }
                  return state;
              });

              return states;
            });
          }
        } else if (
          wsResponse.payloadType === "lp_update" &&
          wsResponse.liquidityProviderState
        ) {
          setWsLiquidityProviderState(wsResponse.liquidityProviderState);
        } else if (
          wsResponse.payloadType === "or_update" &&
          wsResponse.optionRoundStates
        ) {
          console.log("or_update",wsResponse)
          setWsOptionRoundStates((prevStates) => {
            const newStates = prevStates
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
        } else if (
          wsResponse.payloadType === "ob_update" &&
          wsResponse.optionBuyerStates
        ) {
          setWsOptionBuyerStates(wsResponse.optionBuyerStates);
        } else if (
          wsResponse.payloadType === "vault_update" &&
          wsResponse.vaultState
        ) {
          console.log("wsResponse.vault",wsResponse.vaultState)
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
  }, [conn, isLoaded, vaultAddress]);

  useEffect(() => {
    if (ws.current?.readyState === 1)
      try {
        ws.current?.send(
          JSON.stringify({
            updatedField: "address",
            updatedValue: accountAddress,
          })
        );
      } catch (err) {
        console.log(err);
      }
  }, [accountAddress]);

  return {
    wsVaultState,
    wsOptionRoundStates,
    wsLiquidityProviderState,
    wsOptionBuyerStates: wsOptionBuyerStates ?? [],
  };
};

export default useWebSocketVault;
