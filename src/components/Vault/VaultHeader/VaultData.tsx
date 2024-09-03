import React from "react";
import { ChevronLeft } from "lucide-react";
import { TogglePillButton } from "../Utils/TogglePill";
import { VaultDetailsProps } from "@/lib/types";
import VaultDetails from "@/components/Vault/VaultHeader/VaultDetails";

const VaultData: React.FC<VaultDetailsProps> = (details) => {
  return (
    <div className="w-full bg-[#121212] border rounded-lg border-[#262626] text-white">
      <div className="p-4 border-b border-[#262626] flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <ChevronLeft className="h-5 w-5" />
          <span className="text-lg font-semibold">Vault Details</span>
        </div>
        <TogglePillButton />
      </div>

      <div className="p-6">
        <VaultDetails {...details} />
      </div>
    </div>
  );
};

export default VaultData;