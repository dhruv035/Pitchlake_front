import { useEffect, useState } from "react";

import { TransactionStatus, useEthers, useTokenBalance } from "@usedapp/core";
import { Button, InputNumber, Radio } from "antd";
import { Vault } from "types";
import classes from "./Deposit.module.css";
import { getPitchlakeVaultInstance } from "utils";
import inputs from "styles/Input.module.css";
import useTransaction from "hooks/useTransaction";
import buttonClass from "styles/Button.module.css";
import { ethers } from "ethers";
import { parseEther, parseUnits } from "ethers/lib/utils";
import VaultABI from "abis/BaseOptionsSellingVault.json";
import PitchlakeOptionABI from "abis/PitchlakeOption.json";

export default function Debug({ vault }: { vault: Vault }) {
  const { account } = useEthers();
  const sendTransactionWithToasts = useTransaction();

  const [premium, setPremium] = useState("10");
  const [cl, setCl] = useState("0.1");
  const [strike, setStrike] = useState("100");

  const [twap, setTwap] = useState("100");

  const rollover = async () => {
    const vaultInstance = new ethers.Contract(vault.address, VaultABI);
    const creationTx = await vaultInstance.populateTransaction.rollToNextOption({
      premium: parseUnits(premium, "gwei"),
      strikeCoverage: parseEther(cl),
      strike: parseUnits(strike, "gwei"),
    });
    sendTransactionWithToasts(creationTx, (status: TransactionStatus) => {
      console.log("rollover successful");
    });
  };

  const settle = async () => {
    const activeOptionInstance = new ethers.Contract(vault.activeOption, PitchlakeOptionABI);
    const creationTx = await activeOptionInstance.populateTransaction.globalSettlement(parseUnits(twap, "gwei"));
    sendTransactionWithToasts(creationTx, (status: TransactionStatus) => {
      console.log("settle successful");
    });
  };

  return (
    <div className={classes.container}>
      <p className={classes.title}>Debug</p>
      <div className={classes.valueRow}>
        <p className={classes.text}>Premium (gwei):</p>
        <InputNumber
          style={{ width: "50%" }}
          defaultValue={premium}
          className={inputs.input}
          placeholder="Premium"
          onChange={(value) => setPremium(value.toString())}
          controls={false}
        />
      </div>
      <div className={classes.valueRow}>
        <p className={classes.text}>cl (eth):</p>
        <InputNumber
          style={{ width: "50%" }}
          defaultValue={cl}
          className={inputs.input}
          placeholder="cl"
          onChange={(value) => setCl(value.toString())}
          controls={false}
        />
      </div>
      <div className={classes.valueRow}>
        <p className={classes.text}>strike (gwei):</p>
        <InputNumber
          style={{ width: "50%" }}
          defaultValue={strike}
          className={inputs.input}
          placeholder="strike"
          onChange={(value) => setStrike(value.toString())}
          controls={false}
        />
      </div>
      <div className={classes.valueRow}>
        <p className={classes.text}>twap (gwei):</p>
        <InputNumber
          style={{ width: "50%" }}
          defaultValue={strike}
          className={inputs.input}
          placeholder="twap"
          onChange={(value) => setTwap(value.toString())}
          controls={false}
        />
      </div>
      <div className={classes.controls}>
        <Button style={{ flex: 1 }} className={[buttonClass.button, buttonClass.cancel].join(" ")} onClick={rollover}>
          Rollover
        </Button>
        <Button style={{ flex: 1 }} className={[buttonClass.button, buttonClass.cancel].join(" ")} onClick={settle}>
          Settle
        </Button>
      </div>
    </div>
  );
}
