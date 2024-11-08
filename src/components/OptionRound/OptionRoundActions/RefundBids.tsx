import { Button, InputNumber } from "antd";
// import { formatEther, parseEther } from "@ethersproject/units";
// import { getDepositsControllerInstance, getERC20Instance, getPitchlakeVaultInstance } from "utils";
// import { useEthers, useTokenAllowance, useTokenBalance } from "@usedapp/core";

// import { BigNumber, ethers } from "ethers";
import React, { useMemo } from "react";
// import { Vault } from "types";
import buttons from "@/styles/Button.module.css";
import classes from "./PlaceBid.module.css";
import inputs from "@/styles/Input.module.css";
import { useState } from "react";
// import useTransaction from "hooks/useTransaction";
// import { DepositsRoundToken } from "cloud/types";
import {
  OptionRoundStateType,
  PlaceBidArgs,
  RefundBidsArgs,
  VaultStateType,
} from "@/lib/types";
import useERC20 from "@/hooks/erc20/useERC20";
import { useAccount } from "@starknet-react/core";
import { useTransactionContext } from "@/context/TransactionProvider";

//export default function RefundBids({
//  vaultState,
//  optionRoundState,
//  refundBids,
//}: {
//  vaultState: VaultStateType;
//  optionRoundState: OptionRoundStateType;
//  refundBids: (refundBidArgs: RefundBidsArgs) => Promise<void>;
//}) {
//  const [amount, setAmount] = useState<string>("");
//  const [price, setPrice] = useState<string>("");
//  const { account } = useAccount();
//  const { isDev, devAccount } = useTransactionContext();
//  const [displayInsufficientBalance, setDisplayInsufficientBalance] =
//    useState<boolean>(false);
//
//  return (
//    <div className={classes.container}>
//      <p className={classes.title}>{"Refund Bids"}</p>
//      <div style={{ width: "100%" }}>
//        <Button
//          style={{ flex: 1 }}
//          className={[buttons.button, buttons.confirm].join(" ")}
//          title="Refund Bids"
//          disabled={
//            //!isDepositClickable || displayInsufficientBalance
//            false
//          }
//          onClick={async () => {
//            if (account)
//              await refundBids({
//                optionBuyer: account.address,
//              });
//          }}
//        >
//          Refund Bids
//        </Button>
//      </div>
//    </div>
//  );
//}
