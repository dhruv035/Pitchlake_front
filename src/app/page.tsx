"use client";
import Image from "next/image";
import buttonClass from "@/styles/Button.module.css";
import styles from "./page.module.css";
import { useConnect } from "@starknet-react/core";
import { Button } from "antd";
import { useState } from "react";
import VaultCard from "@/components/VaultCard/VaultCard";
import { Vault } from "@/lib/types";

export default function Home() {
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
      <>
        <div className={styles.menu}>
          {/* <HandledDropdown
            onChange={handleDropdown}
            options={[
              { key: VaultsSorting.TVL_HIGH, render: "Higher TVL" },
              { key: VaultsSorting.TVL_LOW, render: "Lower TVL" },
            ]}
          >
            <Button className={[buttonClass.button, buttonClass.confirm].join(" ")} onClick={(e) => e.preventDefault()}>
              Sort by
              {vaults.sortingMethod ? (
                <>
                  : <strong>{vaults.sortingMethod}</strong>
                </>
              ) : (
                ""
              )}
              <DownOutlined />
            </Button>
          </HandledDropdown> */}
          <Button
            className={[buttonClass.button, buttonClass.confirm].join(" ")}
            onClick={handleCreateClick}
          >
            Create vault
          </Button>
        </div>
        <div className={styles.vaultList}>
          {vaults?.map((vault: Vault, idx: any) => (
            // <VaultTimeline key={vault.address + idx.toString()} vault={vault} />
            <VaultCard key={vault.address + idx} vault={vault} />
          ))}
          {/* <CreateVault {...{ handleCreateClick }} /> */}
        </div>
        {
          // <CreateVaultModal isModalVisible={isModalVisible} closeModal={() => setIsModalVisible(false)} />
        }
      </>
    </main>
  );
}
