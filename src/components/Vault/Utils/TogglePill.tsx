import React, { useState } from "react";
import { useAtom } from "jotai";
import { Database, UserCircle } from "lucide-react";
import { vaultUserType } from "@/lib/atom/user-tab";
import { VaultUserType } from "@/lib/types";

export const TogglePillButton = () => {
  const [vaultUser, setVaultUserType] = useAtom(vaultUserType);

  return (
    <div className="inline-flex rounded-md p-1 bg-[#0D0D0D] border border-[#262626]">
      <button
        className={`flex items-center px-4 py-2 rounded transition-colors duration-200 ease-in-out ${
          vaultUser === VaultUserType.Provider
            ? "bg-[#373632] text-[#F5EBB8]"
            : "text-gray-300 hover:text-white"
        }`}
        onClick={() => setVaultUserType(VaultUserType.Provider)}
      >
        <Database className="w-4 h-4 mr-2" />
        Provider
      </button>
      <button
        className={`flex items-center px-4 py-2 rounded transition-colors duration-200 ease-in-out ${
          vaultUser === VaultUserType.Buyer
            ? "bg-[#373632] text-[#F5EBB8]"
            : "text-gray-300 hover:text-white"
        }`}
        onClick={() => setVaultUserType(VaultUserType.Buyer)}
      >
        <UserCircle className="w-4 h-4 mr-2" />
        Buyer
      </button>
    </div>
  );
};

export default TogglePillButton;
