// import { Progress } from "antd";

// import { formatEther } from "ethers/lib/utils";
// import moment from "moment";
// import Link from "next/link";
// import { Vault } from "types";
// import { getVaultName, parseStrike } from "utils";
// import styles from "./VaultCard.module.css";

// export default function VaultCard({ vault }: { vault: Vault }) {
//   return (
//     <Link href={`/vaults/${vault.address}`} passHref>
//       <div className={styles.container}>
//         <div className={`${styles.titleBox} ${styles.row}`}>
//           <p className={styles.title}>
//             {getVaultName(vault)} | {vault.isPut ? "PUT" : "CALL"}
//           </p>
//         </div>

//         <div className={styles.flexGap}>
//           <div className={styles.row} style={{ flex: 1, flexDirection: "column" }}>
//             <p>
//               <strong>{vault.underlying?.toUpperCase()}</strong>
//             </p>

//             <div style={{ display: "flex" }}>
//               <p>STRIKE:&nbsp;</p>
//               <p>
//                 <strong>{parseStrike(vault.currentStrike)} gwei</strong>
//               </p>
//             </div>
//             <div style={{ display: "flex" }}>
//               <p>CR:&nbsp;</p>
//               <p>
//                 <strong>{Number(formatEther(vault.currentCl || 0)) * 100}%</strong>
//               </p>
//             </div>
//           </div>

//           <div className={styles.flexGap} style={{ flex: 1, flexDirection: "column" }}>
//             <div className={styles.row}>
//               <p>APY:&nbsp;</p>
//               <p>
//                 <strong>{vault.apy || 0}%</strong>
//               </p>
//             </div>
//             <div className={styles.row}>
//               <p>Fees:</p>
//               <p>
//                 <strong>{vault.performanceFee || 0}%</strong>
//               </p>
//             </div>
//           </div>
//         </div>

//         <div className={styles.row} style={{ gap: "5px", whiteSpace: "nowrap" }}>
//           {/* <p>
//             <strong>{formatEther(vault.tvl || 0).toString()} weth</strong>
//           </p> */}
//           <p>
//             TLV: <strong>{formatEther(vault.tvl || 0).toString()}</strong>
//           </p>
//           <Progress percent={50} status="active" showInfo={false} strokeColor={"var(--orange)"} />
//           <p>
//             <strong>{formatEther(vault.tvlCap || 0).toString()}</strong> WETH
//           </p>
//         </div>

//         <div className={styles.row} style={{ justifyContent: "flex-end", borderRadius: "0px 0px 10px 10px" }}>
//           <p>Time Left:&nbsp;</p>
//           <p>
//             <strong>
//               {vault.duration + vault.lastRollover - Math.floor(Date.now() / 1000) < 0 ? "ended" : ""}{" "}
//               {moment.duration(vault.duration + vault.lastRollover - Math.floor(Date.now() / 1000), "s").humanize()}{" "}
//               {vault.duration + vault.lastRollover - Math.floor(Date.now() / 1000) < 0 ? "ago" : "left"}
//             </strong>
//           </p>
//         </div>
//       </div>
//     </Link>
//   );
// }
