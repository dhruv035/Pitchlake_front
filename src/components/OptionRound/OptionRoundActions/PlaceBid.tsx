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
  VaultStateType,
} from "@/lib/types";
import useERC20 from "@/hooks/erc20/useERC20";
import { useAccount } from "@starknet-react/core";
import { useTransactionContext } from "@/context/TransactionProvider";

export default function PlaceBid({
  vaultState,
  optionRoundState,
  placeBid,
}: {
  vaultState: VaultStateType;
  optionRoundState: OptionRoundStateType;
  placeBid: (placeBidArgs: PlaceBidArgs) => Promise<void>;
}) {
  const [amount, setAmount] = useState<string>("");
  const [price, setPrice] = useState<string>("");
  const { account } = useAccount();
  const { isDev, devAccount } = useTransactionContext();
  const [displayInsufficientBalance, setDisplayInsufficientBalance] =
    useState<boolean>(false);
  const { approve } = useERC20(vaultState.ethAddress, optionRoundState.address);

  //Update is approved when allowance is greater than amount

  const handleAmountChange = (value: string | null) => {
    if (value) setAmount(value);
    else setAmount("");
  };

  const handlePriceChange = (value: string | null) => {
    if (value) setPrice(value);
    else setPrice("");
  };

  return (
    <div className={classes.container}>
      <p className={classes.title}>{"Place Bid"}</p>
      <div style={{ width: "100%" }}>
        {
          <>
            <div style={{}}>
              <InputNumber
                className={inputs.input}
                placeholder="Bid Amount"
                onChange={handleAmountChange}
                controls={false}
              />
              <InputNumber
                className={inputs.input}
                placeholder="Bid Price (ETH)"
                onChange={handlePriceChange}
                controls={false}
              />
            </div>
            <div className={classes.controls}>
              <Button
                style={{ flex: 1 }}
                className={buttons.button}
                title="approve"
                disabled={false}
                onClick={async () =>
                  await approve({
                    amount: BigInt(amount),
                    spender: vaultState.address,
                  })
                }
              >
                Approve
              </Button>
              <Button
                style={{ flex: 1 }}
                className={[buttons.button, buttons.confirm].join(" ")}
                title="Place Bid"
                disabled={
                  //!isDepositClickable || displayInsufficientBalance
                  false
                }
                onClick={async () => {
                  await placeBid({
                    amount: BigInt(amount),
                    price: BigInt(price),
                  });
                }}
              >
                PlaceBid
              </Button>
            </div>
          </>
        }
      </div>
    </div>
  );
}
