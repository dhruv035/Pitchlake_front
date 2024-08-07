"use client";
import classes from "./page.module.css";
import { useAccount } from "@starknet-react/core";
import { useState } from "react";
import Head from "next/head";
import buttons from "@/styles/Button.module.css";
import inputs from "@/styles/Input.module.css"
import { shortenString } from "@/lib/utils";
import VaultHeader from "@/components/Vault/VaultHeader/VaultHeader";
import VaultActions from "@/components/Vault/VaultActions";
import useVaultState from "@/hooks/vault/useVaultState";
import useVaultActions from "@/hooks/vault/useVaultActions";
import { Button, InputNumber } from "antd";
import PlaceBid from "@/components/OptionRound/OptionRoundActions/PlaceBid";
import useOptionRoundActions from "@/hooks/optionRound/useOptionRoundActions";

export default function Home({
  params: { address: vaultAddress },
}: {
  params: { address: string };
}) {
  const { currentRoundState, state: vaultState } = useVaultState(vaultAddress);
  const vaultActions = useVaultActions(vaultAddress);
  const roundActions = useOptionRoundActions(currentRoundState.address)
  const { account } = useAccount();
  const [isModalVisible, setIsModalVisible] = useState<boolean>();

  const handleCreateClick = () => {};
  return (
    <div className={classes.container}>
      <Head>
        <title>Vault {shortenString(vaultAddress) || "..."} on PitchLake</title>
      </Head>
      {/* <VaultTimeline disabled vault={vault} /> */}
      
      <VaultHeader vault={vaultState} currentRoundState={currentRoundState} />
      <div className={classes.chartRow}>
        <div className={classes.chart}>
          {/* <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
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
        </div> */}
          {/* {chart == "current" ? (
          <CurrentBaseFeeChart vault={vault} />
        ) : (
          <BaseFeeChart vault={vault} selectedRound={selectedRound} setSelectedRound={setSelectedRound} />
        )} */}
        </div>
        {
          <VaultActions
            vaultState={vaultState}
            vaultActions={vaultActions}
            selectedRound={Number(currentRoundState.roundId)}
            // chart={chart}
            // setChart={setChart}
          />
        }
      </div>
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
      
    </div>
  );
}
