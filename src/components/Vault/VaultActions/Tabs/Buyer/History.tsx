import React, { useState } from "react";
import { SquarePen, SquareArrowOutUpRight, ChevronLeft } from "lucide-react";
import { useProvider, useExplorer, Explorer } from "@starknet-react/core";
import { Provider } from "starknet";
import { formatNumberText } from "@/lib/utils";
import { formatUnits } from "ethers";

interface HistoryItem {
  bid_id: string;
  amount: string | number | bigint;
  price: string | number | bigint;
}

interface HistoryProps {
  items: HistoryItem[];
  bidToEdit: any;
  isTabsHidden: boolean;
  setBidToEdit: (bid: any) => void;
  setIsTabsHidden: (open: boolean) => void;
  //setIsTabsHidden: (open: boolean) => void;
}

const HistoryItem: React.FC<{
  item: HistoryItem;
  isLast: boolean;
  explorer: Explorer;
  setIsTabsHidden: (open: boolean) => void;
  setBidToEdit: (bid: any) => void;
  isTabsHidden: boolean;
}> = ({
  item,
  isLast,
  explorer,
  isTabsHidden,
  setIsTabsHidden,
  setBidToEdit,
}) => (
  <div
    className={`py-4 px-4 flex flex-row justify-between items-center ${!isLast ? "border-b border-[#262626]" : ""} m-0`}
  >
    <div className="flex align-center flex-col gap-1">
      {
        //////// REPLACE WITH TXN HASH IF POSSIBLE LATER
        // <a href={explorer.contract(item.address)} target="_blank">
        //   <p className="text-[#F5EBB8] text-[12px] font-regular flex items-center cursor-pointer">
        //   {item.address.slice(0, 6)}...{item.address.slice(-4)}{" "}
        //   <span className="ml-1 cursor-pointer">
        //     <SquareArrowOutUpRight size={13} className="text-[#F5EBB8]" />
        //   </span>
        // </p>
        // </a>
      }
      <p className="text-[#fafafa] font-regular text-[14px] text-sm">
        {formatNumberText(Number(item.amount))} options at{" "}
        {formatUnits(item.price, "gwei")} GWEI each
      </p>
      <p className="text-[12px] text-[var(--buttongrey)] font-regular">
        Total: {Number(formatUnits(item.price, "ether")) * Number(item.amount)}{" "}
        ETH
      </p>
    </div>
    <div className="bg-[#262626] p-2 rounded-lg cursor-pointer">
      <SquarePen
        onClick={() => {
          setBidToEdit({ item });
          setIsTabsHidden(!isTabsHidden);
        }}
        size={20}
        className="text-[#E2E2E2]"
      />
    </div>
  </div>
);

const History: React.FC<HistoryProps> = ({
  items,
  bidToEdit,
  isTabsHidden,
  setIsTabsHidden,
  setBidToEdit,
}) => {
  const explorer = useExplorer();

  const [modalState, setModalState] = useState<{
    show: boolean;
    onConfirm: () => Promise<void>;
  }>({
    show: false,
    onConfirm: async () => {},
  });

  const showEditModal = async (onConfirm: () => Promise<void>) => {
    setModalState({
      show: true,
      onConfirm,
    });
  };
  const hideEditModal = async (onConfirm: () => Promise<void>) => {
    setModalState({
      show: false,
      onConfirm,
    });
  };

  return (
    <div className="">
      {items.map((item, index) => (
        <HistoryItem
          key={index}
          item={item}
          isLast={index === items.length - 1}
          explorer={explorer}
          isTabsHidden={isTabsHidden}
          setIsTabsHidden={() => {
            setIsTabsHidden(!isTabsHidden);
            // also need to now show edit modal
          }}
          setBidToEdit={setBidToEdit}
        />
      ))}
    </div>
  );
};

export default History;
