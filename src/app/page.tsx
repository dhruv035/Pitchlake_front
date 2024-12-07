"use client";
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
    return (
      <div className="flex flex-row items-center justify-center absolute top-0 left-0 right-0 bottom-0">
        <div className="flex flex-col items-center p-6 mb-4 bg-[#121212] border border-[#262626] rounded-lg flex flex-col max-w-[326px] m-5">
          <div className="bg-[#F5EBB8] rounded-full w-[48px] h-[48px] flex items-center justify-center mx-auto mb-6 border-[8px] border-[#524F44]">
            <span className="text-black text-2xl font-bold ">!</span>
          </div>

          <h2 className="text-center text-white text-[16px] my-[0.5rem]">
            Device Not Supported
          </h2>
          <p className="text-gray-400 text-center text-[14px]">
            Please use a desktop or laptop to access Pitchlake.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-grow flex-col px-8 mt-6 w-full ">
      <p className="my-2 text-base text-white-alt py-2 font-medium">
        Popular Vaults
      </p>
      <div className="grid grid-cols-2 w-full pt-6 gap-x-6 gap-y-6">
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
