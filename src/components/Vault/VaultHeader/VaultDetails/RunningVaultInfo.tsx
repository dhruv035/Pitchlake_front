import React from "react";
import { VaultDetailsProps } from "@/lib/types";
import { InfoItem } from "../InfoItem";
import { StatusAuctionRunningBadge } from "../StatusBadge";
import { AddressLink } from "../AddressLink";

export const RunningVaultInfo: React.FC<{ details: VaultDetailsProps }> = ({ details }) => (
  <>
    <InfoItem label="RUN TIME" value="1 Month" />
    <InfoItem label="STATUS" value={<StatusAuctionRunningBadge status="Running" />} />
    <InfoItem label="STRIKE" value={details.strike || "161.82 GWEI"} />
    <InfoItem label="AUCTION CLEARING PRICE" value="180 GWEI" />
    <InfoItem label="TOTAL PREMIUM" value="500 ETH" />
    <InfoItem label="SELECTED ROUND" value={<AddressLink text="Round 01" />} />
    <InfoItem label="SETTLEMENT DATE" value="2023-07-01" />
    <InfoItem label="TYPE" value={<InfoItem.ITMTooltip />} />
    <InfoItem label="ADDRESS" value={<AddressLink text="0x5d3...0657" />} />
    <InfoItem label="CL" value="90%" />
    <InfoItem label="TOTAL OPTIONS SOLD" value="1,000" />
    <InfoItem label="ERC20 Balance" value="500 ETH" />
    <InfoItem label="TVL" value="1,000 ETH" />
    <InfoItem label="ACTIONS" value={<InfoItem.Action text="Settle Option Round" />} />
  </>
);