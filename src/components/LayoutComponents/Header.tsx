"use client";
import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";

import { BellIcon, ChevronDownIcon } from "lucide-react";
import logo_full from "@/../public/logo_full.svg";
import login from "@/../public/login.svg";
import braavosIcon from "@/../public/braavos.svg";
import argent from "@/../public/argent.svg";
import avatar from "@/../public/avatar.svg";
import { toast } from "react-toastify";
import {
  braavos,
  useAccount,
  useBalance,
  useConnect,
  useDisconnect,
} from "@starknet-react/core";
import ProfileDropdown from "../BaseComponents/ProfileDropdown";
import { copyToClipboard } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useProtocolContext } from "@/context/ProtocolProvider";

export default function Header() {
  const { conn, timeStamp,mockTimeForward } = useProtocolContext();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const isDropdownOpenRef = useRef(isDropdownOpen);
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const router = useRouter();
  const { account } = useAccount();

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
        toast("Copied to clipboard", { autoClose: 1000 });
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
      });
  };

  const shortenString = (str: string) => {
    return str ? `${str.slice(0, 6)}...${str.slice(-4)}` : "";
  };

  return (
    <nav className="absolute top-0 z-50 w-full h-[92px] bg-[#121212] px-8 py-6 flex justify-between items-center border-b border-[#262626]">
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

      <div className="flex items-center space-x-4">
        {conn === "mock" && (
          <div>
            <p>
              {timeStamp.toString()}
            </p>
          <button onClick={() => mockTimeForward()}>Forward Mock Time</button>
          </div>
        )}
        <div className="cursor-pointer border-[1px] border-greyscale-800 p-2 rounded-md">
          <BellIcon className="h-6 w-6 text-primary" />
        </div>
        <div className="relative" ref={dropdownRef}>
          {account ? (
            <>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center space-x-2 py-2 px-3 rounded-md border border-greyscale-800"
              >
                <Image
                  src={avatar}
                  alt="User avatar"
                  width={24}
                  height={24}
                  className="rounded-full"
                />
                <span className="text-white">
                  {shortenString(account.address)}
                </span>
                <ChevronDownIcon className="h-4 w-4 text-white" />
              </button>

              {isDropdownOpen && (
                <ProfileDropdown
                  account={account}
                  balance={balanceData}
                  disconnect={disconnect}
                  copyToClipboard={copyToClipboard}
                />
              )}
            </>
          ) : (
            <>
              <button
                className="flex flex-row min-w-16 bg-primary-400 text-black text-sm px-8 py-4 rounded-md"
                onClick={() => setIsDropdownOpen((state) => !state)}
              >
                <p>Connect</p>
                <Image
                  src={login}
                  alt="Login"
                  width={20}
                  height={30}
                  className="ml-2"
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
