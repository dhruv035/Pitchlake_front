import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { BellIcon, ChevronDownIcon, CopyIcon, LogOutIcon } from "lucide-react";
import Link from "next/link";
import classes from "../LayoutComponents/Header.module.css";
import logo_full from "@/../public/logo_full.svg";
import avatar from "@/../public/avatar.svg";
import { toast } from "react-toastify";
import {
  useAccount,
  useBalance,
  useConnect,
  useDisconnect,
} from "@starknet-react/core";

export const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const { account } = useAccount();
  const { data: balance } = useBalance({
    address: account?.address,
    watch: true,
  });
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    const handleEscKey = (event: any) => {
      if (event.key === "Escape") {
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
        console.log("Copied to clipboard");
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
    <nav className="w-full h-[92px] bg-[#121212] px-8 py-6 flex justify-between items-center border-b border-[#262626]">
      <div className="flex-shrink-0">
        <Image
          src={logo_full}
          alt="Pitchlake logo"
          width={200}
          height={100}
          className="cursor-pointer h-8 sm:h-10 md:h-12 lg:h-14"
          style={{ objectFit: "contain" }}
        />
      </div>

      <div className="flex items-center space-x-4">
        <div className="cursor-pointer bg-[#0D0D0D] border border-[#262626] p-2 rounded-md">
          <BellIcon className="h-6 w-6 text-[#C1C1C1]" />
        </div>
        <div className="relative" ref={dropdownRef}>
          {account ? (
            <>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center space-x-2 bg-[#111111] py-2 px-3 rounded-md border border-[#262626]"
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
                <div className="absolute right-0 mt-2 w-64 bg-[#111111] rounded-md shadow-lg py-1 border border-[#262626]">
                  <div className="px-4 py-2 text-sm text-white border-b border-[#262626]">
                    <div className="flex justify-between items-center">
                      <span id="balance">
                        {balance
                          ? `${balance.formatted} ${balance.symbol}`
                          : "0.00"} ETH
                      </span>
                      <CopyIcon
                        className="h-4 w-4 text-[#C1C1C1] cursor-pointer"
                        onClick={() =>
                          copyToClipboard(
                            balance
                              ? `${balance.formatted} ${balance.symbol}`
                              : ""
                          )
                        }
                      />
                    </div>
                  </div>
                  <div className="px-4 py-2 text-sm text-white border-b border-[#262626]">
                    <div className="flex justify-between items-center">
                      <span id="address">{shortenString(account.address)}</span>
                      <CopyIcon
                        className="h-4 w-4 text-[#C1C1C1] cursor-pointer"
                        onClick={() => copyToClipboard(account.address)}
                      />
                    </div>
                  </div>
                  <div
                    className="px-4 py-2 text-sm text-white hover:bg-[#262626] cursor-pointer"
                    onClick={() => disconnect()}
                  >
                    <div className="flex items-center space-x-2">
                      <LogOutIcon className="h-4 w-4" />
                      <span>Disconnect</span>
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="flex space-x-2">
              {connectors.map((connector) => (
                <button
                  key={connector.name}
                  onClick={() => connect({ connector })}
                  className="bg-[#111111] py-2 px-3 rounded-md border border-[#262626] text-white"
                >
                  Connect {connector.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
