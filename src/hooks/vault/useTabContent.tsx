import React, { useMemo } from "react";
import {
  VaultUserRole,
  RoundState,
  ProviderTabs,
  BuyerTabs,
  CommonTabs,
  VaultStateType,
  LiquidityProviderStateType,
  VaultActionsType,
  OptionRoundActionsType,
  OptionRoundStateType,
} from "@/lib/types";
import DepositContent from "@/components/Vault/VaultActions/Tabs/Provider/Deposit";
import Withdraw from "@/components/Vault/VaultActions/Tabs/Provider/Withdraw/Withdraw";
import PlaceBid from "@/components/Vault/VaultActions/Tabs/Buyer/PlaceBid";
import Mint from "@/components/Vault/VaultActions/Tabs/Buyer/Mint";
import History from "@/components/Vault/VaultActions/Tabs/Buyer/History";
import Exercise from "@/components/Vault/VaultActions/Tabs/Buyer/Exercise";
import Refund from "@/components/Vault/VaultActions/Tabs/Buyer/Refund";
import MyInfo from "@/components/Vault/VaultActions/Tabs/Provider/MyInfo";
import { mockHistoryItems } from "@/components/Vault/MockData";
import { useProtocolContext } from "@/context/ProtocolProvider";

export const useTabContent = (userType: string, activeTab: string,selectedRoundState:OptionRoundStateType|undefined) => {

  console.log("CHECK THIS",selectedRoundState)
  const commonTabs = [CommonTabs.MyInfo];
  const tabs = useMemo(() => {
    console.log("RERENDERED")
    if (userType === "lp") {
      return [...Object.values(ProviderTabs), ...commonTabs];
    } else {
      switch (selectedRoundState?.roundState) {
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
  }, [userType,selectedRoundState?.roundState]);

  const tabContent = useMemo(() => {
    switch (activeTab) {
      case ProviderTabs.Deposit:
        return <DepositContent showConfirmation={(amount, action) => {}} />;
      case ProviderTabs.Withdraw:
        return <Withdraw showConfirmation={(amount, action) => {}} />;
      case BuyerTabs.PlaceBid:
        return <PlaceBid showConfirmation={(amount, action) => {}} />;
      case BuyerTabs.History:
        return <History items={mockHistoryItems} />;
      case BuyerTabs.Refund:
        return <Refund showConfirmation={(amount, action)=>{}}/>;
      case BuyerTabs.Mint:
        return <Mint showConfirmation={(amount, action)=>{}}/>;
      case BuyerTabs.Exercise:
        return <Exercise />;
      case CommonTabs.MyInfo:
        return <MyInfo />;
      default:
        if (userType === "ob") {
        } else if (userType === "lp") {
          return <DepositContent showConfirmation={(amount, action) => {}} />;
        }
    }
  }, [userType, activeTab,selectedRoundState?.roundState]);


  return { tabs, tabContent };
};
