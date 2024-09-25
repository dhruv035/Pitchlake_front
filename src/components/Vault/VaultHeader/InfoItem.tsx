import React from "react";
import { Info, SquareArrowOutUpRight, ArrowRightIcon, ChartLine } from "lucide-react";
import { Tooltip } from "@/components/BaseComponents/Tooltip";

interface InfoItemProps {
  label: string;
  value: React.ReactNode;
}

export const InfoItem: React.FC<InfoItemProps> & {
  ITMTooltip: React.FC;
  Performance: React.FC<{ value: string }>;
  Action: React.FC<{ text: string }>;
} = ({ label, value }) => (
  <div>
    <div className="text-gray-500 text-xs uppercase mb-1">{label}</div>
    <div className="font-medium text-sm">{value}</div>
  </div>
);

InfoItem.ITMTooltip = () => (
  <Tooltip text="In the Money">
    ITM <Info className="inline h-4 w-4 ml-1 text-[#F5EBB8]" />
  </Tooltip>
);
InfoItem.ITMTooltip.displayName = "InfoItem.ITMTooltip";

InfoItem.Performance = ({ value }) => (
  <span className="text-[#F5EBB8]">
    {value} <ArrowRightIcon className="inline h-3 w-3" />
  </span>
);

InfoItem.Performance.displayName = "InfoItem.Performance";
InfoItem.Action = ({ text }) => (
  <span className="text-[#F5EBB8]">
    {text} <ChartLine className="inline h-3 w-3 ml-1" />
  </span>
);
InfoItem.Action.displayName = "InfoItem.Action";  