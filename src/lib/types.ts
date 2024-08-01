import { Account, CairoCustomEnum } from "starknet";

export type DepositArgs = {
    beneficiary: string;
    amount: number | bigint;
  };

export type WithdrawArgs = {
    amount:number|bigint
}

export type ApprovalArgs = {
  amount:number|bigint
  spender:string
}

export type TransactionResult = {
  transaction_hash: string;
}


  export enum RoundState {
    Open=0, // Accepting deposits, waiting for auction to start
    Auctioning=1, // Auction is on going, accepting bids
    Running=2, // Auction has ended, waiting for option round expiry date to settle
    Settled=3,
}
export const RoundStateLabels: { [key in RoundState]: string } = {
  [RoundState.Open]: "Open",
  [RoundState.Auctioning]: "Auctioning",
  [RoundState.Running]: "Running",
  [RoundState.Settled]:"Settled"
};

export type VaultState ={
  ethAddress:string,
  address:string,
  vaultType:CairoCustomEnum,
  vaultLockedAmount:number|bigint|string,
  vaultUnlockedAmount:number|bigint|string,
  lpLockedAmount:number|bigint|string,
  lpUnlockedAmount:number|bigint|string,
  currentRoundId:number|bigint|string,
  auctionRunTime:number|bigint|string,
  optionRunTime:number|bigint|string,
  roundTransitionPeriod:number|bigint|string,
}

export type VaultActionsType = {
  depositLiquidity: (depositArgs: DepositArgs) => Promise<TransactionResult | undefined>;
  withdrawLiquidity: (withdrawArgs: WithdrawArgs) => Promise<void>;
  startAuction: () => Promise<void>;
  endAuction: () => Promise<void>;
  settleOptionRound: () => Promise<void>;
}


export type OptionRoundState = {
   reservePrice:bigint|number|string,
      strikePrice:bigint|number|string,
      capLevel:bigint|number|string,
      refundableBids:bigint|number|string,
      tokenizableOptions:bigint|number|string,
      roundId:bigint|number|string,
      totalOptionsAvailable:bigint|number|string,
      roundState: CairoCustomEnum,
      clearingPrice:bigint|number|string,
      optionsSold:bigint|number|string,
      auctionStartDate:Date,
      auctionEndDate:Date,
      optionSettleDate:Date
}


export type Vault = {
  address:string;
  underlying:string;
  strikePrice:string;
  capLevel:string;
  totalLocked:string;
  totalUnlocked:string;
  currentRoundId:string;
  auctionRunTime:string|number;
  optionSettleTime:string|number;
  
  /*Contract storage
  eth_address: ContractAddress,
  option_round_class_hash: ClassHash,
  positions: LegacyMap<(ContractAddress, u256), u256>,
  withdraw_checkpoints: LegacyMap<ContractAddress, u256>,
  total_unlocked_balance: u256,
  total_locked_balance: u256,
  premiums_collected: LegacyMap<(ContractAddress, u256), u256>,
  unsold_liquidity: LegacyMap<u256, u256>,
  current_option_round_id: u256,
  vault_manager: ContractAddress,
  vault_type: VaultType,
  market_aggregator: ContractAddress,
  round_addresses: LegacyMap<u256, ContractAddress>,
  round_transition_period: u64,
  auction_run_time: u64,
  option_run_time: u64,
   */
}
  
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