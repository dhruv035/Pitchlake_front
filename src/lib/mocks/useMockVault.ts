import { useAccount } from "@starknet-react/core";
import {
  DepositArgs,
  LiquidityProviderStateType,
  VaultActionsType,
  VaultStateType,
  WithdrawLiquidityArgs,
  QueueWithdrawalArgs,
} from "@/lib/types";
import { useState } from "react";
import useMockOptionRound from "./useMockOptionRound";

const useMockVault = (address?: string) => {
  const { address: accountAddress } = useAccount();
  //Read States

  console.log("ADDRESS2", address);
  const [vaultState, setVaultState] = useState<VaultStateType>({
    ethAddress: "0x00",
    address: address ?? "0x1",
    vaultType: "ITM",
    lockedBalance: "0",
    unlockedBalance: "123456789123456789123",
    stashedBalance: "112233445566778899",
    currentRoundId: 3,
    alpha: "5555",
    strikeLevel: "-1111",
    queuedBps: "0",
  });
  //States without a param

  //Wallet states
  const [lpState, setLPState] = useState<LiquidityProviderStateType>({
    address: accountAddress ?? "0x1",
    lockedBalance: "12800000000000000000",
    unlockedBalance: "1500000000000000000",
    stashedBalance: "123000000000000000",
    queuedBps: "1234",
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
    // setLPState((prevState) => {
    //   return {
    //     ...prevState,
    //     unlockedBalance: (
    //       BigInt(prevState.unlockedBalance) + BigInt(depositArgs.amount)
    //     ).toString(),
    //   };
    // });
    await new Promise((resolve) => setTimeout(resolve, 1500));
  };

  const withdrawLiquidity = async (withdrawArgs: WithdrawLiquidityArgs) => {
    await new Promise((resolve) => setTimeout(resolve, 1500));
  };

  const withdrawStash = async () => {
    await new Promise((resolve) => setTimeout(resolve, 1500));
  };

  const queueWithdrawal = async (queueArgs: QueueWithdrawalArgs) => {
    await new Promise((resolve) => setTimeout(resolve, 1500));
  };

  const startAuction = async () => {
    setRound3State((prevState) => {
      return {
        ...prevState,
        roundState: "Auctioning",
      };
    });
  };
  const endAuction = async () => {
    setRound3State((prevState) => {
      return {
        ...prevState,
        roundState: "Running",
      };
    });
  };

  const settleOptionRound = async () => {
    setRound3State((prevState) => {
      return {
        ...prevState,
        roundState: "Settled",
      };
    });
  };
  const {
    optionRoundState: round1State,
    roundActions: round1Actions,
    optionBuyerState: round1OB,
  } = useMockOptionRound(1);
  const {
    optionRoundState: round2State,
    roundActions: round2Actions,
    optionBuyerState: round2OB,
  } = useMockOptionRound(2);
  const {
    optionRoundState: round3State,
    roundActions: round3Actions,
    setOptionRoundState: setRound3State,
    optionBuyerState: round3OB,
  } = useMockOptionRound(3);

  const vaultActions: VaultActionsType = {
    // User actions
    depositLiquidity,
    withdrawLiquidity,
    withdrawStash,
    queueWithdrawal,
    startAuction,
    endAuction,
    settleOptionRound,
  };

  return {
    vaultState,
    lpState,
    currentRoundAddress,
    vaultActions,
    optionRoundStates: [round1State, round2State, round3State],
    optionRoundActions: [round1Actions, round2Actions, round3Actions],
    optionBuyerStates: [round1OB, round2OB, round3OB],
  };
};

export default useMockVault;
