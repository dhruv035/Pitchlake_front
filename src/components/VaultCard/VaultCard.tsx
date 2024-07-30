import { Progress } from "antd";

import Link from "next/link";
import { Vault } from "@/lib/types";
import styles from "./VaultCard.module.css";
import { useRouter } from "next/navigation";
import useVault from "@/hooks/useVault";
import { useEffect } from "react";
import { CairoCustomEnum } from "starknet";

export default function VaultCard({ vault }: { vault: Vault }) {
  const vaultNew = useVault(
    "0x6d162d274d1deffe7915bba69c72fa79ff74c6d766fb4dc94e27ae16d338ce8"
  );

  const router = useRouter();
  var myHeaders = new Headers();
  myHeaders.append("accept", "application/json");
  myHeaders.append("content-type", "application/json");

  return (
    <div
      className={styles.container}
      onClick={() => {
      }}
    >
      <div className={`${styles.titleBox} ${styles.row}`}>
        <p className={styles.title}>
          {vault.address} | {vault.address ? "PUT" : "CALL"}
        </p>
      </div>

      <div className={styles.flexGap}>
        <div
          className={styles.row}
          style={{ flex: 1, flexDirection: "column" }}
        >
          <p>
            <strong>Current Round</strong>
          </p>

          <div style={{ display: "flex" }}>
            <p>Round Id: &nbsp;</p>
            <p>
              <strong>{vaultNew.state.currentRoundId?.toString()}</strong>
            </p>
          </div>
          <div style={{ display: "flex" }}>
            <p>CapLevel: &nbsp;</p>
            <p>
              <strong>{Number(vaultNew.previousRound.state.capLevel || 0) / 100}%</strong>
            </p>
          </div>
          <div style={{ display: "flex" }}>
            <p>State: &nbsp;</p>
            <p>
              <strong>{vaultNew.currentRound.state.roundState?.activeVariant()}</strong>
            </p>
          </div>
        </div>

        <div
          className={styles.flexGap}
          style={{ flex: 1, flexDirection: "column" }}
        >
          <div className={styles.row}>
            <p>APY:&nbsp;</p>
            <p>
              <strong>{0}%</strong>
            </p>
          </div>
          <div className={styles.row}>
            <p>Fees:</p>
            <p>
              <strong>{0}%</strong>
            </p>
          </div>
        </div>
      </div>

      <div className={styles.row} style={{ gap: "5px", whiteSpace: "nowrap" }}>
        {/* <p>
            <strong>{formatEther(vault.tvl || 0).toString()} weth</strong>
          </p> */}
        <p>
          TLV: <strong>{(Number(vaultNew.state.vaultLockedAmount)+Number(vaultNew.state.vaultUnlockedAmount)/1000000000 || 0).toString()}&nbsp;gwei</strong>
        </p>
        <Progress
          percent={50}
          status="active"
          showInfo={false}
          strokeColor={"var(--orange)"}
        />
      </div>

      <div
        className={styles.row}
        style={{
          justifyContent: "flex-end",
          borderRadius: "0px 0px 10px 10px",
        }}
      >
        <p>Time Left:&nbsp;</p>
        <p>
          <strong></strong>
        </p>
      </div>
    </div>
  );
}
