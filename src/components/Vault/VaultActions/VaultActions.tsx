import Deposit from "./Tabs/Deposit";
import React from "react";
import { Tabs } from "antd";
//import Withdraw from "./Tabs/Withdraw";
import classes from "./VaultActions.module.css";
import { HistoryOutlined, LeftOutlined } from "@ant-design/icons/lib/icons";
import { useAccount } from "@starknet-react/core";
import {
  DepositArgs,
  TransactionResult,
  VaultActionsType,
  VaultState,
  WithdrawArgs,
} from "@/lib/types";

type Props = {
  vaultState: VaultState;
  vaultActions: VaultActionsType;
  selectedRound: number;
  chart?: string;
  setChart?: Function;
};

export default function VaultActions(props: Props) {
  const { vaultState, vaultActions, selectedRound, chart, setChart } = props;
  const { account } = useAccount();

  return (
    <div
      style={{
        width: "25%",
        display: "flex",
        flexDirection: "column",
        gap: "10px",
      }}
    >
      <div style={{ display: "flex", gap: "10px" }}>
        {Number(vaultState.currentRoundId) > 1 && (
          <div
            className={classes.buttonBack}
            onClick={
              () => {}
              //setChart(chart === "historical" ? "current" : "historical")
            }
          >
            {chart === "historical" ? <LeftOutlined /> : <HistoryOutlined />}
          </div>
        )}
        <div className={classes.round}>
          {`Round: ${selectedRound}`}
          {
            //selectedRound === vault.currentRound && " (Current)"
          }
        </div>
      </div>
      <Deposit
        vaultState={vaultState}
        deposit={vaultActions.depositLiquidity}
      />

      {/* {
        //Debug container should be removed
        account === "0x8a7f1b9ABC33083aecd0d7f024B5aC9BB78DC04f" && <Debug vault={vault} />
      } */}
    </div>
    // <Tabs className={classes.container}>
    //   <Tabs.TabPane tab="Deposit Liquidity" key="Deposit">
    //     <DepositTab vault={vault} selectedRound={selectedRound} />
    //   </Tabs.TabPane>
    //   <Tabs.TabPane tab="Withdraw Liquidity" key="Withdraw">
    //     <WithdrawTab vault={vault} selectedRound={selectedRound} />
    //   </Tabs.TabPane>
    //   <Tabs.TabPane tab="debug" key="debug">
    //     <DebugTab vault={vault} />
    //   </Tabs.TabPane>
    // </Tabs>
  );
}
