// import * as React from "react";

// import { useEthers, useTokenBalance } from "@usedapp/core";

// import buttons from "styles/Button.module.css";
// import { Button, InputNumber, Radio } from "antd";
// import { Vault } from "types";
// import classes from "./Deposit.module.css";
// import { getERC20Instance, getPitchlakeVaultInstance, getWithdrawControllerInstance } from "utils";
// import inputs from "styles/Input.module.css";
// import useTransaction from "hooks/useTransaction";
// import { useEffect, useState } from "react";
// import { formatEther, parseEther } from "ethers/lib/utils";
// import { WithdrawalsRoundToken } from "cloud/types";
// import styles from "../../VaultTimeline/VaultTimeline.module.css";

// export default function Withdraw({ vault, selectedRound }: { vault: Vault; selectedRound: number }) {
//   const sendTransactionWithToasts = useTransaction();
//   const { account } = useEthers();
//   const lpBalance = useTokenBalance(vault.address, account);

//   // const [selectedRound, setSelectedRound] = useState(vault.currentRound);
//   const [withdrawAmount, setWithdrawAmount] = useState("0");

//   const [roundTokenData, setRoundTokenData] = useState<WithdrawalsRoundToken>({
//     withdrawalsToken: "",
//     pricePerWithdrawalToken: "",
//   });

//   const roundTokenBalance = useTokenBalance(
//     roundTokenData.withdrawalsToken.length === 42 ? roundTokenData.withdrawalsToken : 0,
//     account
//   );

//   useEffect(() => {
//     if (lpBalance) setWithdrawAmount(lpBalance.toString());
//   }, [lpBalance]);

//   useEffect(() => {
//     const getRoundTokenData = async (selectedRound: number) => {
//       setRoundTokenData({
//         withdrawalsToken: "loading...",
//         pricePerWithdrawalToken: "loading...",
//       });
//       let data = await fetch(window.location.origin + "/api/getWithdrawalsRoundToken", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ round: selectedRound, withdrawalsController: vault.withdrawController }),
//       });
//       setRoundTokenData(await data.json());
//     };
//     if (vault) getRoundTokenData(selectedRound);
//   }, [selectedRound, vault]);

//   useEffect(() => {
//     console.log(roundTokenData);
//   }, [roundTokenData]);

//   const requestWithdraw = async () => {
//     const withdrawControllerInstance = getWithdrawControllerInstance(vault.withdrawController);
//     const withdrawTx = await withdrawControllerInstance.populateTransaction.requestWithdrawal(
//       parseEther(withdrawAmount),
//       account
//     );
//     sendTransactionWithToasts(withdrawTx);
//   };

//   // const approve = async () => {
//   //   const approveTx = await getERC20Instance(roundTokenData.withdrawalsToken).populateTransaction.approve(
//   //     vault.withdrawController,
//   //     roundTokenBalance
//   //   );
//   //   sendTransactionWithToasts(approveTx);
//   // };

//   const withdraw = async () => {
//     const withdrawTx = await getWithdrawControllerInstance(vault.withdrawController).populateTransaction.withdraw(
//       selectedRound,
//       roundTokenBalance,
//       account
//     );
//     sendTransactionWithToasts(withdrawTx);
//   };
//   return (
//     <div className={classes.container}>
//       <p className={classes.title}>{vault.currentRound === selectedRound ? "Queue withdrawal" : "Withdraw"}</p>
//       <div style={{ width: "100%" }}>
//         {vault.currentRound === selectedRound && (
//           <>
//             <InputNumber
//               defaultValue={lpBalance && formatEther(lpBalance)}
//               className={inputs.input}
//               placeholder="Withdraw Amount"
//               onChange={(value) => setWithdrawAmount(Number(value).toString())}
//               controls={false}
//             />
//             <div className={classes.controls}>
//               <Button
//                 style={{ width: "100%" }}
//                 className={buttons.button}
//                 title="approve"
//                 disabled={false}
//                 onClick={requestWithdraw}
//               >
//                 Request Withdrawal
//               </Button>
//             </div>
//           </>
//         )}

//         {vault.currentRound !== selectedRound && (
//           <>
//             <div className={classes.valueRow}>
//               <p className={classes.text}>Available to withdrawal:</p>
//               <p className={classes.value}> {roundTokenBalance ? formatEther(roundTokenBalance) : "Loading..."}</p>
//             </div>
//             {/* <Button
//               className={buttons.button}
//               title="approve"
//               disabled={!(roundTokenBalance && roundTokenBalance.gt(0))}
//               onClick={approve}
//             >
//               Approve
//             </Button> */}
//             <div className={classes.controls}>
//               <Button
//                 style={{ width: "100%" }}
//                 className={[buttons.button, buttons.confirm].join(" ")}
//                 title="deposit"
//                 disabled={!(roundTokenBalance && roundTokenBalance.gt(0))}
//                 onClick={withdraw}
//               >
//                 Withdraw
//               </Button>
//             </div>
//           </>
//         )}
//       </div>
//     </div>
//   );
// }
