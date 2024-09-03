import React from "react";
import { SquareArrowOutUpRight } from "lucide-react";

interface AddressLinkProps {
  text: string;
}

export const AddressLink: React.FC<AddressLinkProps> = ({ text }) => (
  <div className="text-[#F5EBB8]">
    {text} <SquareArrowOutUpRight className="inline h-3 w-3" />
  </div>
);