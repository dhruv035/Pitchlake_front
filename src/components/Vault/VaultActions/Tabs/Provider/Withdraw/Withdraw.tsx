import * as React from "react";
import buttons from "@/styles/Button.module.css";
import { Button, InputNumber, Radio } from "antd";
import classes from "./Deposit.module.css";
import inputs from "@/styles/Input.module.css";
import { useState } from "react";
import { useAccount } from "@starknet-react/core";
import { TransactionResult, VaultStateType, WithdrawArgs } from "@/lib/types";

import { SidePanelState, WithdrawTabType } from "@/lib/types";
import ButtonTabs from "../../../ButtonTabs";
import InputField from "@/components/Vault/Utils/InputField";
import WithdrawQueue from "@/components/Vault/VaultActions/Tabs/Provider/Withdraw/WithdrawQueue";
import WithdrawCollect from "@/components/Vault/VaultActions/Tabs/Provider/Withdraw/WithdrawCollect";

interface WithdrawContentProps {
  state: SidePanelState;
  updateState: (updates: Partial<SidePanelState>) => void;
}

const Withdraw: React.FC<WithdrawContentProps> = ({ state, updateState }) => (
  <>
    <ButtonTabs
      tabs={["Liquidity", "Queue", "Collect"]}
      activeTab={state.activeWithdrawTab}
      setActiveTab={(tab) =>
        updateState({ activeWithdrawTab: tab as WithdrawTabType })
      }
    />
    {state.activeWithdrawTab === "Liquidity" && (
      <>
        <InputField
          label="Enter Amount"
          value={state.amount}
          onChange={(e) => updateState({ amount: e.target.value })}
          placeholder="e.g. 5"
        />
        <div className="flex justify-between text-sm mb-4">
          <span className="text-gray-400">Unlocked Balance</span>
          <span>34.8 ETH</span>
        </div>
      </>
    )}
    {state.activeWithdrawTab === "Queue" && (
      <WithdrawQueue state={state} updateState={updateState} />
    )}
    {state.activeWithdrawTab === "Collect" && <WithdrawCollect />}
  </>
);

export default Withdraw;

// export default function Withdraw({
//   vaultState,
//   withdraw,
// }: {
//   vaultState: VaultStateType;
//   withdraw: (
//     withdrawArgs: WithdrawArgs
//   ) => Promise<void>;
// }) {

//   // const [selectedRound, setSelectedRound] = useState(vault.currentRound);
//   const [withdrawAmount, setWithdrawAmount] = useState("0");
//   const { account } = useAccount();
//   // const approve = async () => {
//   //   const approveTx = await getERC20Instance(roundTokenData.withdrawalsToken).populateTransaction.approve(
//   //     vault.withdrawController,
//   //     roundTokenBalance
//   //   );
//   //   sendTransactionWithToasts(approveTx);
//   // };

//   return (
//     <div className={classes.container}>
//       <p className={classes.title}>{"Withdraw"}</p>
//       <div style={{ width: "100%" }}>
//         <>
//         <>Available Unlocked Balance:{vaultState.lpUnlockedAmount}</>
//           <InputNumber
//             defaultValue={vaultState?.lpUnlockedAmount?.toString()}
//             className={inputs.input}
//             placeholder="Withdraw Amount"
//             onChange={(value) => setWithdrawAmount(Number(value).toString())}
//             controls={false}
//           />
//           <div className={classes.controls}>
//             <Button
//               style={{ width: "100%" }}
//               className={buttons.button}
//               title="approve"
//               disabled={false}
//               onClick={async () =>
//                 await withdraw({ amount: BigInt(withdrawAmount) })
//               }
//             >
//               Request Withdrawal
//             </Button>
//           </div>
//         </>
//       </div>
//     </div>
//   );
// }
