import {
  useContract,
} from "@starknet-react/core";
import { vaultABI } from "@/abi";
import { DepositArgs } from "@/lib/types";
import {  LibraryError } from "starknet";

const useVault = ({ address }: { address: string }) => {
  const typedContract = useContract({
    abi: vaultABI,
    address,
  }).contract?.typedv2(vaultABI);

  const depositLiquidity = async (depositArgs: DepositArgs) => {
    if (!typedContract) {
      //Throw toast here
      return;
    }
    try {
      const data = await typedContract.deposit_liquidity(
        depositArgs.amount,
        depositArgs.beneficiary
      );
      //Use data.transaction hash to watch for updates
    } catch (err) {
      const error = err as LibraryError;
      //Throw toast with library error
    }
  };

  const withdrawLiquidity = async (withdrawAmount: number | bigint) => {
    if (!typedContract) {
      //Throw toast here
      return;
    }
    try {
      const data = await typedContract.withdraw_liquidity(withdrawAmount);
      //Use data.transaction hash to watch for updates
    } catch (err) {
      const error = err as LibraryError;
      //Throw toast with library error
    }
  };

  //State Transition

  const startAuction = async () => {
    if (!typedContract) {
      //Throw toast here
      return;
    }
    try {
      const data = await typedContract.start_auction();
      //Use data.transaction hash to watch for updates
    } catch (err) {
      const error = err as LibraryError;
      //Throw toast with library error
    }
  };

  const endAuction = async () => {
    if (!typedContract) {
      //Throw toast here
      return;
    }
    try {
      const data = await typedContract.end_auction();
      //Use data.transaction hash to watch for updates
    } catch (err) {
      const error = err as LibraryError;
      //Throw toast with library error
    }
  };

  const settleOptionRound = async () => {
    if (!typedContract) {
      //Throw toast here
      return;
    }
    try {
      const data = await typedContract.settle_option_round();
      //Use data.transaction hash to watch for updates
    } catch (err) {
      const error = err as LibraryError;
      //Throw toast with library error
    }
  };
  //Read States

  return {
    depositLiquidity,
    withdrawLiquidity,
    startAuction,
    endAuction,
    settleOptionRound,
  };
};

export default useVault;
