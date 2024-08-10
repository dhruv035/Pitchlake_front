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

export default function MintOptions({
  vaultState,
  optionRoundState,
  mintOptions,
}: {
  vaultState: VaultStateType;
  optionRoundState: OptionRoundStateType;
  mintOptions: () => Promise<void>;
}) {
  const { account } = useAccount();
  useState<boolean>(false);

  return (
    <div className={classes.container}>
      <p className={classes.title}>{"Mint Options"}</p>
      <div style={{ width: "100%" }}>
        <Button
          style={{ flex: 1 }}
          className={[buttons.button, buttons.confirm].join(" ")}
          title="Mint Options"
          disabled={
            //!isDepositClickable || displayInsufficientBalance
            false
          }
          onClick={async () => {
            if (account) await mintOptions();
          }}
        >
          Mint Options
        </Button>
      </div>
    </div>
  );
}
