"use client";
import buttonClass from "@/styles/Button.module.css";
import styles from "./page.module.css";
import { useConnect } from "@starknet-react/core";
import { Button } from "antd";
import { useState } from "react";
import VaultCard from "@/components/Vault/VaultCard/VaultCard";

export default function Home() {
  const vaults = [
    "0x7a2f70d96ab0ce3de438dec33b822da36a5efc5a9b5de6972508d1defad2204",
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
          {vaults?.map((vault: string, index: number) => (
            // <VaultTimeline key={vault.address + idx.toString()} vault={vault} />
            <VaultCard key={index} vaultAddress={vault} />
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
