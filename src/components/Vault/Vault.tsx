"use client";
import RoundPerformanceChart from "./VaultChart/Chart";
import { useState } from "react";
import AuctionIcon from "../Icons/AuctionIcon";
import CoinStackedIcon from "../Icons/CoinStackedIcon";
import PanelRight from "./VaultActions/PanelRight";
import PanelLeft from "./VaultActions/PanelLeft";
import { useProtocolContext } from "@/context/ProtocolProvider";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export const Vault = () => {
  const [isProviderView, setIsProviderView] = useState(true);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const router = useRouter();

  const { vaultState } = useProtocolContext();
  return (
    <div className="px-7 py-7 flex-grow flex-box overflow-auto">
      <div className="flex flex-row-reverse text-primary">
        <div className="flex flex-row rounded-md border-[1px] border-greyscale-800 ">
          <div
            onClick={() => {
              setIsProviderView(true);
              setIsEditOpen(false);
            }}
            className={`flex flex-row items-center m-[1px] hover:cursor-pointer px-4 py-1 rounded-md text-[14px] ${
              isProviderView ? "bg-primary-900" : ""
            }`}
          >
            <CoinStackedIcon
              classname="mr-2"
              stroke={isProviderView ? "var(--primary)" : "var(--greyscale)"}
            />
            <p
              className={`font-medium ${
                isProviderView ? "text-primary" : "text-greyscale"
              }`}
            >
              Provider
            </p>
          </div>
          <div
            onClick={() => {
              setIsProviderView(false);
              //setIsEditOpen(false);
            }}
            className={`flex flex-row items-center m-[1px] hover:cursor-pointer p-4 rounded-md text-[14px] h-[44px] ${
              !isProviderView ? "bg-primary-900" : ""
            }`}
          >
            <AuctionIcon
              classname="mr-2"
              fill={isProviderView ? "var(--greyscale)" : "var(--primary)"}
            />
            <p
              className={`font-medium ${
                !isProviderView ? "text-primary" : "text-greyscale"
              }`}
            >
              Buyer
            </p>
          </div>
        </div>

        <div className="flex flex-row items-center ml-[16px] mr-[auto] text-[16px] font-medium text-[#FAFAFA]">
          Vault Details
        </div>
        <div className="flex items-center justify-center">
          <div
            onClick={() => {
              router.push("/");
            }}
            className="flex items-center justify-center w-[44px] h-[44px] border border-[#262626] rounded-lg cursor-pointer"
          >
            <ChevronLeft className="w-[16px] h-[16px] stroke-[#F5EBB8]" />
          </div>
        </div>
      </div>
      <div className="mt-6 flex flex-row">
        {vaultState && <PanelLeft userType={isProviderView ? "lp" : "ob"} />}
        {
          //Update the roundState to multiple roundStates and set selected round in the component
        }
        <RoundPerformanceChart />

        <div className="w-full ml-6 max-w-[350px]">
          <PanelRight
            userType={isProviderView ? "lp" : "ob"}
            isEditOpen={isEditOpen}
            setIsEditOpen={setIsEditOpen}
          />
        </div>
      </div>
    </div>
  );
};
