import { useContractRead, UseContractReadProps } from "@starknet-react/core";
import { Abi } from "starknet";

const useContractReads = ({
  contractData,
  states,
}: {
  contractData: { abi?: Abi; address?: string };
  states: Array<{ functionName: string; args?: Array<any>; watch?: boolean }>;
}) => {
    const object:{[key:string]:any}={}
  const arrData = states.map(state=>{
    // eslint-disable-next-line react-hooks/rules-of-hooks
     const { data } = useContractRead({ ...contractData, ...state });
     return data;
  })

  return arrData;
};

export default useContractReads;
