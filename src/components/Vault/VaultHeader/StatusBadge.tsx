import React from "react";

interface StatusBadgeProps {
  status: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => (
  <span className="text-[#6AB942] bg-[#214C0B80] border border-[#347912] px-2 py-1 rounded-full text-xs">
    {status}
  </span>
);
