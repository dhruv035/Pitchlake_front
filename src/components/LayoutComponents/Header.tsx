"use client";
import { Badge, Button, Popover } from "antd";
import React, { useMemo, useState } from "react";

import Image from "next/image";
import Link from "next/link";
import buttonClass from "@/styles/Button.module.css";
import classes from "./Header.module.css";
import { colors } from "@/styles/colors";
import logo from "@/../public/logo.svg";
import {
  useAccount,
  useBalance,
  useConnect,
  useDisconnect,
} from "@starknet-react/core";
import { copyToClipboard, shortenString } from "@/lib/utils";
import { useTransactionContext } from "@/context/TransactionProvider";

export default function Header() {
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const { account } = useAccount();
  const { isDev, setIsDev } = useTransactionContext();
  const { data } = useBalance({
    address: account?.address,
    watch: true,
  });

  //Add transaction type to store this
  const transactions: Array<any> = useState();
  const copyAddress = () =>
    account?.address &&
    copyToClipboard(account.address).then(() => {
      //toast("Address copied to clipboard!", { autoClose: 1000 })
    });

  const transactionsPopover = useMemo(
    () => (
      <>
        {transactions.map((tx) => {
          if (tx?.transaction) {
            return (
              <p
                key={tx.transaction.hash}
                onClick={() => copyTxHash(tx.transaction.hash)}
                title="Copy transaction hash to clipboard"
              >
                <span>{tx.transaction.hash}: </span>
                <strong>{tx.receipt ? "Confirmed" : "Pending"}</strong>
              </p>
            );
          }
        })}
      </>
    ),
    [transactions]
  );
  return (
    <div className={classes.header}>
      <div className={classes.logo}>
        <Link legacyBehavior href="https://www.oiler.network/" passHref>
          <a target="_blank" rel="noreferrer">
            <Image
              className={classes.logoImage}
              alt="Oiler network logo"
              src={logo}
            />
          </a>
        </Link>
        <span>.</span>
        <Link legacyBehavior href="/" passHref>
          <a>PitchLake</a>
        </Link>
      </div>
      <div className={classes.wallet}>
        {account ? (
          <>
            <Popover
              content={transactionsPopover}
              title="Transactions"
              trigger="hover"
              className={classes.transactions}
              overlayClassName={classes.transactionsOverlay}
            >
              <Badge count={transactions.length} color={colors.orange}>
                <Button
                  title="Copy address to clipboard"
                  className={buttonClass.button}
                  onClick={copyAddress}
                >
                  address:
                  <strong> {shortenString(account.address)} </strong>| balance:
                  <strong>
                    {" "}
                    {data ? `${data.value} WETH` : "loading ..."}
                  </strong>
                </Button>
              </Badge>
            </Popover>
            <Button
              className={[
                buttonClass.button,
                buttonClass.uppercase,
                buttonClass.cancel,
              ].join(" ")}
              onClick={() => {
                disconnect();
              }}
            >
              Disconnect
            </Button>
          </>
        ) : (
          <>
            {connectors.map((connector) => {
              return (
                <Button
                  key={connector.name}
                  className={[buttonClass.button, buttonClass.uppercase].join(
                    " "
                  )}
                  onClick={() => {
                    connect({ connector });
                  }}
                >
                  Connect {connector.name}
                </Button>
              );
            })}
          </>
        )}
        <Button
          className={[buttonClass.button, buttonClass.uppercase].join(" ")}
          onClick={() => {
            setIsDev((prevState) => !prevState);
          }}
        >
          {isDev ? "Wallet Mode" : "Dev Mode"}
        </Button>
      </div>
    </div>
  );
}

const copyTxHash = (txHash: string) => {
  copyToClipboard(txHash).then(() => {});
  //toast("Transaction hash copied to clipboard!", { autoClose: 1000 }));
};
