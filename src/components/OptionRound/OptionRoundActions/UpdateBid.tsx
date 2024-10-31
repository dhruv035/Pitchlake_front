import { Button, InputNumber } from "antd";
import buttons from "@/styles/Button.module.css";
import classes from "./PlaceBid.module.css";
import inputs from "@/styles/Input.module.css";
import { useState } from "react";
import {
  OptionRoundStateType,
  UpdateBidArgs,
  VaultStateType,
} from "@/lib/types";
import useERC20 from "@/hooks/erc20/useERC20";
import { useAccount } from "@starknet-react/core";
import { useTransactionContext } from "@/context/TransactionProvider";

export default function UpdateBid({
  vaultState,
  optionRoundState,
  updateBid,
}: {
  vaultState: VaultStateType;
  optionRoundState: OptionRoundStateType;
  updateBid: (updateBid: UpdateBidArgs) => Promise<void>;
}) {
  const [amount, setAmount] = useState<string>("");
  const [price, setPrice] = useState<string>("");
  const [bidId, setBidId] = useState<string>("");
  const { account } = useAccount();
  const { isDev, devAccount } = useTransactionContext();

  const { approve } = useERC20(vaultState.ethAddress, optionRoundState.address);

  const handleAmountChange = (value: string | null) => {
    if (value) setAmount(value);
    else setAmount("");
  };

  const handlePriceChange = (value: string | null) => {
    if (value) setPrice(value);
    else setPrice("");
  };

  const handleBidIdChange = (value: string | null) => {
    if (value) setBidId(value);
    else setBidId("");
  };

  return (
    <div className={classes.container}>
      <p className={classes.title}>{"Update Bid"}</p>
      <div style={{ width: "100%" }}>
        {
          <>
            <div style={{}}>
              {
                //Change to select Element with list of placed bids
                <InputNumber
                  className={inputs.input}
                  placeholder="Bid Id"
                  onChange={handleBidIdChange}
                  controls={false}
                />
              }
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
                title="Update Bid"
                disabled={
                  //!isDepositClickable || displayInsufficientBalance
                  false
                }
                onClick={async () => {
                  if (isDev) {
                    if (devAccount)
                      await updateBid({
                        bidId,
                        priceIncrease: BigInt(price),
                      });
                  }
                  if (account)
                    await updateBid({
                      bidId,
                      priceIncrease: BigInt(price),
                    });
                }}
              >
                UpdateBid
              </Button>
            </div>
          </>
        }
      </div>
    </div>
  );
}
