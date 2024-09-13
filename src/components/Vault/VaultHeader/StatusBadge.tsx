import React from "react";

interface StatusBadgeProps {
  status: string;
}

export const StatusOpenBadge: React.FC<StatusBadgeProps> = ({ status }) => (
  <span className="text-[#6AB942] bg-[#214C0B80] border border-[#347912] px-2 py-1 rounded-full text-sm font-medium">
    {status}
  </span>
);

export const StatusAuctioningBadge: React.FC<StatusBadgeProps> = ({
  status,
}) => (
  <span className="text-[#FFFFFF] bg-[#45454580] border border-[#BFBFBF] px-2 py-1 rounded-full text-sm font-medium">
    {status}
  </span>
);

export const StatusAuctionRunningBadge: React.FC<StatusBadgeProps> = ({
  status,
}) => (
  <span className="text-[#F78771] bg-[#6D1D0D59] border border-[#F78771] px-2 py-1 rounded-full text-sm font-medium">
    {status}
  </span>
);

export const StatusAuctionSettleBadge: React.FC<StatusBadgeProps> = ({
  status,
}) => (
  <span className="text-[#DA718C] bg-[#CC455E33] border border-[#DA718C] px-2 py-1 rounded-full text-sm font-medium">
    {status}
  </span>
);
