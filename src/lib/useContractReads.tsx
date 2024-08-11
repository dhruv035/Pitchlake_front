import { useContractRead, UseContractReadProps } from "@starknet-react/core";
import { stat } from "fs";
import { Abi, Result } from "starknet";

const useContractReads = ({
  contractData,
  states,
  watch,
}: {
  contractData: { abi?: Abi; address?: string };
  watch?: boolean;
  states: Array<{ functionName: string; args?: Array<any>; key: string }>;
}) => {

  
  const obj:{[key:string]:Result|undefined}={};
  states.forEach((state) => {

    //Looped hooks, need to disable rules, the sequentially declaration is ensured here
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { data } = useContractRead({
      ...contractData,
      ...state,
      args: state.args ? state.args : [],
      watch,
    });
    if(state.key&&data)
    {
      obj[state.key]=data;
    }
    return data
  });
  return {...obj};
};

export default useContractReads;
