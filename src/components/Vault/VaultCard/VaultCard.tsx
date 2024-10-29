import { Progress } from "antd";
import styles from "./VaultCard.module.css";
import { useRouter } from "next/navigation";
import { shortenString, timeUntilTarget } from "@/lib/utils";
import useVaultState from "@/hooks/vault/useVaultState";
import {
  ActivityIcon,
  BarChartIcon,
  HourglassIcon,
  PieChartIcon,
  SpeedometerIcon,
  TagIcon,
} from "@/components/Icons";

export default function VaultCard({ vaultAddress }: { vaultAddress: string }) {
  const { vaultState } = useVaultState({
    conn: "rpc",
    address: vaultAddress,
    getRounds: false,
  }); //conn arguement hardcoded here. Make conn a context variable to feed everywhere
  const router = useRouter();
  var myHeaders = new Headers();
  myHeaders.append("accept", "application/json");
  myHeaders.append("content-type", "application/json");

  return (
    <div
      className="col-span-1 w-full border-[1px] border-greyscale-800 rounded-lg hover:cursor-pointer"
      onClick={() => {
        router.push(`/vaults/${vaultAddress}`);
      }}
    >
      <div className="bg-faded-black rounded-t-lg p-4 text-white">
        <div className="flex flex-row items-center">
          <p className="text-[14px] font-semibold">
            {
              //Add date logic
              "1 Month"
            }
          </p>
          <div className="bg-primary-800 rounded-full w-[5px] h-[5px] m-2" />
          <p className="text-[16px] font-regular text-[var(--buttongrey)]">
            {
              "ATM"
              //vaultState.vaultType
              //Add vault type here
            }
          </p>
        </div>
        <p className="text-[16px] font-regular text-[var(--buttongrey)]">
          {shortenString(vaultAddress)}{" "}
        </p>
      </div>
      <div className="flex flex-row w-full ">
        <div className="flex flex-col p-2 w-full border-r-[1px] border-greyscale-800">
          <div className="flex flex-row justify-between m-2">
            <div className="flex flex-row items-center">
              <SpeedometerIcon
                classname="w-4 h-4 mr-2"
                stroke={"var(--greyscale)"}
              />
              <p className="font-regular text-[14px] text-[#BFBFBF]">APY:</p>
            </div>

            <p className="text-[#fafafa] font-medium text-[14px]">
              {
                "12.3%"
                //Add APY from state here
              }
            </p>
          </div>
          <div className="flex flex-row justify-between m-2">
            <div className="flex flex-row items-center">
              <PieChartIcon
                classname="w-4 h-4 mr-2"
                stroke={"var(--greyscale)"}
              />
              <p className="font-regular text-[14px] text-[#BFBFBF]">Cap:</p>
            </div>

            <p className="text-[#fafafa] font-medium text-[14px]">{"78%"}</p>
          </div>
          <div className="flex flex-row justify-between m-2">
            <div className="flex flex-row items-center">
              <ActivityIcon
                classname="w-4 h-4 mr-2"
                stroke={"var(--greyscale)"}
              />
              <p className="font-regular text-[14px] text-[#BFBFBF]">Strike:</p>
            </div>

            <p className="text-[#fafafa] font-medium text-[14px]">
              {
                "10.00"
                //Add Strike price from state here
              }
              &nbsp; GWEI
            </p>
          </div>
        </div>
        <div className="flex flex-col p-2 w-full border-l-[1px] border-greyscale-800">
          <div className="flex flex-row justify-between m-2">
            <div className="flex flex-row items-center">
              <TagIcon classname="w-4 h-4 mr-2" stroke={"var(--greyscale)"} />
              <p className="font-regular text-[14px] text-[#BFBFBF]">FEES:</p>
            </div>

            <p className="text-[#fafafa] font-medium text-[14px]">
              {
                "12.3"
                //Add APY from state here
              }
              %
            </p>
          </div>
          <div className="flex flex-row justify-between m-2">
            <div className="flex flex-row items-center">
              <BarChartIcon
                classname="w-4 h-4 mr-2"
                stroke={"var(--greyscale)"}
              />
              <p className="font-regular text-[14px] text-[#BFBFBF]">TVL:</p>
            </div>

            <p className="text-[#fafafa] font-medium text-[14px]">
              {
                "12.3"
                //Add TVL from state here
              }
              &nbsp; ETH
            </p>
          </div>
          <div className="flex flex-row justify-between m-2">
            <div className="flex flex-row items-center">
              <HourglassIcon
                classname="w-4 h-4 mr-2"
                stroke={"var(--greyscale)"}
              />
              <p className="font-regular text-[14px] text-[#BFBFBF]">
                {
                  // If round is Open, "STARTS IN:", else "TIME LEFT:
                }
                TIME LEFT:
              </p>
            </div>

            <p className="text-[#fafafa] font-medium text-[14px]">
              {
                timeUntilTarget("1000000000", "1000044460")
                //Add Time left from state here
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
