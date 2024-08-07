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
  OptionRoundState,
  PlaceBidArgs,
  RefundBidsArgs,
  VaultState,
} from "@/lib/types";
import useERC20 from "@/hooks/erc20/useERC20";
import { useAccount } from "@starknet-react/core";
import { useTransactionContext } from "@/context/TransactionProvider";

export default function RefundBids({
  vaultState,
  optionRoundState,
  refundBids,
}: {
  vaultState: VaultState;
  optionRoundState: OptionRoundState;
  refundBids: (
    refundBidArgs: RefundBidsArgs
  ) => Promise<void>;
}) {
  const [amount, setAmount] = useState<string>("");
  const [price, setPrice] = useState<string>("");
  const { account } = useAccount();
  const { isDev, devAccount } = useTransactionContext();
  const [displayInsufficientBalance, setDisplayInsufficientBalance] =
    useState<boolean>(false);
  const { data, approve } = useERC20(vaultState.ethAddress, optionRoundState.address);


  //Update is approved when allowance is greater than amount
  const isApproved = useMemo(() => {
    if (data[0] && data[0] >= BigInt(amount)) {
      return true;
    } else return false;
  }, [data[0], amount]);

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
      <p className={classes.title}>{"Refund Bids"}</p>
      <div style={{ width: "100%" }}>
        {
          <>
          <div style={{}}>
            
              <Button
                style={{ flex: 1 }}
                className={[buttons.button, buttons.confirm].join(" ")}
                title="Refund Bids"
                disabled={
                  //!isDepositClickable || displayInsufficientBalance
                  false
                }
                onClick={async () => {
                    if(account)
                    await refundBids({
                      optionBuyer:account.address
                    });
                }}
              >
                Refund Bids
              </Button>
            </div>
          </>
        }
      </div>
    </div>
  );
}
