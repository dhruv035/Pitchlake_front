import React from "react";
import { VaultDetailsProps } from "@/lib/types";
import { OpenVaultInfo } from "@/components/Vault/VaultHeader/VaultDetails/OpenVaultInfo";
import { AuctioningVaultInfo } from "@/components/Vault/VaultHeader/VaultDetails/AuctioningVaultInfo";
import { RunningVaultInfo } from "@/components/Vault/VaultHeader/VaultDetails/RunningVaultInfo";
import { SettledVaultInfo } from "@/components/Vault/VaultHeader/VaultDetails/SettledVaultInfo";

const VaultDetails: React.FC<VaultDetailsProps> = (details) => {
  const renderVaultInfo = () => {
    switch (details.status) {
      case 0:
        return <OpenVaultInfo details={details} />;
      case 1:
        return <AuctioningVaultInfo details={details} />;
      case 2:
        return <RunningVaultInfo details={details} />;
      case 3:
        return <SettledVaultInfo details={details} />;
      default:
        return null;
    }
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7 gap-x-4 gap-y-6 mb-6">
      {renderVaultInfo()}
    </div>
  );
};

export default VaultDetails;
