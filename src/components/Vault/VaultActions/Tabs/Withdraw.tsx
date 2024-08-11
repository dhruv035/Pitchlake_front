import * as React from "react";
import buttons from "@/styles/Button.module.css";
import { Button, InputNumber, Radio } from "antd";
import classes from "./Deposit.module.css";
import inputs from "@/styles/Input.module.css";
import { useState } from "react";
import { useAccount } from "@starknet-react/core";
import { TransactionResult, VaultStateType, WithdrawArgs } from "@/lib/types";

export default function Withdraw({
  vaultState,
  withdraw,
}: {
  vaultState: VaultStateType;
  withdraw: (
    withdrawArgs: WithdrawArgs
  ) => Promise<void>;
}) {

  // const [selectedRound, setSelectedRound] = useState(vault.currentRound);
  const [withdrawAmount, setWithdrawAmount] = useState("0");
  const { account } = useAccount();
  // const approve = async () => {
  //   const approveTx = await getERC20Instance(roundTokenData.withdrawalsToken).populateTransaction.approve(
  //     vault.withdrawController,
  //     roundTokenBalance
  //   );
  //   sendTransactionWithToasts(approveTx);
  // };

  return (
    <div className={classes.container}>
      <p className={classes.title}>{"Withdraw"}</p>
      <div style={{ width: "100%" }}>
        <>
        <>Available Unlocked Balance:{vaultState.lpUnlockedAmount}</>
          <InputNumber
            defaultValue={vaultState?.lpUnlockedAmount?.toString()}
            className={inputs.input}
            placeholder="Withdraw Amount"
            onChange={(value) => setWithdrawAmount(Number(value).toString())}
            controls={false}
          />
          <div className={classes.controls}>
            <Button
              style={{ width: "100%" }}
              className={buttons.button}
              title="approve"
              disabled={false}
              onClick={async () =>
                await withdraw({ amount: BigInt(withdrawAmount) })
              }
            >
              Request Withdrawal
            </Button>
          </div>
        </>
      </div>
    </div>
  );
}
