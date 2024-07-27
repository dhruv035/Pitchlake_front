import { Account } from "starknet";

export type DepositArgs = {
    beneficiary: string;
    amount: number | bigint;
  };
  
  export type UpdateBidArgs = {
    bidId: string;
    amount: number;
    price: number;
  };
  export type PlaceBidArgs = {
    amount: number | bigint;
    price: number | bigint;
  };
  export type RefundableBidsArgs = {
    optionBuyer: string;
  };