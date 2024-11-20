import React from "react";
import { Clock, Cog } from "lucide-react";
import {
  LineChartDownIcon,
  LineChartUpIcon,
  BriefCaseIcon,
} from "@/components/Icons";

export const getIconByRoundState = (
  roundState: string,
  isDisabled: boolean,
) => {
  const stroke = isDisabled ? "var(--greyscale)" : "var(--primary)";

  if (roundState === "Pending") return <Clock className="w-4 h-4 ml-2" />;
  if (roundState === "Open")
    return <LineChartUpIcon classname="w-4 h-4 ml-2" stroke={stroke} />;
  if (roundState === "Auctioning")
    return <LineChartDownIcon classname="w-4 h-4 ml-2" stroke={stroke} />;
  if (roundState === "FossilReady")
    return <Cog className="w-4 h-4 ml-2" stroke={stroke} />;
  if (roundState === "Running")
    return (
      <BriefCaseIcon
        classname="w-4 h-4 ml-2"
        fill="transparent"
        stroke={stroke}
      />
    );
  return null;
};
