import { Progress } from "antd";
import styles from "./VaultCard.module.css";
import { useRouter } from "next/navigation";
import { shortenString } from "@/lib/utils";
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
  
  const { vaultState } = useVaultState({conn:"rpc",address:vaultAddress, getRounds:false}); //conn arguement hardcoded here. Make conn a context variable to feed everywhere
  const router = useRouter();
  var myHeaders = new Headers();
  myHeaders.append("accept", "application/json");
  myHeaders.append("content-type", "application/json");

  return (
    <div
      className="col-span-1 w-full border-[1px] border-greyscale-800 rounded-lg"
      onClick={() => {
        router.push(`/vaults/${vaultAddress}`);
      }}
    >
      <div className="bg-faded-black rounded-t-lg p-4 text-white">
        <div className="flex flex-row items-center">
          <p>
            {
              //Add date logic
              "1 Month"
            }
          </p>
          <div className="bg-primary-800 rounded-full w-[5px] h-[5px] m-2" />
          <p>
            {
            vaultState.vaultType
              //Add vault type here
            }
          </p>
        </div>
        <p className="text-greyscale">
          {shortenString(vaultAddress)} |{" "}
          {vaultState.vaultType}
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
              <p>APY:</p>
            </div>

            <p>
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
              <p>CL:</p>
            </div>

            <p>
              {
                "78%"
                //Add CL from state here
              }
            </p>
          </div>
          <div className="flex flex-row justify-between m-2">
            <div className="flex flex-row items-center">
              <ActivityIcon
                classname="w-4 h-4 mr-2"
                stroke={"var(--greyscale)"}
              />
              <p>Strike:</p>
            </div>

            <p>
              {
                "5123.32"
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
              <p>FEES:</p>
            </div>

            <p>
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
              <p>TVL:</p>
            </div>

            <p>
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
              <p>TIME LEFT:</p>
            </div>

            <p>
              {
                "5 Days"
                //Add Time left from state here
              }
              &nbsp; LEFT
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
