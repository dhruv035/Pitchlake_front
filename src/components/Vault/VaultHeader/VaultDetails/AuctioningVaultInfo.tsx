import React from "react";
import { VaultDetailsProps } from "@/lib/types";
import { InfoItem } from "../InfoItem";
import { StatusBadge } from "../StatusBadge";
import { AddressLink } from "../AddressLink";
import { BalanceTooltip } from "@/components/BaseComponents/Tooltip";
import { Info } from "lucide-react";

export const AuctioningVaultInfo: React.FC<{ details: VaultDetailsProps }> = ({ details }) => (
  <>
    <InfoItem label="RUN TIME" value="1 Month" />
    <InfoItem label="STATUS" value={<StatusBadge status="Auctioning" />} />
    <InfoItem label="STRIKE" value={details.strike || "161.82 GWEI"} />
    <InfoItem label="CL" value="90%" />
    <InfoItem label="TVL" value="500/1,000 ETH" />
    <InfoItem label="SELECTED ROUND" value={<AddressLink text="Round 01" />} />
    <InfoItem label="TIME LEFT TO END" value="19 Days; 23:37" />
    <InfoItem label="TYPE" value={<InfoItem.ITMTooltip />} />
    <InfoItem label="ADDRESS" value={<AddressLink text="0x5d3...0657" />} />
    <InfoItem
      label="TOTAL BALANCE"
      value={
        <BalanceTooltip
          balance={{ locked: "", unlocked: "23.1", stashed: "16.98" }}
        >
          571.27 GWEI <Info className="inline h-4 w-4 ml-1 text-[#F5EBB8]" />
        </BalanceTooltip>
      }
    />
    <InfoItem label="FEES" value="5.1%" />
    <InfoItem label="APY" value="12.31%" />
    <InfoItem label="LAST ROUND PERF." value={<InfoItem.Performance value="20.12%" />} />
    <InfoItem label="ACTIONS" value={<InfoItem.Action text="End Auction" />} />
  </>
);
