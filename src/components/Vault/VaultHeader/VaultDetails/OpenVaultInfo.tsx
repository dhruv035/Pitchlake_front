// OpenVaultInfo.tsx
import React from "react";
import { VaultDetailsProps } from "@/lib/types";
import { InfoItem } from "../InfoItem";
import { StatusOpenBadge } from "@/components/Vault/VaultHeader/StatusBadge";
import { AddressLink } from "@/components/Vault/VaultHeader/AddressLink";
import { BalanceTooltip } from "@/components/BaseComponents/Tooltip";

export const OpenVaultInfo: React.FC<{ details: VaultDetailsProps }> = ({ details }) => (
  <>
    <InfoItem label="RUN TIME" value="1 Month" />
    <InfoItem label="STATUS" value={<StatusOpenBadge status="OPEN" />} />
    <InfoItem label="STRIKE" value={details.strike || "161.82 GWEI"} />
    <InfoItem label="CL" value="90%" />
    <InfoItem label="TVL" value="500/1,000 ETH" />
    <InfoItem label="CURRENT ROUND" value={<AddressLink text="Round 01" />} />
    <InfoItem label="TIME LEFT TO START" value="19 Days; 23:37" />
    <InfoItem label="TYPE" value={<InfoItem.ITMTooltip />} />
    <InfoItem label="ADDRESS" value={<AddressLink text="0x5d3...0657" />} />
    <InfoItem
      label="TOTAL BALANCE"
      value={
        <BalanceTooltip
          balance={{ locked: "", unlocked: "23.1", stashed: "16.98" }}
        >
          571.27 GWEI
        </BalanceTooltip>
      }
    />
    <InfoItem label="FEES" value="5.1%" />
    <InfoItem label="APY" value="12.31%" />
    <InfoItem label="LAST ROUND PERF." value={<InfoItem.Performance value="20.12%" />} />
    <InfoItem label="ACTIONS" value={<InfoItem.Action text="Start Auction" />} />
  </>
);