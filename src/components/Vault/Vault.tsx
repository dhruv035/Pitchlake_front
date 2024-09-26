import useOptionRoundActions from "@/hooks/optionRound/useOptionRoundActions";
import useVaultActions from "@/hooks/vault/useVaultActions";
import useVaultState from "@/hooks/vault/useVaultState";
import SidePanel from "./VaultActions/SidePanel";
import RoundPerformanceChart from "./VaultChart/Chart";
import { mockVaultDetails } from "../Vault/MockData";
import { useState } from "react";
import AuctionIcon from "../icons/Auction";
import CoinStackedIcon from "../icons/CoinStacked";

export const Vault = ({ vaultAddress }: { vaultAddress: string }) => {
  const { currentRoundState, state: vaultState } = useVaultState(vaultAddress);
  const vaultActions = useVaultActions(vaultAddress);
  const roundActions = useOptionRoundActions(currentRoundState.address);
  const [isProviderView, setIsProviderView] = useState(true);
  return (

      <div className="px-7 py-7 flex-grow overflow-auto">
        <div className="flex flex-row-reverse mt-6 text-primary p-4">
          <div className="flex flex-row mt-10 rounded-md border-[1px] border-greyscale-800">
            <div
            onClick={() => setIsProviderView(true)}
              className={`flex flex-row items-center m-[1px] hover:cursor-pointer p-4 rounded-md ${
                isProviderView ? "bg-primary-900" : ""
              }`}
            >
              <CoinStackedIcon classname="mr-2" stroke={isProviderView?"var(--primary)":"var(--greyscale)"}/>
              <p className={`${isProviderView?"text-primary":"text-greyscale"}`}>Provider</p>
            </div>
            <div
            onClick={() => setIsProviderView(false)}  
              className={`flex flex-row items-center m-[1px] hover:cursor-pointer p-4 rounded-md ${
                !isProviderView ? "bg-primary-900" : ""
              }`}
            >
             <AuctionIcon classname="mr-2" fill={isProviderView?"var(--greyscale)":"var(--primary)"}/>
              <p className={`${!isProviderView?"text-primary":"text-greyscale"}`}>Buyer</p>
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
