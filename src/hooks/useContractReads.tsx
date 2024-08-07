import { useContractRead, UseContractReadProps } from "@starknet-react/core";
import { Abi } from "starknet";

const useContractReads = ({
  contractData,
  states,
}: {
  contractData: { abi?: Abi; address?: string };
  states: Array<{ functionName: string; args?: Array<any>; watch?: boolean }>;
}) => {
  const arrData: any = [];
  for (const state of states) {
    const { data } = useContractRead({ ...contractData, ...state });
    arrData.push(data);
  }
  return arrData;
};

export default useContractReads;
