import { Account } from "starknet";

export type DepositArgs = {
    beneficiary: string;
    amount: number | bigint;
  };

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