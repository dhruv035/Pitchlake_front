import React from "react";
import { VaultDetailsProps } from "@/lib/types";
import { InfoItem } from "../InfoItem";
import { StatusBadge } from "../StatusBadge";
import { AddressLink } from "../AddressLink";

export const SettledVaultInfo: React.FC<{ details: VaultDetailsProps }> = ({ details }) => (
  <>
    <InfoItem label="RUN TIME" value="1 Month" />
    <InfoItem label="STATUS" value={<StatusBadge status="Settled" />} />
    <InfoItem label="CL" value="90%" />
    <InfoItem label="TVL" value="1,000 ETH" />
    <InfoItem label="SELECTED ROUND" value={<AddressLink text="Round 01" />} />
    <InfoItem label="SETTLEMENT DATE" value="2023-07-01" />
    <InfoItem label="TYPE" value={<InfoItem.ITMTooltip />} />
    <InfoItem label="ADDRESS" value={<AddressLink text="0x5d3...0657" />} />
    <InfoItem label="FEES" value="5.1%" />
    <InfoItem label="STRIKE" value={details.strike || "161.82 GWEI"} />
    <InfoItem label="THIS ROUND PERF." value={<InfoItem.Performance value="25%" />} />
    <InfoItem label="My P&L" value="2.5 ETH" />
  </>
);