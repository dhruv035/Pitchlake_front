"use client";
import MobileScreen from "@/components/BaseComponents/MobileScreen";
import VaultCard from "@/components/VaultCard/VaultCard";
import useWebSocketHome from "@/hooks/websocket/useWebSocketHome";
import useIsMobile from "@/hooks/window/useIsMobile";

export default function Home() {
  const { vaults: wsVaults } = useWebSocketHome();
  const vaults =
    process.env.NEXT_PUBLIC_ENVIRONMENT === "ws"
      ? wsVaults
      : process.env.NEXT_PUBLIC_VAULT_ADDRESSES?.split(",");

  const { isMobile } = useIsMobile();

  if (isMobile) {
    return <MobileScreen />;
  }

  return (
    <div className="flex flex-grow flex-col px-8 mt-4 w-full ">
      <p className="my-2 text-base text-white-alt py-2 font-medium">
        Popular Vaults
      </p>
      <div className="grid grid-cols-2 w-full pt-4 gap-x-6 gap-y-6">
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
