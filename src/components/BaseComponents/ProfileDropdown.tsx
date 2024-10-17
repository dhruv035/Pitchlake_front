import React from "react";
import { CopyIcon, LogOutIcon } from "lucide-react";

interface ProfileDropdownProps {
  account: {
    address: string;
  };
  balance: {
    wallet: string;
    locked: string;
    unlocked: string;
    stashed: string;
  };
  disconnect: () => void;
  copyToClipboard: (text: string) => void;
}

const ProfileDropdown: React.FC<ProfileDropdownProps> = ({
  account,
  balance,
  disconnect,
  copyToClipboard,
}) => {
  return (
    <div className="absolute right-0 mt-2 w-64 bg-black rounded-md shadow-lg py-1 border border-greyscale-800">
      <div className="px-4 py-2 text-sm text-white border-b border-greyscale-800 flex justify-between items-center">
        <span>
          {account.address.slice(0, 6)}...{account.address.slice(-4)}
        </span>
        <CopyIcon
          className="h-4 w-4 text-white-alt cursor-pointer"
          onClick={() => copyToClipboard(account.address)}
        />
      </div>
      <div className="px-4 py-2 text-sm text-white border-b border-greyscale-800">
        <h3 className="text-white-alt mb-2">MY BALANCE</h3>
        <div className="space-y-1">
          <div className="flex justify-between">
            <span>Wallet</span>
            <span>{balance.wallet} ETH</span>
          </div>
          <div className="flex justify-between">
            <span>Locked</span>
            <span>{balance.locked} ETH</span>
          </div>
          <div className="flex justify-between">
            <span>Unlocked</span>
            <span>{balance.unlocked} ETH</span>
          </div>
          <div className="flex justify-between">
            <span>Stashed</span>
            <span>{balance.stashed} ETH</span>
          </div>
        </div>
      </div>
      <div
        className="px-4 py-2 text-sm text-white hover:bg-greyscale-800 cursor-pointer flex justify-between items-center"
        onClick={disconnect}
      >
        <span>Disconnect</span>
        <LogOutIcon className="h-4 w-4 text-greyscale" />
      </div>
    </div>
  );
};

export default ProfileDropdown;

