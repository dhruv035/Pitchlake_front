import { Account, CairoCustomEnum } from "starknet";

export type DepositArgs = {
  beneficiary: string;
  amount: number | bigint;
};

export type WithdrawArgs = {
  amount: number | bigint;
};

export type ApprovalArgs = {
  amount: number | bigint;
  spender: string;
};

export type TransactionResult = {
  transaction_hash: string;
};

export enum RoundState {
  Open = 0, // Accepting deposits, waiting for auction to start
  Auctioning = 1, // Auction is on going, accepting bids
  Running = 2, // Auction has ended, waiting for option round expiry date to settle
  Settled = 3,
}

export const RoundStateLabels: { [key in RoundState]: string } = {
  [RoundState.Open]: "Open",
  [RoundState.Auctioning]: "Auctioning",
  [RoundState.Running]: "Running",
  [RoundState.Settled]: "Settled",
};

export type VaultStateType = {
  ethAddress: string;
  address: string;
  vaultType: CairoCustomEnum;
  vaultLockedAmount: number | bigint | string;
  vaultUnlockedAmount: number | bigint | string;
  stashedBalance: number | bigint | string;
  lpLockedAmount: number | bigint | string;
  lpUnlockedAmount: number | bigint | string;
  currentRoundId: number | bigint | string;
  auctionRunTime: number | bigint | string;
  optionRunTime: number | bigint | string;
  roundTransitionPeriod: number | bigint | string;
};

export type VaultActionsType = {
  depositLiquidity: (depositArgs: DepositArgs) => Promise<void>;
  withdrawLiquidity: (withdrawArgs: WithdrawArgs) => Promise<void>;
  startAuction: () => Promise<void>;
  endAuction: () => Promise<void>;
  settleOptionRound: () => Promise<void>;
};

export type OptionRoundStateType = {
  address: string | undefined;
  reservePrice: bigint | number | string;
  strikePrice: bigint | number | string;
  capLevel: bigint | number | string;
  refundableBids: bigint | number | string;
  tokenizableOptions: bigint | number | string;
  roundId: bigint | number | string;
  totalOptionsAvailable: bigint | number | string;
  roundState: CairoCustomEnum;
  clearingPrice: bigint | number | string;
  optionsSold: bigint | number | string;
  auctionStartDate?: Date;
  auctionEndDate?: Date;
  optionSettleDate?: Date;
};

export interface VaultDetailsProps {
  vaultAddress: string;
  status: RoundState;
  strike: number;
  tvl: number;
  round: number;
  timeLeft?: string;
  capLevel: number;
  roundID: number;
  type: string;
  fees: number;
  apy?: number;
  pnl?: number;
  lastRoundPerf: number;
  currRoundPerf?: number;
  actions: string;
  auctionStartDate: Date;
  auctionEndDate: Date;
  optionSettleDate?: Date;
}

export interface InfoItemProps {
  label: string;
  value: React.ReactNode;
}

export interface BalanceTooltipProps {
  balance: {
    locked: string;
    unlocked: string;
    stashed: string;
  };
}

export enum CommonTabs {
  MyInfo = "My Info",
}

export enum ProviderTabs {
  Deposit = "Deposit",
  Withdraw = "Withdraw",
}

export enum BuyerTabs {
  PlaceBid = "Place Bid",
  History = "History",
  Refund = "Refund",
  Mint = "Mint",
  Exercise = "Exercise",
}

export enum WithdrawSubTabs {
  Liquidity = "Liquidity",
  Queue = "Queue",
  Collect = "Collect",
}

// Define a type for the user role
export enum VaultUserRole {
  Provider = "Provider",
  Buyer = "Buyer",
}

// Define a discriminated union for tabs based on user role
export type TabType =
  | { role: VaultUserRole.Provider; tab: ProviderTabs | CommonTabs }
  | { role: VaultUserRole.Buyer; tab: BuyerTabs | CommonTabs; state: RoundState };

export interface TabsProps {
  tabs: string[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export type OptionRoundActionsType = {
  placeBid: (placeBids: PlaceBidArgs) => Promise<void>;
  updateBid: (updateBid: UpdateBidArgs) => Promise<void>;
  refundUnusedBids: (refundBids: RefundBidsArgs) => Promise<void>;
  tokenizeOptions: () => Promise<void>;
  exerciseOptions: () => Promise<void>;
};

export type UpdateBidArgs = {
  bidId: string;
  amount: number | bigint;
  price: number | bigint;
};
export type PlaceBidArgs = {
  amount: number | bigint;
  price: number | bigint;
};
export type RefundableBidsArgs = {
  optionBuyer: string;
};
export type RefundBidsArgs = {
  optionBuyer: string;
};
