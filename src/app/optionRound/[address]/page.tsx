"use client";
import Image from "next/image";
import buttonClass from "@/styles/Button.module.css";
import styles from "./page.module.css";
import { useConnect } from "@starknet-react/core";
import { Button } from "antd";
import { useState } from "react";
import VaultCard from "@/components/VaultCard/VaultCard";
import { Vault } from "@/lib/types";

type PageParams ={
  params:{address:string}
}
const  Home:React.FC<PageParams>=({params:{address}}:PageParams)=> {
  const vaults: Array<Vault> = [
    {
      address: "0x1234",
      underlying: "ETH",
      strikePrice: "123",
      capLevel: "3000",
      totalLocked: "123",
      totalUnlocked: "124",
      currentRoundId: "2",
      auctionRunTime: 32,
      optionSettleTime: 32,
    } as Vault,
  ];
  const [isModalVisible, setIsModalVisible] = useState<boolean>();
  const handleCreateClick = () => {};
  return (
    <main className={styles.main}>
      <>{address}</>
    </main>
  );
}

export default Home
