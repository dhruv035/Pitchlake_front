import { useAccount } from "@starknet-react/core";
import {
  DepositArgs,
  LiquidityProviderStateType,
  PlaceBidArgs,
  RefundBidsArgs,
  VaultActionsType,
  VaultStateType,
  WithdrawArgs,
} from "@/lib/types";
import { useCallback, useMemo, useState } from "react";
import useMockOptionRound from "./useMockOptionRound";

const useMockVault = (address: string) => {
  const { address: accountAddress } = useAccount();
  //Read States

  const [vaultState, setVaultState] = useState<VaultStateType>({
    ethAddress: "",
    address: address,
    vaultType: "ATM",
    lockedBalance: "0",
    unlockedBalance: "1492",
    stashedBalance: "30",
    currentRoundId: 3,
  });
  //States without a param

  //Wallet states
  const [lpState, setLPState] = useState<LiquidityProviderStateType>({
    address: accountAddress??"",
    lockedBalance: "",
    unlockedBalance: "",
    stashedBalance: "",
  });

  const updateVaultState = (field: string, value: any) => {
    setVaultState((prevState) => ({
      ...prevState,
      [field]: value,
    }));
  };

  // Function to update a specific field in the LP state
  const currentRoundAddress = "";
  //Round Addresses and States
  const depositLiquidity = async (depositArgs: DepositArgs) => {
    setLPState((prevState) => {
      return {
        ...prevState,
        unlockedBalance: (
          BigInt(prevState.unlockedBalance) + BigInt(depositArgs.amount)
        ).toString(),
      };
    });
  };

  const withdrawLiquidity = async (withdrawArgs: WithdrawArgs) => {};
  const startAuction = async () => {
    setRound3State((prevState) => {
      return {
        ...prevState,
        roundState: "AUCTIONING",
      };
    });
  };
  const endAuction = async () => {
    setRound3State((prevState) => {
      return {
        ...prevState,
        roundState: "RUNNING",
      };
    });
  };

  const settleOptionRound = async () => {
    setRound3State((prevState) => {
      return {
        ...prevState,
        roundState: "SETTLED",
      };
    });
  };
  const { optionRoundState: round1State, roundActions: round1Actions, optionBuyerState:round1OB } =
    useMockOptionRound(1);
  const { optionRoundState: round2State, roundActions: round2Actions,optionBuyerState:round2OB } =
    useMockOptionRound(2);
  const {
    optionRoundState: round3State,
    roundActions: round3Actions,
    setOptionRoundState: setRound3State,
    optionBuyerState:round3OB
  } = useMockOptionRound(3);

  const vaultActions: VaultActionsType = {
    depositLiquidity,
    withdrawLiquidity,
    startAuction,
    endAuction,
    settleOptionRound,
  };

  return {
    vaultState,
    lpState,
    currentRoundAddress,
    vaultActions,
    optionRoundStates:[round1State,round2State,round3State],
    optionRoundActions:[round1Actions,round2Actions,round3Actions],
    optionBuyerStates:[round1OB,round2OB,round3OB]
  };
};

export default useMockVault;
