import React, { useState } from "react";
import { SquarePen, SquareArrowOutUpRight, ChevronLeft } from "lucide-react";
import { useProvider, useExplorer, Explorer } from "@starknet-react/core";
import { Provider } from "starknet";

interface HistoryItem {
  address: string;
  options: number;
  pricePerOption: number;
  total: number;
}

interface HistoryProps {
  items: HistoryItem[];
  isEditOpen: boolean;
  setIsEditOpen: (open: boolean) => void;
}

const HistoryItem: React.FC<{
  item: HistoryItem;
  isLast: boolean;
  explorer: Explorer;
  setIsEditOpen: (open: boolean) => void;
  isEditOpen: boolean;
}> = ({ item, isLast, explorer, isEditOpen, setIsEditOpen }) => (
  <div
    className={`py-4 px-4 flex flex-row justify-between items-center ${!isLast ? "border-b border-[#262626]" : ""} m-0`}
  >
    <div className="flex align-center flex-col gap-1">
      <a href={explorer.contract(item.address)} target="_blank">
        <p className="text-[#F5EBB8] text-[12px] font-regular flex items-center cursor-pointer">
          {item.address.slice(0, 6)}...{item.address.slice(-4)}{" "}
          <span className="ml-1 cursor-pointer">
            <SquareArrowOutUpRight size={13} className="text-[#F5EBB8]" />
          </span>
        </p>
      </a>
      <p className="text-[#fafafa] font-regular text-[14px] text-sm">
        {item.options} options at {item.pricePerOption} ETH each
      </p>
      <p className="text-[12px] text-[var(--buttongrey)] font-regular">
        Total: {item.total} ETH
      </p>
    </div>
    <div className="bg-[#262626] p-2 rounded-lg cursor-pointer">
      <SquarePen
        onClick={() => setIsEditOpen(!isEditOpen)}
        size={20}
        className="text-[#E2E2E2]"
      />
    </div>
  </div>
);

const History: React.FC<HistoryProps> = ({
  items,
  isEditOpen,
  setIsEditOpen,
}) => {
  const explorer = useExplorer();

  const [modalState, setModalState] = useState<{
    show: boolean;
    //modalHeader: string;
    //action: ReactNode;
    onConfirm: () => Promise<void>;
  }>({
    show: false,
    //type: "confirmation",
    //modalHeader: "",
    //action: "",
    onConfirm: async () => {},
  });

  const showEditModal = async (
    //modalHeader: string,
    //action: ReactNode,
    onConfirm: () => Promise<void>,
  ) => {
    setModalState({
      show: true,
      //type: "confirmation",
      //modalHeader,
      //action,
      onConfirm,
    });
  };
  const hideEditModal = async (
    //modalHeader: string,
    //action: ReactNode,
    onConfirm: () => Promise<void>,
  ) => {
    setModalState({
      show: false,
      //type: "confirmation",
      //modalHeader,
      //action,
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
          setIsEditOpen={() => setIsEditOpen(!isEditOpen)}
          isEditOpen={isEditOpen}
        />
      ))}
    </div>
  );
};

export default History;
