// import { Button, InputNumber } from "antd";
// // import { formatEther, parseEther } from "@ethersproject/units";
// // import { getDepositsControllerInstance, getERC20Instance, getPitchlakeVaultInstance } from "utils";
// // import { useEthers, useTokenAllowance, useTokenBalance } from "@usedapp/core";

// // import { BigNumber, ethers } from "ethers";
// import React, { useEffect } from "react";
// // import { Vault } from "types";
// import buttons from "styles/Button.module.css";
// import classes from "./Deposit.module.css";
// import inputs from "styles/Input.module.css";
// import { useState } from "react";
// // import useTransaction from "hooks/useTransaction";
// // import { DepositsRoundToken } from "cloud/types";
// import styles from "../../VaultTimeline/VaultTimeline.module.css";

// export default function Deposit({ vault, selectedRound }: { vault: Vault; selectedRound: number }) {
//   const { account } = useEthers();
//   const sendTransactionWithToasts = useTransaction();

//   const collateralGivenAllowance = useTokenAllowance(vault.referenceAsset, account, vault.depositsController);
//   const collateralBalance = useTokenBalance(vault.referenceAsset, account);

//   const [collateralRequirement, setCollateralRequirement] = useState(BigNumber.from(0));
//   const [notionals, setNotionals] = useState(BigNumber.from(0));
//   const [isDepositClickable, setIsDepositClickable] = useState(false);
//   const [isApproveClickable, setIsApproveClickable] = useState(false);

//   const [displayInsufficientBalance, setDisplayUnsufficientBalance] = useState(false);

//   const [roundTokenData, setRoundTokenData] = useState<DepositsRoundToken>({
//     depositsToken: "",
//     sharesPerDepositToken: "",
//   });

//   const roundTokenBalance = useTokenBalance(
//     roundTokenData.depositsToken.length === 42 ? roundTokenData.depositsToken : 0,
//     account
//   );

//   useEffect(() => {
//     const getRoundTokenData = async (selectedRound: number) => {
//       setRoundTokenData({
//         depositsToken: "loading...",
//         sharesPerDepositToken: "loading...",
//       });
//       let data = await fetch(window.location.origin + "/api/getDepositsRoundToken", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ round: selectedRound, depositsController: vault.depositsController }),
//       });
//       setRoundTokenData(await data.json());
//     };
//     if (vault) getRoundTokenData(selectedRound);
//   }, [selectedRound, vault]);

//   useEffect(() => {
//     console.log(roundTokenData);
//   }, [roundTokenData]);

//   const postNotionalChange = (value: number) => {
//     if (value < 1) {
//       setIsDepositClickable(false);
//       setIsApproveClickable(false);
//       return;
//     }

//     let notionals = BigNumber.from(0);

//     try {
//       notionals = BigNumber.from(Math.floor(value) || 0);
//     } catch (e) {}

//     setCollateralRequirement(notionals);

//     // if (!collateralBalance || !collateralGivenAllowance) return;

//     // if (collateralRequirement.gt(collateralBalance)) {
//     //   setDisplayUnsufficientBalance(true);
//     //   return;
//     // }

//     // setDisplayUnsufficientBalance(false);

//     // if (collateralRequirement.gt(collateralGivenAllowance)) {
//     //   setIsApproveClickable(true);
//     //   setIsDepositClickable(false);
//     //   return;
//     // }

//     setIsApproveClickable(true);
//     setIsDepositClickable(true);
//     setNotionals(notionals);
//   };

//   // const approveShares = async () => {
//   //   const approveTx = await getERC20Instance(roundTokenData.depositsToken).populateTransaction.approve(
//   //     vault.depositsController,
//   //     roundTokenBalance
//   //   );
//   //   sendTransactionWithToasts(approveTx, () => setIsDepositClickable(true));
//   // };

//   const approve = async () => {
//     const approveTx = await getERC20Instance(vault.referenceAsset).populateTransaction.approve(
//       vault.depositsController,
//       parseEther(notionals.toString())
//     );
//     sendTransactionWithToasts(approveTx, () => setIsDepositClickable(true));
//   };

//   const deposit = async () => {
//     const depositTx = await getDepositsControllerInstance(vault.depositsController).populateTransaction.deposit(
//       parseEther(notionals.toString()),
//       account
//     );
//     sendTransactionWithToasts(depositTx);
//   };

//   const claim = async () => {
//     const depositTx = await getDepositsControllerInstance(
//       vault.depositsController
//     ).populateTransaction.claimVaultShares(selectedRound, roundTokenBalance, account);
//     sendTransactionWithToasts(depositTx);
//   };

//   return (
//     <div className={classes.container}>
//       <p className={classes.title}>{vault.currentRound === selectedRound ? "Deposit" : "Claim Shares"}</p>
//       <div style={{ width: "100%" }}>
//         {vault.currentRound === selectedRound && (
//           <>
//             <InputNumber
//               className={inputs.input}
//               placeholder="Deposit Amount (ETH)"
//               onChange={postNotionalChange}
//               controls={false}
//             />
//             {displayInsufficientBalance && (
//               <span className={classes.insufficient}>
//                 Insufficient balance, required: <strong>{collateralRequirement.toString()}</strong>
//               </span>
//             )}
//             <div className={classes.controls}>
//               <Button
//                 style={{ flex: 1 }}
//                 className={buttons.button}
//                 title="approve"
//                 disabled={!isApproveClickable}
//                 onClick={approve}
//               >
//                 Approve
//               </Button>
//               <Button
//                 style={{ flex: 1 }}
//                 className={[buttons.button, buttons.confirm].join(" ")}
//                 title="deposit"
//                 disabled={!isDepositClickable || displayInsufficientBalance}
//                 onClick={deposit}
//               >
//                 Deposit
//               </Button>
//             </div>
//           </>
//         )}

//         {vault.currentRound !== selectedRound && (
//           <>
//             <div className={classes.valueRow}>
//               <p className={classes.text}>Shares Per Deposit Token:</p>
//               <p className={classes.value}>
//                 {!Number.isNaN(parseFloat(roundTokenData.sharesPerDepositToken))
//                   ? formatEther(roundTokenData.sharesPerDepositToken)
//                   : roundTokenData.sharesPerDepositToken}
//               </p>
//             </div>
//             <div className={classes.valueRow}>
//               <p className={classes.text}>Unclaimed Shares:</p>
//               <p className={classes.value}>{roundTokenBalance ? formatEther(roundTokenBalance) : "Loading..."}</p>
//             </div>
//             <div className={classes.controls}>
//               {/* <Button
//                 className={buttons.button}
//                 title="approve"
//                 disabled={!(roundTokenBalance && roundTokenBalance.gt(0))}
//                 onClick={approveShares}
//               >
//                 Approve
//               </Button> */}
//               <Button
//                 style={{ width: "100%" }}
//                 className={[buttons.button, buttons.confirm].join(" ")}
//                 title="deposit"
//                 disabled={!(roundTokenBalance && roundTokenBalance.gt(0))}
//                 onClick={claim}
//               >
//                 Claim
//               </Button>
//             </div>
//           </>
//         )}
//       </div>
//     </div>
//   );
// }
