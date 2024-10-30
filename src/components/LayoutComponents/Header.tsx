"use client";
import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";

import { BellIcon, ChevronDownIcon } from "lucide-react";
import logo_full from "@/../public/logo_full.svg";
import login from "@/../public/login.svg";
import braavosIcon from "@/../public/braavos.svg";
import argent from "@/../public/argent.svg";
import avatar from "@/../public/avatar.svg";
import { toast, ToastContainer, Bounce } from "react-toastify";
import {
  braavos,
  useAccount,
  useBalance,
  useConnect,
  useDeployAccount,
  useDisconnect,
  useProvider,
} from "@starknet-react/core";
import ProfileDropdown from "../BaseComponents/ProfileDropdown";
import { copyToClipboard } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useProtocolContext } from "@/context/ProtocolProvider";
import {
  Account,
  BigNumberish,
  RawArgs,
  DeployAccountContractPayload,
  CallData,
  hash,
  num,
  // ArgentX,
} from "starknet";
import useERC20 from "@/hooks/erc20/useERC20";
import useFossil from "@/hooks/fossil/useFossil";

export default function Header() {
  const { conn, timeStamp, mockTimeForward, vaultState, selectedRoundState } =
    useProtocolContext();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const isDropdownOpenRef = useRef(isDropdownOpen);
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const { deployAccount, deployAccountAsync } = useDeployAccount({});
  const router = useRouter();
  const { account } = useAccount();
  const { provider } = useProvider();
  console.log("Provider:", provider);
  const { approve, fund } = useERC20(
    "0x49d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7",
    vaultState?.address,
    account,
  );
  const { fund: fundStrk } = useERC20(
    "0x4718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d",
    vaultState?.address,
    account,
  );

  const { fossilCallback } = useFossil(
    vaultState ? vaultState.fossilClientAddress : "",
    account,
  );

  const dropdownRef = useRef<HTMLDivElement>(null);

  const balanceData = {
    wallet: "36.05",
    locked: "45.82",
    unlocked: "24.09",
    stashed: "12.72",
  };

  useEffect(() => {
    isDropdownOpenRef.current = isDropdownOpen;
  }, [isDropdownOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isDropdownOpenRef.current &&
        !dropdownRef?.current?.contains(event.target as HTMLDivElement)
      ) {
        setIsDropdownOpen(false);
      }
    };

    const handleEscKey = (event: KeyboardEvent) => {
      if (isDropdownOpenRef.current && event.key === "Escape") {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscKey);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscKey);
    };
  }, []);

  const copyToClipboard = (text: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        // Add a toast message
        toast("Copied to clipboard", { type: "success" });
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
      });
  };

  const shortenString = (str: string) => {
    return str ? `${str.slice(0, 6)}...${str.slice(-4)}` : "";
  };

  const mockFossilCall = async () => {
    console.log("Mocking fossil call");
    const roundId = selectedRoundState ? selectedRoundState.roundId : "";
    const roundState = selectedRoundState
      ? selectedRoundState
      : { roundState: "", deploymentDate: "0", optionSettleDate: "0" };
    const roundStateState = roundState.roundState;

    const targetTimestamp =
      roundId === "1" && roundStateState === "Open"
        ? roundState.deploymentDate
        : roundState.optionSettleDate;

    const settlementDate = selectedRoundState
      ? selectedRoundState.optionSettleDate.toString()
      : "0";

    // make request to fossil api using the settlement date (or auction start date if initial case)

    // for now, we will just send a mock result to the client (no address assertions at this time)

    const request = [
      vaultState ? vaultState.address : "",
      targetTimestamp,
      "0x50495443485f4c414b455f5631",
    ];

    const result = [
      //0x6 0x02540be400 0x00 0x0d05 0x77359400 0x00 0x00 --fee-token eth
      "0x02540be400",
      "0x00",
      "0x0d05",
      parseInt((Math.random() * 1000000000).toString()).toString(),
      "0",
      // "0x77359400",
      "0x0",
    ];

    await fossilCallback(request, result);
  };

  const fundAndDeploy = async (): Promise<void> => {
    ///// Set allowance
    //console.log("APPROVING", "acc");
    //await approve({
    //  amount: num.toBigInt("1000000000000000000"),
    //  spender: vaultState ? vaultState.address : "",
    //});

    /// Fund account
    console.log("funding...");
    await fund({
      amount: num.toBigInt("100000000000000000000"),
      spender: account ? account.address : "",
    });
    // Nonce issue when both in same txn
    //await fundStrk({
    //  amount: num.toBigInt("100000000000000000000"),
    //  spender: account ? account.address : "",
    //});
    console.log("funded");

    //// Make the POST request
    //try {
    //  const response = await fetch("http://localhost:3000/pricing_data", {
    //    method: "POST",
    //    headers: {
    //      "Content-Type": "application/json",
    //      "x-api-key": "b2ed9cdc-2dd0-4b81-8ed4-bcefbf29ddc1",
    //    },
    //    body: JSON.stringify({
    //      identifiers: ["PITCH_LAKE_V1"],
    //      params: {
    //        twap: [1730053616, 1730140016],
    //        volatility: [1729880816, 1730140016],
    //        reserve_price: [1729880816, 1730140016],
    //      },
    //      client_info: {
    //        client_address: account ? account.address : "",
    //        vault_address: vaultState ? vaultState.address : "",
    //        timestamp: 1730140016,
    //      },
    //    }),
    //  });

    //  if (!response.ok) {
    //    const errorText = await response.text();
    //    console.error("Error sending request:", errorText);
    //    throw new Error("Failed to send request");
    //  }

    //  const result = await response.json();
    //  console.log("Post result:", result);
    //} catch (error) {
    //  console.error("Error during fundAndDeploy:", error);
    //}
  };

  return (
    <nav className="absolute top-0 z-50 w-full h-[84px] bg-[#121212] px-8 py-6 flex justify-between items-center border-b border-[#262626]">
      <div className="flex-shrink-0">
        <Image
          onClick={() => {
            router.push("/");
          }}
          src={logo_full}
          alt="Pitchlake logo"
          width={200}
          height={100}
          className="cursor-pointer h-8 sm:h-10 md:h-12 lg:h-14"
          style={{ objectFit: "contain" }}
        />
      </div>

      {
        // Mock //
      }

      <div className="flex items-center space-x-4 text-[14px] font-medium">
        {conn === "mock" && (
          <div>
            <p>{timeStamp.toString()}</p>
            <button onClick={() => mockTimeForward()}>Forward Mock Time</button>
          </div>
        )}
        <div className="cursor-pointer border-[1px] border-greyscale-800 p-2 rounded-md">
          <BellIcon className="h-6 w-6 text-primary" />
        </div>
        {account ? (
          <button
            onClick={mockFossilCall}
            className="font-medium cursor-pointer border-[1px] border-greyscale-800 p-2 rounded-md"
          >
            Mock Fossil API
          </button>
        ) : (
          <></>
        )}

        {account ? (
          <button
            onClick={fundAndDeploy}
            className="font-medium cursor-pointer border-[1px] border-greyscale-800 p-2 rounded-md"
          >
            Fund and Deploy Account
          </button>
        ) : (
          <></>
        )}

        <div className="relative" ref={dropdownRef}>
          {account ? (
            <>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center space-x-2 py-2 px-3 rounded-md border border-greyscale-800 w-[164px] h-[44px]"
              >
                <Image
                  src={avatar}
                  alt="User avatar"
                  width={24}
                  height={24}
                  className="rounded-full"
                />
                <span className="text-white" font-medium>
                  {shortenString(account.address)}
                </span>
                <ChevronDownIcon className="h-4 w-4 text-white" />
              </button>

              {isDropdownOpen && (
                <>
                  <ProfileDropdown
                    account={account}
                    balance={balanceData}
                    disconnect={disconnect}
                    copyToClipboard={copyToClipboard}
                  />
                  <ToastContainer
                    autoClose={3000}
                    closeOnClick
                    hideProgressBar={false}
                    transition={Bounce}
                    //theme="dark"
                  />
                </>
              )}
            </>
          ) : (
            <>
              <button
                className="flex flex-row min-w-16 bg-primary-400 text-black text-sm px-8 py-4 rounded-md w-[123px] h-[44px] items-center justify-center"
                onClick={() => setIsDropdownOpen((state) => !state)}
              >
                <p>Connect</p>
                <Image
                  src={login}
                  alt="Login"
                  width={18}
                  height={18}
                  className="ml-1"
                  style={{ objectFit: "contain" }}
                />
              </button>
              {isDropdownOpen && (
                <div className="absolute right-0 w-[196px] text-sm flex flex-col mt-2 ">
                  <div className="bg-greyscale-900 rounded-md">
                    <div className="p-4">CHOOSE A WALLET</div>
                    {connectors.map((connector) => (
                      <div
                        key={connector.name}
                        onClick={() => connect({ connector })}
                        className="sticky p-2 bg-black w-full text-white"
                      >
                        {
                          <div className="flex flex-row items-center">
                            <Image
                              src={
                                connector.name === "braavos"
                                  ? braavosIcon
                                  : argent
                              }
                              alt="Login"
                              width={20}
                              height={30}
                              className="m-2"
                              style={{ objectFit: "contain" }}
                            />
                            {connector.name.toLocaleUpperCase()}
                          </div>
                        }
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

const copyTxHash = (txHash: string) => {
  copyToClipboard(txHash).then(() => {});
  //toast("Transaction hash copied to clipboard!", { autoClose: 1000 }));
};
