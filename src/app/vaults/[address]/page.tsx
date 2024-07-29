"use client";
import react from "react"
import Image from "next/image";
import buttonClass from "@/styles/Button.module.css";
import styles from "./page.module.css";
import { useConnect } from "@starknet-react/core";
import { Button } from "antd";
import { useState } from "react";
import VaultCard from "@/components/VaultCard/VaultCard";
import { Vault } from "@/lib/types";

export default function Home({
  params: { address },
}: {
  params: { address: string };
}) {
  console.log("ADDRESS",address)
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
    <div className={styles.main}>
      <p>{address}</p>
    </div>
  );
}

