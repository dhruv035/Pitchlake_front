import React from "react";
import {
  VaultUserRole,
  RoundState,
  ProviderTabs,
  BuyerTabs,
  CommonTabs,
  VaultStateType,
  LiquidityProviderStateType,
} from "@/lib/types";
import DepositContent from "@/components/Vault/VaultActions/Tabs/Provider/Deposit";
import Withdraw from "@/components/Vault/VaultActions/Tabs/Provider/Withdraw/Withdraw";
import PlaceBid from "@/components/Vault/VaultActions/Tabs/Buyer/PlaceBid";
import Mint from "@/components/Vault/VaultActions/Tabs/Buyer/Mint";
import History from "@/components/Vault/VaultActions/Tabs/Buyer/History";
import Exercise from "@/components/Vault/VaultActions/Tabs/Buyer/Exercise";
import Refund from "@/components/Vault/VaultActions/Tabs/Buyer/Refund";
import useVaultState from "@/hooks/vault/useVaultState";
import MyInfo from "@/components/Vault/VaultActions/Tabs/Provider/MyInfo";
import { mockHistoryItems } from "@/components/Vault/MockData";

export const useTabContent = (
  userType:string,
  roundState: string,
  vaultState: VaultStateType,
  lpState: LiquidityProviderStateType,
) => {

  const getTabs = (): string[] => {
    const commonTabs = [CommonTabs.MyInfo];

    if (userType === VaultUserRole.Provider) {
      if (roundState === "Settle") {
        return commonTabs;
      } else {
        return [...Object.values(ProviderTabs), ...commonTabs];
      }
    } else {
      switch (roundState) {
        case "Open":
          return [];
        case "Auctioning":
          return [BuyerTabs.PlaceBid, BuyerTabs.History, ...commonTabs];
        case "Running":
          return [BuyerTabs.Refund, BuyerTabs.Mint, ...commonTabs];
        case "Settled":
          return [BuyerTabs.Refund, BuyerTabs.Exercise, ...commonTabs];
        default:
          return [];
      }
    }
  };

  const getTabContent = (activeTab: string): React.ReactNode => {
    switch (activeTab) {
      case ProviderTabs.Deposit:
        return (
          <DepositContent
            showConfirmation={(amount, action) => {}}
            vaultState={vaultState}
          />
        );
      case ProviderTabs.Withdraw:
        return (
          <Withdraw
            lpState={lpState}
            vaultState={vaultState}
            showConfirmation={(amount, action) => {}}
          />
        );
      case BuyerTabs.PlaceBid:
        return <PlaceBid showConfirmation={(amount, action) => {}} />;
      case BuyerTabs.History:
        return <History items = {mockHistoryItems}/>;
      case BuyerTabs.Refund:
        return <Refund />;
      case BuyerTabs.Mint:
        return <Mint />;
      case BuyerTabs.Exercise:
        return <Exercise />;
      case CommonTabs.MyInfo:
        return <MyInfo />;
      default:
        return null;
    }
  };

  return { getTabs, getTabContent };
};
