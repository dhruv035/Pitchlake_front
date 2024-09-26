"use client";
import buttonClass from "@/styles/Button.module.css";
import styles from "./page.module.css";
import { useConnect } from "@starknet-react/core";
import { Button } from "antd";
import { useState } from "react";
import VaultCard from "@/components/Vault/VaultCard/VaultCard";

export default function Home() {
  const vaults = [
    "0x5d3641202cb46479772cfe3be1fa1e3ef15c53c498c8f131fb5762f36470657",
  ];

  const [isModalVisible, setIsModalVisible] = useState<boolean>();
  const handleCreateClick = () => {};

  return (
    <div className='flex flex-grow flex-col items-center justify-center '>
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
    </div>
  );
}
