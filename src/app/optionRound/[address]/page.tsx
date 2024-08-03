"use client";
import styles from "./page.module.css";
import { useState } from "react";
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
