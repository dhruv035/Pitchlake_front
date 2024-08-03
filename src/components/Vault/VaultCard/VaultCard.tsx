import { Progress } from "antd";
import styles from "./VaultCard.module.css";
import { useRouter } from "next/navigation";
import { shortenString } from "@/lib/utils";
import useVaultState from "@/hooks/vault/useVaultState";

export default function VaultCard({ vaultAddress }: { vaultAddress: string }) {
  const vaultNew = useVaultState(vaultAddress);

  const router = useRouter();
  var myHeaders = new Headers();
  myHeaders.append("accept", "application/json");
  myHeaders.append("content-type", "application/json");

  return (
    <div
      className={styles.container}
      onClick={() => {
        router.push(`/vaults/${vaultAddress}`);
      }}
    >
      <div className={`${styles.titleBox} ${styles.row}`}>
        <p className={styles.title}>
          {shortenString(vaultAddress)} |{" "}
          {vaultNew.state.vaultType?.activeVariant()}
        </p>
      </div>

      <div className={styles.flexGap}>
        <div
          className={styles.row}
          style={{ flex: 1, flexDirection: "column" }}
        >
          <p>
            <strong>Previous Round</strong>
          </p>

          <div style={{ display: "flex" }}>
            <p>Round Id: &nbsp;</p>
            <p>
              <strong>
                {vaultNew.previousRoundState.roundId?.toString()}
              </strong>
            </p>
          </div>
          <div style={{ display: "flex" }}>
            <p>CapLevel: &nbsp;</p>
            <p>
              <strong>
                {Number(vaultNew.previousRoundState.capLevel || 0) / 100}%
              </strong>
            </p>
          </div>
          <div style={{ display: "flex" }}>
            <p>State: &nbsp;</p>
            <p>
              <strong>
                {vaultNew.previousRoundState.roundState?.activeVariant()}
              </strong>
            </p>
          </div>
        </div>
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
              <strong>{vaultNew.currentRoundState.roundId?.toString()}</strong>
            </p>
          </div>
          <div style={{ display: "flex" }}>
            <p>CapLevel: &nbsp;</p>
            <p>
              <strong>
                {Number(vaultNew.currentRoundState.capLevel || 0) / 100}%
              </strong>
            </p>
          </div>
          <div style={{ display: "flex" }}>
            <p>State: &nbsp;</p>
            <p>
              <strong>
                {vaultNew.currentRoundState.roundState?.activeVariant()}
              </strong>
            </p>
          </div>
          <div style={{ display: "flex" }}>
            <p>StartDate: &nbsp;</p>
            <p>
              <strong>
                {vaultNew.currentRoundState.auctionStartDate?.toUTCString()}
              </strong>
            </p>
          </div>
          <div style={{ display: "flex" }}>
            <p>Auction End Date: &nbsp;</p>
            <p>
              <strong>
                {vaultNew.currentRoundState.auctionEndDate?.toUTCString()}
              </strong>
            </p>
          </div>
          <div style={{ display: "flex" }}>
            <p>Option Settle Date: &nbsp;</p>
            <p>
              <strong>
                {vaultNew.currentRoundState.optionSettleDate?.toUTCString()}
              </strong>
            </p>
          </div>
        </div>

        {/* <div
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
        </div> */}
      </div>

      <div className={styles.row} style={{ gap: "5px", whiteSpace: "nowrap" }}>
        {/* <p>
            <strong>{formatEther(vault.tvl || 0).toString()} weth</strong>
          </p> */}
        <p>
          TLV:{" "}
          <strong>
            {(
              Number(vaultNew.state.vaultLockedAmount) +
                Number(vaultNew.state.vaultUnlockedAmount) / 1000000000 || 0
            ).toString()}
            &nbsp;gwei
          </strong>
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
        <p>
          Time Left:&nbsp;
          {vaultNew.currentRoundState.auctionEndDate?.toString()}
        </p>
        <p>
          <strong></strong>
        </p>
      </div>
    </div>
  );
}
