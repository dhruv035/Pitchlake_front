import { VaultDetailsProps, RoundState } from "@/lib/types";

const mockVaultDetails: VaultDetailsProps = {
  vaultAddress: "0x1234567890abcdef1234567890abcdef12345678",
  status: RoundState.Open,
  strike: 2500,
  tvl: 5000000,
  round: 2,
  timeLeft: "3 days",
  capLevel: 10000000,
  roundID: 10,
  type: "Call",
  fees: 2.5,
  apy: 8.5,
  pnl: 15,
  lastRoundPerf: 12,
  currRoundPerf: 10,
  actions: "withdraw",
  auctionStartDate: new Date("2024-09-01T10:00:00Z"),
  auctionEndDate: new Date("2024-09-03T10:00:00Z"),
  optionSettleDate: new Date("2024-09-05T10:00:00Z")
};

export { mockVaultDetails };