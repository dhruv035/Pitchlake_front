import { Progress } from "antd";

import Link from "next/link";
import { Vault } from "@/lib/types";
import styles from "./VaultCard.module.css";
import { useRouter } from "next/navigation";

export default function VaultCard({ vault }: { vault: Vault }) {

  const router = useRouter();
  return (

      <div className={styles.container} onClick={()=>{
        router.push(`/vaults/${vault.address}`);
      }}>
        <div className={`${styles.titleBox} ${styles.row}`}>
          <p className={styles.title}>
            {vault.address} | {vault.address ? "PUT" : "CALL"}
          </p>
        </div>

        <div className={styles.flexGap}>
          <div className={styles.row} style={{ flex: 1, flexDirection: "column" }}>
            <p>
              <strong>{vault.underlying?.toUpperCase()}</strong>
            </p>

            <div style={{ display: "flex" }}>
              <p>STRIKE: &nbsp;</p>
              <p>
                <strong>{vault.strikePrice} gwei</strong>
              </p>
            </div>
            <div style={{ display: "flex" }}>
              <p>CR: &nbsp;</p>
              <p>
                <strong>{Number(vault.capLevel || 0) * 100}%</strong>
              </p>
            </div>
          </div>

          <div className={styles.flexGap} style={{ flex: 1, flexDirection: "column" }}>
            <div className={styles.row}>
              <p>APY:&nbsp;</p>
              <p>
                <strong>{ 0}%</strong>
              </p>
            </div>
            <div className={styles.row}>
              <p>Fees:</p>
              <p>
                <strong>{ 0}%</strong>
              </p>
            </div>
          </div>
        </div>

        <div className={styles.row} style={{ gap: "5px", whiteSpace: "nowrap" }}>
          {/* <p>
            <strong>{formatEther(vault.tvl || 0).toString()} weth</strong>
          </p> */}
          <p>
            TLV: <strong>{(vault.totalLocked || 0).toString()}</strong>
          </p>
          <Progress percent={50} status="active" showInfo={false} strokeColor={"var(--orange)"} />
        </div>

        <div className={styles.row} style={{ justifyContent: "flex-end", borderRadius: "0px 0px 10px 10px" }}>
          <p>Time Left:&nbsp;</p>
          <p>
            <strong>
             
            </strong>
          </p>
        </div>
      </div>
  );
}
