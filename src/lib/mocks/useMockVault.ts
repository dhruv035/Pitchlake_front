import { useAccount } from "@starknet-react/core";
import { LiquidityProviderStateType, VaultStateType } from "@/lib/types";
import { useMemo, useState } from "react";

const useMockVault = (address: string) => {
  const { address: accountAddress } = useAccount();
  //Read States

  const [vaultState, setVaultState] = useState<VaultStateType>({
    ethAddress: "",
    address: "",
    vaultType:"",
    lockedBalance:"",
    unlockedBalance:"",
    stashedBalance:"",
    currentRoundId:"",
  });
  //States without a param

  //Wallet states
  const [lpState, setLPState] = useState<LiquidityProviderStateType>({
    address: "",
    lockedBalance: "",
    unlockedBalance: "",
    stashedBalance: "",
  });

  const currentRoundAddress = "";
  //Round Addresses and States

  return {
    vaultState,
    lpState,
    currentRoundAddress,
  };
};

export default useMockVault;
