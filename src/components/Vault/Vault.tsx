import useOptionRoundActions from "@/hooks/optionRound/useOptionRoundActions";
import useVaultActions from "@/hooks/vault/useVaultActions";
import useVaultState from "@/hooks/vault/useVaultState";
import Image from "next/image";
import { shortenString } from "@/lib/utils";
import Head from "next/head";
import coinstacked from "@/../public/coinstacked.svg";
import auction from "@/../public/auction.svg";
import SidePanel from "./VaultActions/SidePanel";
import RoundPerformanceChart from "./VaultChart/Chart";
import { mockVaultDetails } from "../Vault/MockData";
import { useState } from "react";

export const Vault = ({ vaultAddress }: { vaultAddress: string }) => {
  const { currentRoundState, state: vaultState } = useVaultState(vaultAddress);
  const vaultActions = useVaultActions(vaultAddress);
  const roundActions = useOptionRoundActions(currentRoundState.address);
  const [isProviderView, setIsProviderView] = useState(true);
  return (

      <div className="px-7 py-7 flex-grow overflow-auto">
        <div className="flex flex-row-reverse mt-6 text-primary p-4">
          <div className="flex flex-row mt-10 rounded-md bg-greyscale-800">
            <div
            onClick={() => setIsProviderView(true)}
              className={`flex flex-row items-center m-[1px] hover:cursor-pointer p-4 rounded-md ${
                isProviderView ? "bg-primary-900" : ""
              }`}
            >
              <Image
                src={coinstacked}
                alt="Coinstack"
                width={16}
                
                  className="mr-2"
                style={{ objectFit: "contain" }}
              />
              <p>Provider</p>
            </div>
            <div
            onClick={() => setIsProviderView(false)}  
              className={`flex flex-row items-center m-[1px] hover:cursor-pointer p-4 rounded-md ${
                !isProviderView ? "bg-primary-900" : ""
              }`}
            >
              <Image
                src={auction}
                alt="Pitchlake logo"
                width={16}
              
              className="mr-2"
                style={{ objectFit: "contain", fill: "#000000" }}
              />
              <p>Buyer</p>
            </div>
          </div>
        
        </div>
        <div className="mt-6 flex flex-row">
       
            <RoundPerformanceChart />
     
  
            <div className="w-full ml-6 max-w-[350px]">
              <SidePanel {...mockVaultDetails} />
            </div>
    
        </div>
      </div>


  );
};
