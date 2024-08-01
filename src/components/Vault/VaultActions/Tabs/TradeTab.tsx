// import * as React from "react";

// import { Button, Form, Input, InputNumber, Radio, Switch } from "antd";
// import { formatEther, parseEther } from "@ethersproject/units";
// import { getERC20Instance, getPitchlakeVaultInstance } from "utils";
// import { useEthers, useTokenAllowance, useTokenBalance } from "@usedapp/core";

// import { BigNumber } from "ethers";
// import { Vault } from "types";
// import buttons from "styles/Button.module.css";
// import classes from "./TradeTab.module.css";
// import common from "./AddLiquidityTab.module.css";
// import inputs from "styles/Input.module.css";
// import { useState } from "react";
// import useTransaction from "hooks/useTransaction";

// export default function TradeTab({ vault }: { vault: Vault }) {
//   const { account } = useEthers();
//   const sendTransactionWithToasts = useTransaction();
//   const [approved, setApproved] = useState(false);

//   const collateralGivenAllowance = useTokenAllowance(process.env.NEXT_PUBLIC_WETH_ADDRESS, account, vault.address);
//   const collateralBalance = useTokenBalance(process.env.NEXT_PUBLIC_WETH_ADDRESS, account);

//   const [notionals, setNotionals] = useState(BigNumber.from(0));
//   const [feeSlippage, setFeeSlippage] = useState(20); // 5%

//   const [isLong, setIsLong] = useState(true);

//   const [collateralRequirement, setCollateralRequirement] = useState(BigNumber.from(0));
//   const [expectedFee, setExpectedFee] = useState(BigNumber.from(0));
//   const [displayInsufficientBalance, setDisplayInsufficientBalance] = useState(false);

//   const trade = async () => {
//     const tradeTx = await getPitchlakeVaultInstance(vault.address).populateTransaction.trade(notionals, isLong);
//     sendTransactionWithToasts(tradeTx);
//   };
//   const approve = async () => {
//     const approveTx = await getERC20Instance(
//       // before: vault.collateral
//       vault.currentCl
//     ).populateTransaction.approve(vault.address, collateralRequirement);
//     sendTransactionWithToasts(approveTx, () => setApproved(true));
//   };

//   const recalculate = (notionals: BigNumber) => {
//     const equilibriumFee = calculateEquilibriumFee(vault, isLong, notionals);
//     let collateralRequirement = notionals
//       // .mul(vault.strike)
//       // .mul(vault.cr)
//       .mul(vault.currentStrike)
//       .div(parseEther("1"));

//     const liquidityFee = collateralRequirement
//       // before: .mul(vault.tradeFeeLevel)
//       .mul(vault.performanceFee)
//       .div(parseEther("1"));

//     collateralRequirement = collateralRequirement.add(equilibriumFee).add(liquidityFee);

//     const slippageCost = collateralRequirement.div(feeSlippage);

//     setExpectedFee(equilibriumFee.add(liquidityFee));
//     setCollateralRequirement(collateralRequirement.add(slippageCost));

//     if (collateralRequirement.gt(collateralBalance)) {
//       setDisplayInsufficientBalance(true);
//       return;
//     }
//     setDisplayInsufficientBalance(false);

//     if (collateralRequirement.gt(collateralGivenAllowance)) {
//       setApproved(false);
//       return;
//     }
//     setApproved(true);
//   };

//   const onNotionalChange = (value: number) => {
//     let newNotionals = BigNumber.from(0);

//     try {
//       newNotionals = BigNumber.from(Math.floor(value) || 0);
//     } catch (e) {}

//     setNotionals(newNotionals);
//     recalculate(newNotionals);
//   };

//   return (
//     <div className={common.container}>
//       <div className={classes.notionals}>
//         <span>Notionals</span>
//         <InputNumber className={inputs.input} placeholder="Notionals" controls={false} onChange={onNotionalChange} />
//       </div>
//       <Radio.Group value={isLong} onChange={(e) => setIsLong(e.target.value)} className={inputs.radioGroup}>
//         <Radio.Button value={true}>Long</Radio.Button>
//         <Radio.Button value={false}>Short</Radio.Button>
//       </Radio.Group>
//       <span>Fee slippage</span>
//       <Radio.Group
//         value={feeSlippage}
//         onChange={(e) => setFeeSlippage(e.target.value)}
//         className={[inputs.radioGroup, classes.feeSlippage].join(" ")}
//       >
//         <Radio.Button value={100}>1%</Radio.Button>
//         <Radio.Button value={50}>2%</Radio.Button>
//         <Radio.Button value={20}>5%</Radio.Button>
//       </Radio.Group>
//       {displayInsufficientBalance && (
//         <span className={common.insufficient}>
//           Insufficient balance, required: <strong>{collateralRequirement.toString()}</strong>
//         </span>
//       )}
//       <div className={common.controls}>
//         <Button
//           className={[buttons.button, buttons.confirm].join(" ")}
//           title="trade"
//           disabled={!approved || displayInsufficientBalance}
//           onClick={trade}
//         >
//           Trade
//         </Button>
//         <Button className={buttons.button} title="approve" disabled={approved || !notionals.gt(0)} onClick={approve}>
//           Approve
//         </Button>
//       </div>
//       <span className={common.required}>
//         Expected fee: <strong>{formatEther(expectedFee)}</strong>
//       </span>
//     </div>
//   );
// }

// const calculateEquilibriumFee = (vault: Vault, isLong: boolean, newNotional: BigNumber) => {
//   const calculateLiquidityUsed = (longNotionals: BigNumber, shortNotionals: BigNumber) =>
//     longNotionals
//       .sub(shortNotionals)
//       .abs()
//       // .mul(vault.strike)
//       // .mul(vault.cr)
//       .mul(vault.currentStrike)
//       .div(parseEther("1"));

//   const liquidityUsed = calculateLiquidityUsed(
//     // vault.longTokensSupply,
//     // vault.shortTokensSupply
//     BigNumber.from(0),
//     BigNumber.from(0)
//   );
//   // const liquidityUsedByTrade = calculateLiquidityUsed(
//   //   isLong ? vault.longTokensSupply.add(newNotional) : vault.longTokensSupply,
//   //   isLong ? vault.shortTokensSupply : vault.shortTokensSupply.add(newNotional)
//   // );
//   const liquidityUsedByTrade = calculateLiquidityUsed(
//     isLong ? BigNumber.from(0).add(newNotional) : BigNumber.from(0),
//     isLong ? BigNumber.from(0) : BigNumber.from(0).add(newNotional)
//   );
//   // const totalLiquidity = vault.lpTokensSupply
//   //   .mul(vault.strike)
//   //   .mul(vault.cr)
//   //   .div(parseEther("1"));
//   const totalLiquidity = BigNumber.from(1).mul(vault.currentStrike).div(parseEther("1"));
//   const fee = totalLiquidity.eq(0)
//     ? BigNumber.from(0)
//     : liquidityUsedByTrade.pow(2).sub(liquidityUsed.pow(2)).div(totalLiquidity.mul(2));
//   return fee;
// };
