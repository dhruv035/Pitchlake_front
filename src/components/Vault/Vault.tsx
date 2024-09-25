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
    <div className="h-full flex flex-col overflow-hidden">
      <Head>
        <title>Vault {shortenString(vaultAddress) || "..."} on PitchLake</title>
      </Head>

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
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-9">
            <RoundPerformanceChart />
          </div>
          <div className="w-full lg:col-span-3 flex justify-center lg:justify-start">
            <div className="w-full sm:w-[350px] lg:w-full">
              <SidePanel {...mockVaultDetails} />
            </div>
          </div>
        </div>
      </div>

      {/* <div className={classes.chartRow}>
        <div className={classes.chart}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <p className={classes.baseFee}>
            Current Base Fee:&nbsp;
            {vault.baseFeeRecords
              ? Number(
                  formatUnits(
                    vault.baseFeeRecords.length ? [...vault.baseFeeRecords].pop().value || "0" : "0",
                    "gwei"
                  )
                ).toFixed(2)
              : "loading ..."}{" "}
            gwei
          </p>
        </div>
          {chart == "current" ? (
          <CurrentBaseFeeChart vault={vault} />
        ) : (
          <BaseFeeChart vault={vault} selectedRound={selectedRound} setSelectedRound={setSelectedRound} />
        )}
        </div>
        
          <VaultActions
            vaultState={vaultState}
            vaultActions={vaultActions}
            selectedRound={Number(currentRoundState.roundId)}
            // chart={chart}
            // setChart={setChart}
          />
        
      </div> */}
      {/* <div className={classes.actions}>
      <VaultActions vault={vault} selectedRound={selectedRound} />
       <div>
        <Radio.Group disabled className={[inputs.radioGroup, classes.tokens].join(" ")}>
          <Radio.Button>lpTokensBalance:</Radio.Button>
          <Radio.Button>{lpTokensBalance ? formatEther(lpTokensBalance) : "loading ..."}</Radio.Button>
        </Radio.Group>
        <Radio.Group disabled className={[inputs.radioGroup, classes.tokens].join(" ")}>
          <Radio.Button>price per share:</Radio.Button>
          <Radio.Button>{formatEther(vault.pricePerShare || 0)} weth</Radio.Button>
        </Radio.Group>
        <Radio.Group disabled className={[inputs.radioGroup, classes.tokens].join(" ")}>
          <Radio.Button>scheduledDepositsAmount:</Radio.Button>
          <Radio.Button>{formatEther(vault.scheduledDepositsAmount || 0)} weth</Radio.Button>
        </Radio.Group>
        <Radio.Group disabled className={[inputs.radioGroup, classes.tokens].join(" ")}>
          <Radio.Button>scheduledWithdrawalsAmount:</Radio.Button>
          <Radio.Button>{formatEther(vault.scheduledWithdrawalsAmount || 0)} weth</Radio.Button>
        </Radio.Group>
      </div>
    </div>
    <VaultHistory vault={vault} /> */}
      {/* <StateTransition vaultActions={vaultActions} optionRoundState={currentRoundState}/>
      <OptionRound
          vaultState={vaultState}
          roundState={currentRoundState}
          roundActions={roundActions}
        /> */}
    </div>
  );
};
