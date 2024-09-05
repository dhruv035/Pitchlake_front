import React, { useState } from "react";
import { SquarePen, SquareArrowOutUpRight } from "lucide-react";

interface HistoryItem {
  address: string;
  options: number;
  pricePerOption: number;
  total: number;
}

interface HistoryProps {
  items: HistoryItem[];
}

const HistoryItem: React.FC<{ item: HistoryItem; isLast: boolean }> = ({
  item,
  isLast,
}) => (
  <div className={`py-4 ${!isLast ? "border-b border-[#262626]" : ""}`}>
    <div className="flex justify-between items-center">
      <div>
        <p className="text-[#E2E2E2] font-semibold flex items-center">
          {item.address.slice(0, 6)}...{item.address.slice(-4)}{" "}
          <span className="ml-1 cursor-pointer">
            <SquareArrowOutUpRight size={16} className="text-[#9CA3AF]" />
          </span>
        </p>
        <p className="text-[#9CA3AF] text-sm">
          {item.options} options at {item.pricePerOption} ETH each
        </p>
        <p className="text-[#E2E2E2] font-medium">Total: {item.total} ETH</p>
      </div>
      <div className="bg-[#262626] p-2 rounded-lg cursor-pointer">
        <SquarePen size={20} className="text-[#E2E2E2]" />
      </div>
    </div>
  </div>
);

const History: React.FC<HistoryProps> = ({ items }) => {
  return (
    <div className="space-y-2">
      {items.map((item, index) => (
        <HistoryItem key={index} item={item} />
      ))}
    </div>
  );
};

export default History;
