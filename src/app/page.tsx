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
    "0x5d3641202cb46479772cfe3be1fa1e3ef15c53c498c8f131fb5762f36470657",
    "0x5d3641202cb46479772cfe3be1fa1e3ef15c53c498c8f131fb5762f36470657",
  ];

  const [isModalVisible, setIsModalVisible] = useState<boolean>();
  const handleCreateClick = () => {};

  return (
    <div className='flex flex-grow flex-col px-8 mt-10 w-full '>
        <p className="my-2 text-base text-white-alt py-2">
          Popular Vaults
        </p>

        <div className="grid grid-cols-2 w-full py-8 gap-x-6 gap-y-4">
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
